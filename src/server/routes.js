require("regenerator-runtime/runtime");
//import API calls functions
var apiMethods = require('./api.js');

// Require Express to run server and routes
const express = require('express');


// Start up an instance of app
const app = express();

// Dependencies
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

// Initialize the main project folder
app.use(express.static('dist'));
app.use(bodyParser.json());


app.get('/', function (req, res){
	res.sendFile('dist/index.html');
})

app.post('/tripApiInfo', async (req, res) =>{

	try {
		let lat, lng;
		let totalImageHits;
		let trip = {};
		let apiCallResultHolder;

		/*{
			id: "",
			departDate: "",
			returnDate: "",
			destCity: "",
			destCountry: "",
			destMaxTemp: "",
			destMinTemp: "",
			destImgUrl: "",
			destImgDesc: "",
			duration: ""
		}*/

		//Destination City, Destenation Country
		apiCallResultHolder = await apiMethods.getDestinationInfo(req.body.destCity);
		[lat, lng, trip.destCity, trip.destCountry] = apiCallResultHolder

		//if trip start date within 16 days, get first day weather
		if (req.body.within16Days){
			apiCallResultHolder = await apiMethods.getFirstDayWeather(lat, lng, req.body.departDate);
			trip.firstDay = apiCallResultHolder;
		}

		//Destination Maximum temperature, Destination Minimum temperature
		apiCallResultHolder = await apiMethods.getWeather(lat, lng, new Date(req.body.departDate).getMonth());
		[trip.destMaxTemp, trip.destMinTemp] = apiCallResultHolder;
		
		//Destination Image URL, Destination Image Description
		apiCallResultHolder = await apiMethods.getDestinationImg(trip.destCity);
		[totalImageHits, trip.destImgUrl, trip.destImgDesc] = apiCallResultHolder;
		//Handle no image for city name
		if(!totalImageHits){
			[totalImageHits, trip.destImgUrl, trip.destImgDesc] = await apiMethods.getDestinationImg(trip.destCountry);
		}

		//Return Trip Info
		res.json(trip)

	} catch (err){

		res.status(500).json({error: err.message});	
	}
})

module.exports = app;