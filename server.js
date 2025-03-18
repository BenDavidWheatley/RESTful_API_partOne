// Import required modules
const express = require('express');  // Express framework for building the app
const session = require('express-session');  // Session middleware for managing user sessions
const passport = require('./passportConfig.js');  // Passport.js for authentication

// Create an instance of an Express app
const app = express();

// Import route handlers for different parts of the app
const userRoutes = require('./src/app/user/userRoutes.js');
const productRoutes = require('./src/app/products/productRoutes.js');
const cartRoutes = require('./src/app/cart/cartRoutes.js');
const orderRoutes = require('./src/app/orders/orderRoutes.js');
const loginRoutes = require('./src/app/login/loginRoutes.js');
const registerRoutes = require('./src/app/register/registerRoutes.js');

// Define the port for the server to listen on
const port = 3000;

// Test endpoint to ensure the server is running properly
app.get('/', (req, res) => {
    res.send('This is a test for the RESTful API');
});

// Middleware setup
app.use(express.json());  // Parses incoming JSON requests to `req.body`
app.use(session({
    secret: 'your_session_secret',  // Secret key for session encryption (change in production)
    resave: false,  // Prevents resaving unchanged sessions
    saveUninitialized: false  // Avoids saving empty sessions
}));
app.use(passport.initialize());  // Initialize Passport for authentication
app.use(passport.session());  // Enables session-based authentication with Passport

// Route definitions - each module handles specific endpoints
app.use('/api/v1/restfulapi/user/login', loginRoutes);  // Login functionality
app.use('/api/v1/restfulapi/register', registerRoutes);  // User registration
app.use('/api/v1/restfulapi/products', productRoutes);  // Product management
app.use('/api/v1/restfulapi/cart', cartRoutes);  // Shopping cart functionality
app.use('/api/v1/restfulapi/order', orderRoutes);  // Order management
app.use('/api/v1/restfulapi/user', userRoutes);  // User profile and data

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`App is listening to port ${port}, for the RESTful API app part one.`);
});
