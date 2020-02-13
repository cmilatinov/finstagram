const express = require('express');
const router = express();
const bcrypt = require('bcryptjs');

const auth = require('../helpers/auth');
const needAuth = require('../helpers/needAuth');
const db = require('../helpers/db');
const utils = require('../helpers/utils');
const sendError = require('../helpers/sendError');


router.post('/register', async (req, res) => {

    if(utils.fieldsEmptyOrNull(req.body, 'firstname', 'lastname', 'username', 'password', 'email'))
        return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid request body.' });

    let { username, firstname, lastname, password, email } = req.body;

    try {

        // Trim all fields
        firstname = firstname.trim();
        lastname = lastname.trim();
        username = username.trim();
        email = email.trim();

        // Check if username or email exists
        let existingUser = await db('users').select().where('username', username).orWhere('email', email).first();
        if (existingUser)
            return res.status(HTTP_FORBIDDEN).json({ error: (existingUser.email === email ? 'Email' : 'Username') + ' is already in use.' });

        // Field validation
        let nameRegex = /^[A-Za-z]+$/;
        let usernameRegex = /^[A-Za-z0-9_-]+$/;
        if (!usernameRegex.test(username) || !utils.validateEmail(email) || !nameRegex.test(firstname) || !nameRegex.test(lastname) || password.length < 8 || password.length > 50)
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

router.post('/login', auth, (req, res) => {
    let user = {...req.user};
    delete user.password;
    res.json(user);
});

router.get('/logout', needAuth, (req, res) => {
    req.logout();
    res.json({ msg: 'User has successfully been logged out.' });
});

router.get('/current', needAuth, (req, res) => {
    let user = {...req.user};
    delete user.password;
    res.json(user);
});

module.exports = router;