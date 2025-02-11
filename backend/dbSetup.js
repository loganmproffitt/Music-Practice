const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function executeSQLFile(filePath) {
    const sql = fs.readFileSync(filePath, { encoding: 'utf-8' });
    try {
        await pool.query(sql);
        console.log(`Executed ${filePath} successfully.`);
    } catch (err) {
        console.error(`Error executing ${filePath}:`, err);
    }
}

async function setupDatabase() {
    await executeSQLFile(path.join(__dirname, './sql/schema.sql'));
    console.log('Database setup complete.');
    pool.end();
}

setupDatabase();