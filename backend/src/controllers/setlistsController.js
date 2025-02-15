const pool = require('../db.js');
const getNextPosition = require('../helpers/getNextPosition.js');

async function createSetlist(req, res) {
    try {
        const userId = req.userId;
        const { name, description } = req.body;

        const result = await pool.query(
            `INSERT INTO setlists (user_id, name, description) VALUES ($1, $2, $3) RETURNING *`,
            [userId, name, description]
        );
        let setlistId = result.rows[0].id;

        console.log(`Setlist with id ${setlistId} successfully created.`);
        return res.status(201).json({ message: "Setlist created successfully." });

    } catch (error) {
        console.error("Error creating setlist:", error);
        return res.status(500).json({ error: 'Server error' });
    }
}

async function retrieveSetlists(req, res) {
    try {
        const userId = req.userId;

        // Get setlists with userId
        const result = await pool.query(
            `SELECT * FROM setlists WHERE user_id = $1`,
            [userId]
        );

        console.log(`Setlists for user id ${userId} retrieved.`);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error getting setlists:", error);
        return res.status(500).json({ error: 'Server error' });
    }
}

async function deleteSetlist(req, res) {
    try {
        const userId = req.userId;
        const setlistId = req.params.id;

        const result = await pool.query(
            `DELETE FROM setlists WHERE id = $1 AND user_id = $2 RETURNING *`,
            [setlistId, userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Setlist not found." });
        }

        console.log(`Setlist with id ${setlistId} deleted.`);
        return res.status(204).send();

    } catch (error) {
        console.error("Error deleting setlist:", error);
        return res.status(500).json({ error: 'Server error' });
    }
}

async function searchForSetlist(req, res) {
    try {
        const userId = req.userId;
        const searchTerm = req.body.search_term;

        // Search for song
        const result = await pool.query(
            `SELECT * FROM setlists WHERE user_id = $1 AND (name ILIKE '%' || $2 || '%' OR description ILIKE '%' || $2 || '%')`, 
            [userId, searchTerm]
        );

        // Check whether song was found
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Setlist not found." });
        }

        return res.status(200).json(result.rows);

    } catch (error) {
        console.error("Error searching for setlist:", error);
        return res.status(500).json({ error: 'Server error' });
    }
}

async function editSetlist(req, res) {
    try {
        const userId = req.userId;
        const setlistId = req.params.id;
        const { name, description } = req.body;

        // Update setlist
        const result = await pool.query(
            `UPDATE setlists 
             SET name = $1, description = $2
             WHERE id = $3 AND user_id = $4
             RETURNING *`, 
            [name, description, setlistId, userId]
        );

        // Check whether setlist was found
        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Setlist not found." });
        };

        console.log(`Setlist with id ${setlistId} edited.`);
        return res.status(201).json({ message: "Setlist successfully edited." });
    } catch(error) {
        console.error("Error editing song:", error);
        return res.status(500).json({ error: 'Server error' });
    }
}

async function addSong(req, res) {
    try {
        const setlistId = req.params.id;
        const { songId } = req.body;
        const nextPosition = await getNextPosition(setlistId);

        await pool.query(
            `INSERT INTO setlist_song (setlist_id, song_id, position) VALUES ($1, $2, $3)`,
            [setlistId, songId, nextPosition]
        );
        return res.status(201).json({ message: "Song added to setlist.", position: nextPosition });

    } catch (error) {
        console.error("Error adding song:", error);
        return res.status(500).json({ error: 'Server error' });
    }
}

async function retrieveSetlistSongs(req, res) {
    try {
        const setlistId = req.params.id;

        // Check for setlist
        const setlistResult = await pool.query(
            `SELECT * FROM setlists WHERE id = $1`,
            [setlistId]
        );
        if (setlistResult.rows.length === 0) {
            console.log(`Setlist with id ${setlistId} not found, can't retrieve songs.`);
            return res.status(404).json({ message: "Setlist not found." });
        }

        // Get setlist songs
        const result = await pool.query(
            `SELECT * FROM setlist_song ss
            INNER JOIN songs s
            ON ss.song_id = s.id
            WHERE setlist_id = $1
            ORDER BY position ASC`,
            [setlistId]
        );
        return res.status(200).json(result.rows);

    } catch (error) {
        console.error("Error retrieving setlist song:", error);
        return res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    createSetlist,
    retrieveSetlists,
    deleteSetlist,
    searchForSetlist,
    editSetlist,

    addSong,
    retrieveSetlistSongs
};