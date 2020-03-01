const bcrypt = require('bcryptjs');
const csv = require('csv-parser');
const fs = require('fs');


const env = require('../helpers/environment');

env.init();

const db = require('../helpers/db');

let results = [];

fs.createReadStream('./scripts/quotes.csv')
    .pipe(csv(['quote', 'name']))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        results.forEach(async r => {
            r.name = r.name.substring(2);
            r.firstname = r.name.split(/\s+/)[0];
            r.lastname = r.name.substring(r.firstname.length).trim() || 'A';
            r.username = 
                (`${r.firstname.toLowerCase().replace(/[^a-z ]/g, '')}_`+ 
                r.lastname.toLowerCase().replace(/[^a-z ]/g, '')).replace(/ /g, '_');
            r.email = `${r.username}@gmail.com`;
            r.password = bcrypt.hashSync(r.username, 10);

            let caption = r.quote;
            delete r.quote;
            delete r.name;

            try {
                
                let user = await db('users').select().where('username', r.username).first();
                
                let [imageid] = await db('images').insert({ caption });
                let [postid] = await db('posts').insert({ userid: user.id, imageid, posted: new Date(new Date().getTime() - Math.floor(Math.random() * 4.234e+9)) });

                console.log(user.id, postid, user.username);
            } catch(err) {
                console.log(r.username, err);
            }
        });
    });