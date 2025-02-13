const express = require('express');
const router = express.Router();
const songsController = require('../controllers/songsController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, songsController.createSong);
router.get('/', authenticateToken, songsController.getAllSongs);
router.delete('/:songId', authenticateToken, songsController.deleteSong);
router.get('/search', authenticateToken, songsController.searchForSong);

module.exports = router;