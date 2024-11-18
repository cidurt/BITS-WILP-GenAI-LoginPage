const express = require('express');
const { checkFraud } = require('../controllers/mlController');
const router = express.Router();

// ML fraud detection route
router.post('/fraud-check', checkFraud);

module.exports = router;
