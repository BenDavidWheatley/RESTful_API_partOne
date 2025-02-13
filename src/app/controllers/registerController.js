const pool = require('../../../db.js');
const bcrypt = require('bcrypt');
const queries = require('../queries/registerQueries.js');
const userQueries = require("../queries/userQueries.js");

const registerUser = (req, res) => {
    const { first_name, last_name, email, password, delivery_address } = req.body;

    console.log(req.body);

    if (!first_name || !last_name || !email || !password || !delivery_address) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the email already exists
    pool.query(userQueries.checkEmailExists, [email], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: 'Internal server error checking if email exists' });
        }

        if (results.rows.length) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        // Hash the password before storing
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                console.error('Hashing error:', err);
                return res.status(500).json({ error: 'Error hashing password' });
            }

            // Insert new user into the database
            pool.query(queries.registerUser, [
                first_name,
                last_name,
                email,
                hashedPassword,
                delivery_address
            ], (error, results) => {
                if (error) {
                    console.error('Database error:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                res.status(201).json({ message: 'User created successfully', user: results.rows[0] });
            });
        });
    });
};

module.exports = {
    registerUser,
};
