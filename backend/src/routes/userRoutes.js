const express = require('express');
const { getUserProfile } = require('../controllers/userController');
const ensureAuthenticated = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/profile', ensureAuthenticated, getUserProfile);

module.exports = router;
