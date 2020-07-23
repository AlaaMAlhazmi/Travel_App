// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

// Dependencies
const bodyParser = require('body-parser');


/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
//const cors = require('cors');
//app.use(cors());

// Initialize the main project folder
app.use(express.static('src/client'));

//start server
app.listen(3000, ()=>{
	console.log('server started on port 3000')
})

