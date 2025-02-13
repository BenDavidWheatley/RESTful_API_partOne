const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('./db.js');
const bcrypt = require('bcrypt');
const queries = require('./src/app/queries/loginQueries.js');

passport.use(
    new LocalStrategy(
        { usernameField: 'email' }, 
        async (email, password, done) => {
            try {
                // Check if user exists
                const userResult = await pool.query(queries.getUserByEmail, [email]);
                if (userResult.rows.length === 0) {
                    return done(null, false, { message: 'User not found' });
                }

                const user = userResult.rows[0];
                console.log(user);
                // Validate password
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await pool.query(`SELECT id, first_name, last_name, email FROM users WHERE id = $1`, [id]);
        done(null, user.rows[0]);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
