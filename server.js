// IMport express and create an express app
const express = require('express');
const session = require('express-session');
const passport = require('./passportConfig.js');
const app = express();



const userRoutes = require('./src/app/routes/userRoutes.js')
const productRoutes = require('./src/app/routes/productRoutes.js')
const cartRoutes = require('./src/app/routes/cartRoutes.js'); 
const orderRoutes = require('./src/app/routes/orderRoutes.js')
const loginRoutes = require('./src/app/routes/loginRoutes.js')
const registerRoutes = require('./src/app/routes/registerRoutes.js')

// Define our port that for the server to listen to
const port = 3000;

//Test endpoint to check express is set up.
app.get('/', (req, res) => {
    res.send('This is a test fro the RESTful api')
})

// Middleware
app.use(express.json());
app.use(session({ secret: 'your_session_secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/api/v1/restfulapi/user/login', loginRoutes);
app.use('/api/v1/restfulapi/register', registerRoutes);
app.use('/api/v1/restfulapi/products', productRoutes);
app.use('/api/v1/restfulapi/cart', cartRoutes);
app.use('/api/v1/restfulapi/order', orderRoutes)
app.use('/api/v1/restfulapi/user', userRoutes);


//Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`App is listening to port ${port}, for the RESTful API app part one.`)
})


