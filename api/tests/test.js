const axios = require('axios');
axios.get('http://184.160.100.238:3000/').then( res => {
    console.log(res.data);
});