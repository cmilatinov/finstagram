const express = require('express');
const router = express();

const db = require('../helpers/db');
const utils = require('../helpers/utils');
const needauth = require('../helpers/needAuth');
const sendError = require('../helpers/sendError');

router.post('/new', needauth, async (req, res) => {

    if(utils.fieldsEmptyOrNull(req.body, 'postid', 'comment'))
        return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid request body.' });
    
    try {

        let existingPost = await db('posts').select().where('id', req.body.postid);

        if (!existingPost) return res.status(HTTP_BAD_REQUEST).json({ error: 'Post does not exist.' });

        let [commentid] = await db('comments').insert({
            userid: req.user.id,
            postid: req.body.postid,
            comment: req.body.comment
        });

        res.json({
            commentid
        });

    } catch (err) {
        sendError(res, err);
    }

});

module.exports = router;