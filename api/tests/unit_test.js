const axios = require('axios').create({ baseURL: 'http://184.160.100.238:3000', withCredentials: true });

async function test() {
    try {

        let res = await axios.get('/');
        console.log(`Index route API \n${JSON.stringify(res.data)}`);

        res = await axios.post('/users/login', { username: 'rednite', password: 'power336' });
        console.log(`\nLogin Test \n${JSON.stringify(res.data)}`);
        axios.defaults.headers.common['Cookie'] = res.headers['set-cookie'][0].split(';')[0];
    
        res = await axios.get('/users/2');
        console.log(`\nUser Posts \n${JSON.stringify(res.data)}`);

        res = await axios.get('/posts/76');
        console.log(`\nPost Information \n${JSON.stringify(res.data)}`)

    } catch (err) {
        console.log(err);
    }
}

test();