// IMport express and create an express app
const express = require('express');
const app = express();

// Define our port that for the server to listen to
const port = 3000;

//Test endpoint to check express is set up.

app.get('/', (req, res) => {
    res.send('This is a test fro the RESTful api')
})
//Start the server and listen on the specified port

app.listen(port, () => {
    console.log(`App is listening to port ${port}, for the RESTful API app part one.`)
})