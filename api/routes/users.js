const express = require('express');
const router = express();
const passport = require('passport');
const bcrypt = require('bcrypt');
const needAuth = require('../helpers/needAuth');
const db = require('../helpers/db');
const utils = require('../helpers/utils');
const sendError = require('../helpers/sendError');

router.post('/register', async (req, res) => {

    if (utils.isEmptyOrNull(req.body, 'firstname', 'lastname', 'username', 'password', 'email'))
        return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid request body.' });

    let { username, firstname, lastname, password , email } = req.body;

    try {

        // Trim all fields
        firstname = firstname.trim();
        lastname = lastname.trim();
        username = username.trim();
        email = email.trim();

        // Check if email exists
        let existingUser = await db('users').select().where('username', username).first();
        if (existingUser)
            return res.status(HTTP_FORBIDDEN).json({ error: 'username is already in use.' });

        // Check if username exists
        let existingUser = await db('users').select().where('email', email).first();
        if (existingUser)
            return res.status(HTTP_FORBIDDEN).json({ error: 'email is already in use.' });

        // Field validation
        let nameRegex = /[a-zA-z]{1,}/;
        if (!utils.test(username) || !utils.validateEmail(email) || !nameRegex.test(firstname) || !nameRegex.test(lastname) || password < 8 || password > 50)
            return res.status(HTTP_BAD_REQUEST).json({ error: 'Username, first name, last name or password is invalid.' });

        // Insert user
        let user = {
            firstname,
            lastname,
            username,
            password: bcrypt.hashSync(password, 10),
            email,
        };
        await db('users').insert(user);

        // Send response
        res.json({ msg: 'User has successfully been registered.' });

    } catch (err) {
        sendError(err);
    }

});

router.post('/login', passport.authenticate('local'), needAuth, (req, res) => {
    res.json(req.user);
});

router.get('/current', needAuth, (req, res) => {
    res.json(req.user);
});

