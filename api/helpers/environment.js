const fs = require('fs');
const dotenv = require('dotenv');

module.exports = {

    init() {    
        if(process.env.SERVER_ENV)
            dotenv.config();
        else if(process.env.DEV_ENV) {
            let env = dotenv.parse(fs.readFileSync('./.env.dev'));
            Object.keys(env).forEach(key => process.env[key] = env[key]);
        } else {
            let env = dotenv.parse(fs.readFileSync('./.env.local'));
            Object.keys(env).forEach(key => process.env[key] = env[key]);
        }
    }
    
};