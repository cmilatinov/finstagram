const express = require('express');
const router = express();
const sharp = require('sharp');
const fs = require('fs');
const utils = require('../helpers/utils');
const db = require('../helpers/db');
const needAuth = require('../helpers/needAuth');
const sendError = require('../helpers/sendError');

router.post('/new', needAuth, async (req, res) => {

    if(utils.fieldsEmptyOrNull(req.body, 'image', 'caption'))
        return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid request body.' });

    let { caption } = req.body;

    try {
        let [imageid] = await db('images').insert({ caption });
        let [postid] = await db('posts').insert({ userid: req.user.id, imageid});

        if(!fs.existsSync(`${IMAGE_DIR}/`))
            fs.mkdirSync(`${IMAGE_DIR}/`);

        sharp(Buffer.from(req.body.image.split(',').pop(), 'base64'))
        .jpeg()
        .toFile(`${IMAGE_DIR}/${imageid}.jpg`, (err, _) => {
            if(err)
                return sendError(res, err);
            res.json({ postid });
        });

    } catch (err) {
        sendError(res, err);
    }

});

router.get('/newest', async (_, res) => {
    try{

        let posts = await db('posts')
        .innerJoin('users', 'posts.userid', 'users.id')
        .innerJoin('images', 'posts.imageid', 'images.id')
        .select('posts.*', 'users.firstname', 'users.lastname', 'users.username', 'images.caption')
        .orderBy('id', 'desc')
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
    } catch(err) {
        sendError(res, err);
    }
});


router.get('/:postid', async (req, res) => {
    try{
        let post = await db('posts')
        .select()
        .where('id', req.params.postid)
        .first();

        let user = await db('users').select().where('id', post.userid).first();
        let reactions = await db('reactions').select();
        let comments = await db('comments').select().where('postid', post.id);
        let image = await db('images').select().where('id', post.imageid).first();

        delete user.password;
        delete user.email;
        delete post.userid;
        delete post.imageid;
        
        let countObj = {};
        await Promise.all(reactions.map(async reaction => {
            countObj[reaction.id] = await db('post_reactions')
            .where('reactionid', reaction.id)
            .count();
        }));
            
        res.json({
            ...post,
            image,
            comments,
            user,
            reactionCount: countObj
        });

    } catch (err) {
        sendError(res, err);
    }
})

router.post('/react', needAuth, async (req, res) => {

    if(utils.fieldsEmptyOrNull(req.body, 'postid'))
        return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid request body.' });

    let { postid, reactionid } = req.body;

    try{
        let post = await db('posts_reactions')
            .select()
            .where('postid', postid)
            .andWhere('id', id).first();
        
        //check if user already liked
        if (post)
            return res.status(HTTP_BAD_REQUEST).json({ error: 'User already reacted to the post' });

        await db('posts_reactions').insert({ userid: req.user.id, postid, reactionid });

    } catch (err) {
        sendError(res, err);
    }
});


module.exports = router;