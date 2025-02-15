const pool = require('../db.js');

async function createSong(req, res) {
    try {
        // Get song info
        const { name, bpm, numerator, denominator, beat_mask, skipping_enabled, measures_on = 1, measures_off = 1 } = req.body;
        // Get user id
        const user_id = req.userId;

        // Insert song
        const songResult = await pool.query(
            `INSERT INTO songs (user_id, name, bpm, numerator, denominator, beat_mask, skipping_enabled, measures_on, measures_off)
             VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 1), COALESCE($9, 1)) RETURNING id`,
            [user_id, name, bpm, numerator, denominator, beat_mask, skipping_enabled, measures_on, measures_off ]
        );
        let songId = songResult.rows[0].id;

        console.log(`Song with id ${songId} successfully created.`);
        return res.status(201).json({ message: "Song created successfully." });

    } catch (error) {
        console.error("Error creating song:", error);
        return res.status(500).json({ error: 'Server error' });
    }
}

async function getAllSongs(req, res) {
    try {
        // Get userId
        const userId = req.userId;

        // Get songs
        const result = await pool.query(
            `SELECT * FROM songs WHERE user_id = $1`,
            [userId]
        );
        
        return res.status(200).json(result.rows);

    } catch (error) {
        console.error("Error getting songs:", error);
        return res.status(500).json({ error: 'Server error' });
    }
}

async function deleteSong(req, res) {
    try {
        const userId = req.userId;
        const songId = req.params.id;

        // Delete song
        const result = await pool.query(
            `DELETE FROM songs WHERE id = $1 AND user_id = $2 RETURNING *`,
            [songId, userId]
        );

        // Check whether the song was found
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Song not found." });
        }

        console.log(`Song with id ${songId} successfully deleted.`);
        return res.status(204).send();
    } catch (error) {
        console.error("Error deleting song:", error);
        return res.status(500).json({ error: 'Server error' });
    }
}

async function searchForSong(req, res) {
    try {
        const userId = req.userId;
        const songName = req.body.songName;

        // Search for song
        const result = await pool.query(
            `SELECT * FROM songs WHERE user_id = $1 AND name ILIKE '%' || $2 || '%'`, 
            [userId, songName]
        );

        // Check whether song was found
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Song not found." });
        }

        return res.status(200).json(result.rows);

    } catch (error) {
        console.error("Error searching for song:", error);
        return res.status(500).json({ error: 'Server error' });
    }
}

async function editSong(req, res) {
    try {
        const userId = req.userId;
        const songId = req.params.id;
        const { name, bpm, numerator, denominator, beat_mask, skipping_enabled, measures_on = 1, measures_off = 2 } = req.body;

        // Update song
        const result = await pool.query(
            `UPDATE songs 
             SET name = $1, bpm = $2, numerator = $3, denominator = $4, beat_mask = $5, 
                 skipping_enabled = $6, measures_on = $7, measures_off = $8
             WHERE id = $9 AND user_id = $10
             RETURNING *`, 
            [name, bpm, numerator, denominator, beat_mask, skipping_enabled, measures_on, measures_off, songId, userId]
        );

        // Check whether song was found
        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Song not found." });
        };

        console.log(`Song with id ${userId} edited.`);
        return res.status(201).json({ message: "Song successfully edited." });
    } catch(error) {
        console.error("Error editing song:", error);
        return res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    createSong,
    getAllSongs,
    deleteSong,
    searchForSong,
    editSong
  };