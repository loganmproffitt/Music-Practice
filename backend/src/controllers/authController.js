const pool = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function signup(req, res) {
    try {
        const { username, password } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into users table
        await pool.query(
            `INSERT INTO users (username, password) VALUES ($1, $2)`, 
                [username, hashedPassword]);

        return res.status(201).json({ message: 'User created.' });
    } catch (error) {
        // Handle duplicate username error
        if (error.code === '23505') {  // PostgreSQL unique violation error code
            return res.status(400).json({ message: 'Username is already in use.' });
        }

        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body;

        // Query username to get user
        const result = await pool.query(
            `SELECT * FROM users WHERE username = $1`, [username]
        );

        // Check for existing username
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'User not found.' });
        }
        const user = result.rows[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password.' });
        }

        // Create jwt token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        return res.status(200).json({ token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    signup,
    login
  };