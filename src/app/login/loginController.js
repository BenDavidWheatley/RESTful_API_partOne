// Import required modules
const passport = require('passport'); // Passport handles authentication strategies
const jwt = require('jsonwebtoken'); // JWT is used for token generation to manage authenticated sessions

/*
  Handles user login by authenticating with Passport's Local Strategy
  and generating a JWT token upon successful login.

  Endpoint Example:
  POST http://localhost:3000/api/v1/restfulapi/user/login
  Body: {
    "email": "user@example.com",
    "password": "password123"
  }
 */
const loginUser = (req, res, next) => {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Log the email for tracking login attempts (useful for debugging)
    console.log(`Attempting login for: ${email}`);

    /**
     * Passport's `.authenticate()` method is used to validate user credentials.
     * The 'local' strategy refers to the LocalStrategy defined in your `passportConfig.js`.
     * 
     * - `error`: Any internal server error during the authentication process.
     * - `user`: The authenticated user object if credentials are correct.
     * - `info`: Information explaining why authentication failed (e.g., "Incorrect password").
     */
    passport.authenticate('local', (error, user, info) => {
        // Handle unexpected server errors
        if (error) {
            console.error("Authentication error:", error);
            return res.status(500).json({ error: "Internal server error during authentication" });
        }

        // If no user is found, authentication failed
        if (!user) {
            console.log("Invalid login attempt - user not found");
            return res.status(401).json({ error: info.message }); // Info might include 'Incorrect password' or 'User not found'
        }

        // Log successful authentication (useful for auditing)
        console.log(`User authenticated successfully: ${user.email}`);

        /**
         * Generate a JWT token for the authenticated user.
         * 
         * - Payload: Contains user data (e.g., `id`, `email`).
         * - Secret key: Use a strong, environment-protected key (avoid hardcoding in production).
         * - `expiresIn`: Sets the token's expiration time (e.g., '1h' = 1 hour).
         */
        const token = jwt.sign(
            { id: user.id, email: user.email }, // Payload
            'your_jwt_secret', // Secret key (replace this with a secure environment variable)
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Log token generation for security and traceability
        console.log(`Token generated for user: ${user.email}`);

        // Respond with success message, token, and user details
        res.status(200).json({ 
            message: "Login successful", 
            token, 
            user 
        });
    })(req, res, next); // Immediately invoke the authenticate function with Express request/response objects
};

// Export the loginUser function for use in routing or middleware
module.exports = {
    loginUser
};
