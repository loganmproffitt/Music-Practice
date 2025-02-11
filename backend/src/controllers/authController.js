const pool = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function signup(req, res) {
    try {
        const { username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        /*
            Insert into db
            await pool.query( 'query, (user, pass) VALUES ($1, $2)', [username, hashedPassword])
        */

        console.log(`Username: ${username}\nPassword: ${password}`);
        
        return res.status(201).json({ message: 'Username and password received.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body;

        /*
            Query database for username, compare password with await bcrypt.compare
            Return 401 invalid match if not match, otherwise create jwt then return 200 and token in json
        */

        return res.status(201).json({ password });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    signup,
    login
  };