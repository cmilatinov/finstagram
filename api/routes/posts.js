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
        let [postid] = await db('posts').insert({ userid: req.user.id, imageid });

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

module.exports = router;