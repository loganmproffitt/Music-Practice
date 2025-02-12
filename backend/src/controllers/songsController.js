const pool = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

module.exports = {
    createSong,
  };