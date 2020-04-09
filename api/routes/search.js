const express = require('express');
const router = express();

const db = require('../helpers/db');
const utils = require('../helpers/utils');
const needAuth = require('../helpers/needAuth');
const sendError = require('../helpers/sendError');

router.post('/', needAuth, async (req,res) => {

    if(utils.fieldsEmptyOrNull(req.body, 'search'))
        return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid request body.' });

    try {

        let searchWords = req.body.search.split(/\s+/);

        let usersQuery = db('users').select('id', 'firstname', 'lastname', 'username').limit(50);
        for(let searchWord of searchWords){
            usersQuery.orWhere('firstname', 'LIKE', `%${searchWord}%`);
            usersQuery.orWhere('lastname', 'LIKE', `%${searchWord}%`);
            usersQuery.orWhere('username', 'LIKE', `%${searchWord}%`);
        }

        let users = await usersQuery;

        res.json({
            users
        });

    } catch (err){
        sendError(res, err);
    }
});

module.exports = router;