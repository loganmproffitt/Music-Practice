const pool = require('../db.js');

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

module.exports = {
    createSetlist,
    retrieveSetlists,
    deleteSetlist,
    searchForSetlist
};