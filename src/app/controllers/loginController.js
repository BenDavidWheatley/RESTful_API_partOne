const passport = require('passport');
const jwt = require('jsonwebtoken');

const loginUser = (req, res, next) => {
    const { email, password } = req.body;
    
    console.log(`Attempting login for: ${email}`);

    passport.authenticate('local', (error, user, info) => {
        if (error) {
            console.error("Authentication error:", error);
            return res.status(500).json({ error: "Internal server error during authentication" });
        }

        if (!user) {
            console.log("Invalid login attempt");
            return res.status(401).json({ error: info.message });
        }

        console.log(`User authenticated successfully: ${user.email}`);

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            'your_jwt_secret', // Replace with a secure secret key
            { expiresIn: '1h' }
        );

        console.log(`Token generated for user: ${user.email}`);
        res.status(200).json({ message: "Login successful", token, user });
    })(req, res, next); 
};

module.exports = {
    loginUser
};
