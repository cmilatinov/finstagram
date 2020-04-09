const express = require('express');
const router = express();
const sharp = require('sharp');
const fs = require('fs');

const utils = require('../helpers/utils');
const db = require('../helpers/db');
const needAuth = require('../helpers/needAuth');
const sendError = require('../helpers/sendError');

router.post('/new', needAuth, async (req, res) => {

    if(utils.fieldsEmptyOrNull(req.body, 'image'))
        return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid request body.' });

    let { caption } = req.body;

    try {
        
        let [imageid] = await db('images').insert({ caption: caption || '' });
        let [postid] = await db('posts').insert({ userid: req.user.id, imageid });

        if(!fs.existsSync(`${IMAGE_DIR}/`))
            fs.mkdirSync(`${IMAGE_DIR}/`);

        await sharp(Buffer.from(req.body.image.split(',').pop(), 'base64'))
        .jpeg({ quality: 100 })
        .toFile(`${IMAGE_DIR}/${imageid}.jpg`);

        res.json({ postid });

    } catch (err) {
        sendError(res, err);
    }

});

router.post("/delete", needAuth, async (req, res) => {

	if(utils.fieldsEmptyOrNull(req.body, 'postid'))
	    return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid request body.' });

	let { postid } = req.body;

	try{
		// Select post by id
		let post = await db('posts')
		.select()
		.where('id', postid)
		.first();

		// Check if post exists
		if (!post)
			return res.status(HTTP_BAD_REQUEST).json({ error: 'Post does not exist.' });
		
		//check if userid of post is same as auth
		if(req.user.id != post.userid)
			return res.status(HTTP_BAD_REQUEST).json({ error: 'User does not have authorization to delete this post.' });

		//remove image
		await db ('images')
			.where('id', post.imageid)
			.del();

		//remove comment
		await db ('comments')
			.where('postid', post.id)
			.del();

		//remove reactions
		await db ('posts_reactions')
			.where('postid', post.id)
			.del();

		//remove postid
		await db ('posts')
			.where('id', post.id)
            .del();
            
        res.json({ msg: 'Success' });

	} catch(err) {
		sendError (res, err);
	}

});

router.get('/newest', needAuth, async (req, res) => {
    try{

        let posts = await db
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
        .innerJoin('users AS u', 'u.id', 'p.userid')
        .innerJoin('images AS i', 'i.id', 'p.imageid')
        .leftJoin(
            db('posts_reactions')
            .select('postid', 'reactionid')
            .where('userid', req.user.id)
            .as('reacted'),
            function(){ this.on('reacted.postid', 'p.id'); })
        .leftJoin(
            db('posts_reactions')
            .select('postid', db.raw(`CONCAT('"', reactionid, '":', count(reactionid)) AS reaction`))
            .groupBy('postid', 'reactionid')
            .as('counts'),
            function(){ this.on('counts.postid', 'p.id'); })
        .groupBy('p.id')
        .orderBy('posted', 'desc')
        .limit(40);

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
            utils.deleteProperties(post, 'userid', 'username', 'firstname', 'lastname', 'imageid', 'caption');
        });

        res.json({
            posts
        });
        
    } catch(err) {
        sendError(res, err);
    }
});

router.get('/:postid', needAuth, async (req, res) => {
    try{

        /*
            SELECT 
            p.id, 
            p.posted, 
            u.id as userid, 
            u.username, 
            u.firstname, 
            u.lastname, 
            i.id as imageid, 
            i.caption, 
            i.tags, 
            CONCAT('{', IFNULL(GROUP_CONCAT(counts.reaction), ''), '}') AS reactions 
            from posts as p 
            left join (
                select postid, 
                CONCAT(
                    '\"', 
                    reactionid, 
                    '\":', 
                    count(reactionid)
                ) AS reaction 
                from posts_reactions 
                group by postid, reactionid
            ) as counts on counts.postid = p.id 
            left join users as u on u.id = p.userid 
            left join images as i on i.id = p.imageid 
            where p.id = '1' 
            group by p.id limit 1
        */
        let result = await db
        .select(
            'p.id',
            'p.posted',
            'u.id AS userid',
            'u.username',
            'u.firstname',
            'u.lastname',
            'i.id AS imageid',
            'i.caption',
            'i.tags',
            'reacted.reactionid AS reacted',
            db.raw(`CONCAT('{', IFNULL(GROUP_CONCAT(counts.reaction), ''), '}') AS reactions`))
        .from('posts AS p')
        .innerJoin('users AS u', 'u.id', 'p.userid')
        .innerJoin('images AS i', 'i.id', 'p.imageid')
        .leftJoin(
            db('posts_reactions')
            .select('postid', 'reactionid')
            .where('userid', req.user.id)
            .as('reacted'),
            function(){ this.on('reacted.postid', 'p.id'); }
        )
        .leftJoin(
            db('posts_reactions')
            .select('postid', db.raw(`CONCAT('"', reactionid, '":', count(reactionid)) AS reaction`))
            .groupBy('postid', 'reactionid')
            .as('counts'),
            function(){ this.on('counts.postid', 'p.id'); })
        .where('p.id', req.params.postid)
        .groupBy('p.id')
        .first();

        if(!result)
            return res.status(HTTP_BAD_REQUEST).json({ error: 'No such post.' });

        let comments = await db('comments')
        .select('comments.id', 'comments.comment', 'comments.commented', 'users.id AS userid', 'users.username')
        .innerJoin('users', 'users.id', 'comments.userid')
        .where('comments.postid', result.id)
        .orderBy('comments.id', 'asc');

        result.user = {
            id: result.userid,
            firstname: result.firstname,
            lastname: result.lastname,
            username: result.username,
        };

        result.image = {
            id: result.imageid,
            caption: result.caption,
            tags: JSON.parse(result.tags)
        };

        utils.deleteProperties(result, 
            'userid', 
            'firstname', 
            'lastname', 
            'username', 
            'imageid', 
            'caption', 
            'tags',
            'width',
            'height'
        );

        result.comments = comments;
        result.reactions = JSON.parse(result.reactions);
            
        res.json(result);

    } catch (err) {
        sendError(res, err);
    }
});

router.post('/react', needAuth, async (req, res) => {

    if(utils.fieldsEmptyOrNull(req.body, 'postid'))
        return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid request body.' });

    let { postid, reactionid } = req.body;

    try{

        // Select post by id
        let post = await db('posts')
            .select()
            .where('id', postid)
            .first();
        
        // Check if post exists
        if (!post)
            return res.status(HTTP_BAD_REQUEST).json({ error: 'Post does not exist.' });
        
        // Insert reaction
        if(reactionid) {
            await db('posts_reactions')
                .where('userid', req.user.id)
                .andWhere('postid', postid)
                .del();
            await db('posts_reactions')
                .insert({ userid: req.user.id, postid, reactionid });
        } else 
            await db('posts_reactions')
            .where('userid', req.user.id)
            .andWhere('postid', postid)
            .del();
        
        // Return new reaction counts
        let postReactions = await db
        .select(
            'p.id',
            db.raw(`CONCAT('{', IFNULL(GROUP_CONCAT(counts.reaction), ''), '}') AS reactions`))
        .from('posts AS p')
        .leftJoin(
            db('posts_reactions')
            .select('postid', db.raw(`CONCAT('"', reactionid, '":', count(reactionid)) AS reaction`))
            .groupBy('postid', 'reactionid')
            .as('counts'),
            function(){ this.on('counts.postid', 'p.id'); })
        .where('p.id', postid)
        .groupBy('p.id')
        .first();

        res.json({ reactions: JSON.parse(postReactions.reactions) });

    } catch (err) {
        sendError(res, err);
    }
});

module.exports = router;