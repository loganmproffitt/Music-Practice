const pool = require('../db.js');

async function createSong(req, res) {
    try {
        // Get song info
        const { name, bpm, numerator, denominator, beat_mask, skipping_enabled, measure_skipping } = req.body;
        // Get user id
        const user_id = req.userId;

        // Check for measure skipping
        let measureSettingsId = null;
        if (skipping_enabled === true && measure_skipping) {
            const { measures_on, measures_off } = measure_skipping;

            // Insert measure skipping settings
            const measureResult = await pool.query(
                `INSERT INTO measure_settings (measures_on, measures_off) 
                 VALUES ($1, $2) RETURNING id`, 
                [measures_on, measures_off]
            );
            measureSettingsId = measureResult.rows[0].id;
        }

        // Insert song
        const songResult = await pool.query(
            `INSERT INTO songs (user_id, name, bpm, numerator, denominator, beat_mask, skipping_enabled)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [user_id, name, bpm, numerator, denominator, beat_mask, skipping_enabled]
        );
        let songId = songResult.rows[0].id;

        // Link song and measure skipping settings
        if (measureSettingsId) {
            await pool.query(
                `INSERT INTO song_measure_settings (song_id, measure_settings_id) 
                 VALUES ($1, $2)`, 
                [songId, measureSettingsId]
            );
        }

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
            `SELECT s.*, 
                    COALESCE(ms.measures_on, 1) AS measures_on, 
                    COALESCE(ms.measures_off, 1) AS measures_off
             FROM songs s
             LEFT JOIN song_measure_settings sms ON s.id = sms.song_id
             LEFT JOIN measure_settings ms ON sms.measure_settings_id = ms.id
             WHERE s.user_id = $1`,
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
        const songId = req.params.songId;

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
            `SELECT * FROM songs WHERE user_id = $1 AND name = $2`, 
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

module.exports = {
    createSong,
    getAllSongs,
    deleteSong,
    searchForSong
  };