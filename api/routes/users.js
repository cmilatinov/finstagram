const express = require('express');
const router = express();
const bcrypt = require('bcryptjs');

const auth = require('../helpers/auth');
const needAuth = require('../helpers/needAuth');
const db = require('../helpers/db');
const utils = require('../helpers/utils');
const sendError = require('../helpers/sendError');

router.post('/register', async (req, res) => {
	if (utils.fieldsEmptyOrNull(req.body, 'firstname', 'lastname', 'username', 'password', 'email'))
		return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid request body.' });

	let { username, firstname, lastname, password, email } = req.body;

	try {
		// Trim all fields
		firstname = firstname.trim();
		lastname = lastname.trim();
		username = username.trim();
		email = email.trim();

		// Check if username or email exists
		let existingUser = await db('users')
			.select()
			.where('username', username)
			.orWhere('email', email)
			.first();
		if (existingUser)
			return res.status(HTTP_FORBIDDEN).json({
				error: `${existingUser.email === email ? 'Email' : 'Username'} is already in use.`
			});

		// Field validation
		let nameRegex = /^[A-Za-z]+$/;
		let usernameRegex = /^[A-Za-z0-9_-]+$/;

		if (!usernameRegex.test(username) ||
			!utils.validateEmail(email) ||
			!nameRegex.test(firstname) ||
			!nameRegex.test(lastname) ||
			password.length < 8 ||
			password.length > 50)
			return res.status(HTTP_BAD_REQUEST).json({
				error: 'Username, first name, last name or password is invalid.'
			});

		// Insert user
		let user = {
			firstname,
			lastname,
			username,
			password: bcrypt.hashSync(password, 10),
			email
		};
		await db('users').insert(user);

		// Send response
		res.json({ msg: 'User has successfully been registered.' });
	} catch (err) {
		sendError(err);
	}
});

router.post('/login', auth, (req, res) => {
	let user = { ...req.user };
	delete user.password;
	res.json(user);
});

router.get('/logout', needAuth, (req, res) => {
	req.logout();
	res.json({ msg: 'User has successfully been logged out.' });
});

router.get('/current', needAuth, (req, res) => {
	let user = { ...req.user };
	delete user.password;
	res.json(user);
});

router.post('/follow', needAuth, async (req, res) => {
	if (utils.fieldsEmptyOrNull(req.body, 'followerid'))
		return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid request body.' });

	try {
		if (req.body.followerid === req.user.id)
			return res.status(HTTP_BAD_REQUEST).json({ error: 'User cannot follow himself.' });

		let following = await db('followers')
			.select()
			.where('userid', req.user.id)
			.andWhere('followerid', req.body.followerid)
			.first();
		if (following)
			return res.status(HTTP_BAD_REQUEST).json({ error: 'Already following this user.' });

		await db('followers').insert({
			userid: req.user.id,
			followerid: req.body.followerid
		});

		res.json({ msg: 'Success' });
	} catch (err) {
		sendError(res, err);
	}
});

router.post('/unfollow', needAuth, async (req, res) => {
	if (utils.fieldsEmptyOrNull(req.body, 'followerid'))
		return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid request body.' });

	try {
		await db('followers')
			.where('userid', req.user.id)
			.andWhere('followerid', req.body.followerid)
			.del();

		res.json({ msg: 'Success' });
	} catch (err) {
		sendError(res, err);
	}
});

router.post('/edit', needAuth, async (req, res) => {
	if (!Object.keys(req.body).find(x => x === 'firstname' || x === 'lastname' || x === 'username'))
		return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid request body.' });

	const keys = ['firstname', 'lastname', 'username'];


	try {
		// Check if username already exists
		if (!utils.isNullOrUndefined(req.body.username) && (await db('users').select().where('username', req.body.username).first()))
			return res.status(HTTP_FORBIDDEN).json({ error: 'Username is already in use.' });

		let updateObj = {};

		// Trim all fields
		keys.forEach(key => {
			if (!utils.isNullOrUndefined(req.body[key])) {
				req.body[key].trim();
				updateObj[key] = req.body[key];
			}
		});

		// Validation
		const nameRegex = /^[A-Za-z]+$/;
		const usernameRegex = /^[A-Za-z0-9_-]+$/;
		if (updateObj.username && !usernameRegex.test(updateObj.username))
			return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid username.' });

		if (updateObj.firstname && !nameRegex.test(updateObj.firstname))
			return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid first name.' });

		if (updateObj.lastname && !nameRegex.test(updateObj.lastname))
			return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid last name.' });

		// Insert
		await db('users')
			.where('id', req.user.id)
			.update(updateObj);

		// Return user
		let user = await db('users').select().where('id', req.user.id).first();
		delete user.password;
		res.json({ user });

	} catch (err) {
		sendError(res, err);
	}
});

router.get('/:id', needAuth, async (req, res) => {
	try {
		let user = await db('users')
			.select('id', 'firstname', 'lastname', 'username')
			.where('id', req.params.id)
			.first();

		if (!user)
			return res.status(HTTP_BAD_REQUEST).json({ error: 'No such user.' });

		let nbPosts = await db('posts')
			.where('userid', user.id)
			.count()
			.first();

		let nbFollowings = await db('followers')
			.where('userid', user.id)
			.count()
			.first();

		let nbFollowers = await db('followers')
			.where('followerid', user.id)
			.count()
			.first();

		let followed = await db('followers')
			.select()
			.where('userid', req.user.id)
			.andWhere('followerid', req.params.id)
			.first();

		res.json({
			...user,
			nbPosts: nbPosts['count(*)'],
			nbFollowings: nbFollowings['count(*)'],
			nbFollowers: nbFollowers['count(*)'],
			followed: !!followed
		});

	} catch (err) {
		sendError(res, err);
	}
});

router.get('/:id/posts', needAuth, async (req, res) => {
	try {
		let postsQuery = db
			.select(
				'p.*',
				'u.firstname',
				'u.lastname',
				'u.username',
				'i.caption',
				'reacted.reactionid AS reacted',
				db.raw(`CONCAT('{', IFNULL(GROUP_CONCAT(counts.reaction), ''), '}') AS reactions`)
			)
			.from('posts AS p')
			.leftJoin('users AS u', 'p.userid', 'u.id')
			.leftJoin('images AS i', 'p.imageid', 'i.id')
			.leftJoin(
				db('posts_reactions')
					.select('postid', db.raw(`CONCAT('"', reactionid, '":', count(reactionid)) AS reaction`))
					.groupBy('postid', 'reactionid')
					.as('counts'),
				function () { this.on('counts.postid', 'p.id'); })
			.leftJoin(
				db('posts_reactions')
					.select('postid', 'reactionid')
					.where('userid', req.user.id)
					.as('reacted'),
				function () { this.on('reacted.postid', 'p.id'); })
			.groupBy('p.id')
			.orderBy('id', 'desc')
			.where('userid', req.params.id);

		let posts = await postsQuery;

		if (posts.length === 1 && posts[0].id === null)
			return res.json({ posts: [] });

		posts.forEach(post => {
			let user = {
				id: post.userid,
				username: post.username,
				firstname: post.firstname,
				lastname: post.lastname
			};
			let image = {
				id: post.imageid,
				caption: post.caption
			};
			post.user = user;
			post.image = image;
			post.reactions = JSON.parse(post.reactions);
			delete post.userid;
			delete post.username;
			delete post.firstname;
			delete post.lastname;
			delete post.imageid;
			delete post.caption;
		});

		res.json({
			posts
		});
	} catch (err) {
		sendError(res, err);
	}
});

module.exports = router;