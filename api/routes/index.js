const express = require('express');
const router = express();

const now = new Date();

router.get('/', (_, res) => {
    res.json({
        name: 'finstagram-api',
        version: '1.0',
        date: now.toLocaleString()
    })
});

module.exports = router;