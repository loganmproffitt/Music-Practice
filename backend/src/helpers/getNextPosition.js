const pool = require('../db');

async function getNextPosition(setlistId) {
    try {
        const result = await pool.query(
            `SELECT COALESCE(MAX(position), 0) + 1 AS next_position 
             FROM setlist_song 
             WHERE setlist_id = $1`,
            [setlistId]
        );
        return result.rows[0].next_position;
    } catch (error) {
        console.error("Error fetching next position:", error);
        throw error;
    }
}

module.exports = getNextPosition;