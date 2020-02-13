const passport = require('passport');

module.exports = (req, res, next) => {
    passport.authenticate('local', (err, user, _) => {
        if(err || !user)
            return res.status(HTTP_UNAUTHORIZED).json({ error: err.message || 'Please login to use this feature.' });
        
        req.login(user, err => {
            if(err)
                return res.status(HTTP_UNAUTHORIZED).json({ error: 'Unable to establish session.' });
            next();
        });
    })(req, res, next);
}