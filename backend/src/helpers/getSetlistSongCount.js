const pool = require('../db');

async function getSetlistSongCount(setlistId) {
    try {
        const result = await pool.query(
            `SELECT COUNT(*) AS song_count
             FROM setlist_song 
             WHERE setlist_id = $1`,
            [setlistId]
        );
        return result.rows[0].song_count;
    } catch (error) {
        console.error("Error fetching max position:", error);
        throw error;
    }
}

module.exports = getSetlistSongCount;