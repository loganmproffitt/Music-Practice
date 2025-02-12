const express = require('express');
const router = express.Router();
const songsController = require('../controllers/songsController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, songsController.createSong);
router.get('/', authenticateToken, songsController.getAllSongs);

module.exports = router;