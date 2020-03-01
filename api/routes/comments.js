const express = require('express');
const router = express();

const db = require('../helpers/db');
const utils = require('../helpers/utils');
const needauth = require('../helpers/needAuth');
const sendError = require('../helpers/sendError');

router.post('/new', needauth, async (req, res) => {

    if(utils.fieldsEmptyOrNull(req.body, 'postid', 'comment'))
        return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid request body.' });
    
    let { postid, comment } = req.body;

    if(String(comment).length > 255)
        return res.status(HTTP_BAD_REQUEST).json({ error: 'Comment message is too long.' });

    try {
        // Get post info
        let existingPost = await db('posts')
        .select()
        .where('id', postid);
            
        // Post does not exist
        if (!existingPost) 
            return res.status(HTTP_BAD_REQUEST).json({ error: 'Post does not exist.' });
        
        // Insert comment
        await db('comments').insert({
            userid: req.user.id,
            postid,
            comment
        });

        // Return new comment list
        let comments = await db('comments')
        .select('comments.id', 'comments.comment', 'comments.commented', 'users.id AS userid', 'users.username')
        .innerJoin('users', 'users.id', 'comments.userid')
        .where('comments.postid', postid)
        .orderBy('comments.id', 'asc');

        res.json({
            comments
        });

    } catch (err) {
        sendError(res, err);
    }

});

module.exports = router;