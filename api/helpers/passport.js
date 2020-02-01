const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const db = require('./db');

// Custom local authentication strategy, authenticate against database
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, pass, done) => {
    try {
        
        // Find user
        let user = await db('users').select().where('email', email).first();

        // No such user, send error
        if(!user)
            return done(new Error('No such user.'));
        
        // Passwords match, authenticate
        if(bcrypt.compareSync(pass, user.password))
            return done(null, user);
        
        // Passwords did not match, send error
        return done(new Error('Invalid credentials.'));

    } catch (err) {

        // Error fetching user, send error
        done(err);
    }
}));

// Serializing a user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserializing a user
passport.deserializeUser(async (id, done) => {
    try {
        
        // Find user through ID
        let user = await db('users').select().where('id', id).first();

        // Send user
        done(null, user);

    } catch (err) {

        // Error fetching user, send error
        done(err);
    }
});

// Middleware to return 401 in json format if authentication fails
module.export = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err || !user)
            return res.status(HTTP_UNAUTHORIZED).json({ error: err.message || 'Please login to use this feature.' });
        
        next();
    })(req, res, next);
}