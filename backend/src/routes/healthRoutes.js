const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is working' });
});

module.exports = router;
