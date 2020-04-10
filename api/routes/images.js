const express = require('express');
const router = express();
const fs = require('fs');
const path = require('path');

const sendError = require('../helpers/sendError');

router.get('/:id', (req, res) => {

    try {

        let imgPath = path.join(__dirname, `../${IMAGE_DIR}/${req.params.id}.jpg`);
        if (fs.existsSync(imgPath))
            return res.sendFile(imgPath);

        res.status(HTTP_NOT_FOUND).json({ error: 'No such image.' });

    } catch (err) {
        sendError(res, err);
    }

});

module.exports = router;