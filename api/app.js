const express = require('express');
const session = require('express-session');
const app = express();
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const preprocess = require('./helpers/preprocess');
const env = require('./helpers/environment');

// Init .env
env.init();

// HTTP codes
global.HTTP_OK = 200;
global.HTTP_BAD_REQUEST = 400;
global.HTTP_UNAUTHORIZED = 401;
global.HTTP_FORBIDDEN = 403;
global.HTTP_NOT_FOUND = 404;
global.HTTP_INTERNAL_ERROR = 500;

// Image directory
global.IMAGE_DIR = './images';

// Init cors, express-sessions, passport, body-parser
app.use(cors({
    credentials: true,
    origin: process.env.APP_URL
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(session({
    key: 'session',
    secret: 'session_secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(preprocess);

// Init passport authentication strategy
require('./helpers/passport');

// Setup routes
const index = require('./routes/index');
app.use('/', index);

const users = require('./routes/users');
app.use('/users', users);

const posts = require('./routes/posts');
app.use('/posts', posts);

const images = require('./routes/images');
app.use('/images', images);

const comments = require('./routes/comments');
app.use('/comments', comments);

const search = require('./routes/search');
app.use('/search', search);

// Listen on port
const port = process.env.PORT || 3000;
app.listen(port, _ => console.log(`Server started on port ${port}`));