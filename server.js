// IMport express and create an express app
const express = require('express');
const app = express();
const  appRoutes = require('./src/app/routes/userRoutes.js')
const productRoutes = require('./src/app/routes/productRoutes.js')
const cartRoutes = require('./src/app/routes/cartRoutes.js'); 
// Define our port that for the server to listen to
const port = 3000;

//Test endpoint to check express is set up.
app.get('/', (req, res) => {
    res.send('This is a test fro the RESTful api')
})

app.use(express.json());

app.use('/api/v1/restfulapi/products', productRoutes); // Register products first
app.use('/api/v1/restfulapi/cart', cartRoutes);
app.use('/api/v1/restfulapi/user', appRoutes);



//Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`App is listening to port ${port}, for the RESTful API app part one.`)
})