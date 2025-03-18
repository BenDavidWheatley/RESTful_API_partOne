// Import required modules
const passport = require('passport');  // Passport.js for authentication
const LocalStrategy = require('passport-local').Strategy;  // Local strategy for username/password authentication
const pool = require('./db.js');  // Database connection pool for querying the database
const bcrypt = require('bcrypt');  // Library for hashing and comparing passwords
const queries = require('./src/app/login/loginQueries.js');  // SQL queries related to login

// Define the Passport Local Strategy for handling user authentication
passport.use(
    new LocalStrategy(
        { usernameField: 'email' },  // Tells Passport to use 'email' instead of the default 'username'
        async (email, password, done) => {
            try {
                // Check if user exists in the database
                const userResult = await pool.query(queries.getUserByEmail, [email]);
                if (userResult.rows.length === 0) {
                    return done(null, false, { message: 'User not found' });  // No user found
                }

                const user = userResult.rows[0];
                console.log(user);  // Log user details for debugging purposes

                // Validate the provided password against the hashed password in the database
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password' });  // Password mismatch
                }

                return done(null, user);  // Successful authentication
            } catch (error) {
                return done(error);  // Handle errors gracefully
            }
        }
    )
);

// Serialize user ID into the session (only the ID is stored for efficiency)
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize user from the session by looking up the user's details in the database
passport.deserializeUser(async (id, done) => {
    try {
        const user = await pool.query(`SELECT id, first_name, last_name, email FROM users WHERE id = $1`, [id]);
        done(null, user.rows[0]);  // Attach user data to the request object
    } catch (error) {
        done(error);  // Handle errors gracefully
    }
});

// Export Passport configuration for use in other parts of the app
module.exports = passport;
