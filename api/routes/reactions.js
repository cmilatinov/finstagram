const express = require('express');
const router = express();

const db = require('../helpers/db');
const sendError = require('../helpers/sendError');

router.get('/all', async (_, res) => {
    try {

        let reactions = await db('reactions').select().orderBy('order');
        
        res.json({
            reactions
        });

    }catch(err) {
        sendError(res, err);
    }
});

module.exports = router;