const express = require('express');
const router = express();

const db = require('../helpers/db');
const utils = require('../helpers/utils');
const needauth = require('../helpers/needAuth');
const sendError = require('../helpers/sendError');

router.post('/', needauth, async (req,res) => {

    if(utils.fieldsEmptyOrNull(req.body, 'search'))
        return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid request body.' });

    try {

        let searchWords = req.body.search.split(/\s+/);

        let usersQuery = db('users').select();
        for(let searchWord of searchWords){
            usersQuery.orWhere('firstname', 'LIKE', `%${searchWord}%`);
            usersQuery.orWhere('lastname', 'LIKE', `%${searchWord}%`);
            usersQuery.orWhere('username', 'LIKE', `%${searchWord}%`);
        }

        let users = await usersQuery;
        users.forEach(user => { 
            delete user.password;
            delete user.email;
        });

        res.json({
            users
        });

    } catch (err){
        sendError(res, err);
    }
})

module.exports = router;