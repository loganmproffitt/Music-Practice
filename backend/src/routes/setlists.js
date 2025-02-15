const express = require('express');
const router = express.Router();
const setlistController = require('../controllers/setlistsController');
const authenticateToken = require('../middleware/authMiddleware');

// Setlist upper level
router.post('/', authenticateToken, setlistController.createSetlist);
router.get('/', authenticateToken, setlistController.retrieveSetlists);
router.delete('/:id', authenticateToken, setlistController.deleteSetlist);
router.get('/search', authenticateToken, setlistController.searchForSetlist);
router.put('/:id', authenticateToken, setlistController.editSetlist);

// Setlist song management
router.post('/:id/songs', authenticateToken, setlistController.addSong);
router.get('/:id/', authenticateToken, setlistController.retrieveSetlistSongs);

module.exports = router;