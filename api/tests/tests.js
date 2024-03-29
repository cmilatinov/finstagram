const axios = require('axios').create({ baseURL: 'http://localhost:3000', withCredentials: true });
const fs = require('fs');
const logger = require('./logger');
const { SUCCESS, ERROR, WARNING } = logger;

let postid;

async function execTest(testName, test, onSuccess = null) {
    if (!test)
        return logger.log(' Please provide a valid test.', WARNING);

    console.log(` Executing test '${testName.brightYellow.bold}' ...\n`);

    try {

        res = await (test());
        logger.logObject(res.data);
        console.log();
        logger.log('Test Passed!', SUCCESS);
        console.log('\n=================================================\n');

        if (onSuccess)
            onSuccess(res);

        return true;

    } catch (err) {

        logger.log(err.message, ERROR);
        logger.log(err.stack, ERROR);
        console.log();
        logger.log('Test Failed!', ERROR);
        console.log('\n=================================================\n');

        return false;

    }
}

async function execAllTests() {

    const tests = [
        {
            name: 'Index Route  -  /',
            test: _ => axios.get(`/`)
        },
        {
            name: 'Login Route  -  /users/login',
            test: _ => axios.post(`/users/login`, { username: 'rednite', password: 'power336' }),
            onSuccess: res => axios.defaults.headers.common.Cookie = res.headers['set-cookie'][0].split(';')[0]
        },
        {
            name: 'User Posts Route  -  /users/2/posts',
            test: _ => axios.get(`/users/2/posts`)
        },
        {
            name: 'Posts Information  -  /posts/76',
            test: _ => axios.get(`/posts/76`)
        },
        {
            name: 'User Profile  -  /users/2',
            test: _ => axios.get(`/users/2`)
        },
        {
            name: 'User Profile Edit  -  /users/edit',
            test: _ => axios.post(`/users/edit`, { firstname: 'A', lastname: 'Test' })
        },
        {
            name: 'User Profile Edit Revert  -  /users/edit',
            test: _ => axios.post(`/users/edit`, { firstname: 'Cristian', lastname: 'Milatinov' })
        },
        {
            name: 'Search  -  /search',
            test: _ => axios.post(`/search`, { search: 'c' })
        },
        {
            name: 'Create Post  -  /posts/new',
            test: _ => axios.post(`/posts/new`, { image: 'data:image/jpeg;base64,' + fs.readFileSync('./sample.jpg').toString('base64'), caption: 'This is a test' }),
            onSuccess: res => postid = res.data.postid
        },
        {
            name: 'Comment on Post - /comments/new',
            test: _ => axios.post(`/comments/new`, { postid, comment: 'This is a comment.' })
        },
        {
            name: 'React to Post  -  /posts/react',
            test: _ => axios.post(`/posts/react`, { postid, reactionid: 'like' }),
        },
        {
            name: 'Delete Post  -  /posts/delete',
            test: _ => axios.post(`/posts/delete`, { postid }),
        },

    ];

    let testsPassed = 0;

    console.time(' Running time');

    console.log('\n=================================================\n');

    for (let test of tests) {

        let success = await execTest(test.name, test.test, test.onSuccess);
        if (success)
            testsPassed++;

    }

    console.timeEnd(' Running time');
    console.log(`\n Tests passed: ${(testsPassed + '/' + tests.length).brightCyan.bold} (${((testsPassed * 100 / tests.length).toFixed(2) + '%').brightCyan.bold})`);
}

execAllTests();