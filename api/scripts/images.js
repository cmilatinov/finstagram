const axios = require('axios');
const fs = require('fs');
const path = require('path');

const env = require('../helpers/environment');

env.init();

const db = require('../helpers/db');

const IMAGE_DIR = './images';

db('images').select().then(images => {

    images.forEach(image => {

        let imgPath = path.join(__dirname, `../${IMAGE_DIR}/${image.id}.jpg`);
        let url = `https://picsum.photos/${Math.floor(Math.random() * 1500 + 800)}/${Math.floor(Math.random() * 1500 + 800)}`;
        
        if(!fs.existsSync(imgPath))
            axios.get(url, { responseType: 'stream' })
                .then(res => { 
                    console.log(url);
                    const writer = fs.createWriteStream(imgPath);
                    res.data.pipe(writer);
                    writer.on('finish', _ => console.log(image.id));
                    writer.on('error', _ => console.log(image.id, err));
                });
        else
            console.log(image.id);

    });

}).catch(err => console.log(err));