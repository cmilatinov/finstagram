const axios = require('axios').create({baseURL: 'http://184.160.100.238:3000', withCredentials: true});

async function test(){
    let res = await axios.get('/');
    console.log(`Index route API \n${JSON.stringify(res.data)}`);

    
    res = await axios.post('/users/login', {username: 'Gahyki',password: 'asdf1234'}, {withCredentials: true});
    console.log(`\nLogin Test \n${JSON.stringify(res.data)}`);


    res = await axios.get('/users/2/posts', {withCredentials: true});
    console.log(`\nUser Posts \n${JSON.stringify(res.data)}`);
}

test();