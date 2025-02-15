const express = require('express');
const router = express.Router();
const songsController = require('../controllers/songsController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, songsController.createSong);
router.get('/', authenticateToken, songsController.retrieveSongs);
router.delete('/:id', authenticateToken, songsController.deleteSong);
router.get('/search', authenticateToken, songsController.searchForSong);
router.put('/:id', authenticateToken, songsController.editSong);

module.exports = router;