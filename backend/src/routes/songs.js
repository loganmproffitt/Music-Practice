const express = require('express');
const router = express.Router();
const songsController = require('../controllers/songsController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, songsController.createSong);

module.exports = router;