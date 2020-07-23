import {getDestinationInfo, getWeather, getDestinationImg} from './api.js';
import {addTripCard, deleteTripCard} from './updateUI';
import {date_diff_indays, smoothScrollTo} from './helperFunctions.js';

//Array that holds all the rtips
let trips;

//Set an object with user data for the trip  
const getTripInfo = async ()=>{

	let lat, lng;
	let trip = {};

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

	//Id
	trip.id = (Date.now()).toString();
	//Departure Date
	trip.departDate = document.getElementById('departDate').value;
	//Return Date
	trip.returnDate = document.getElementById('returnDate').value;
	//Destination City, Destenation Country
	[lat, lng, trip.destCity, trip.destCountry] = await getDestinationInfo(document.getElementById('destLocation').value);
	//Destination Maximum temperature, Destination Minimum temperature
	[trip.destMaxTemp, trip.destMinTemp] = await getWeather(lat, lng, new Date(trip.departDate).getMonth());
	//Destination Image URL, Destination Image Description
	[trip.destImgUrl, trip.destImgDesc] = await getDestinationImg(trip.destCity);
	//Duration
	trip.duration = date_diff_indays(trip.departDate, trip.returnDate);

	return trip;
}

//Handle Submit Button click
const saveTrip = async ()=>{

	const newTrip = await getTripInfo();
	// Add trip card to the UI
	addTripCard(newTrip);
	//Empty form inputs
	document.querySelector('form').reset();
	//scroll to the newly added card
	smoothScrollTo(newTrip.id);
	//add the trip to the arry that holds all the trips
	trips.push(newTrip);
	//add All trips to localStorage
	localStorage.setItem('allTrips', JSON.stringify(trips));
};

//Handle Delete Button click
const removeTrip = (event)=>{
	if(event.target.classList.contains('delete-btn')){
		//Delete trip card from the UI
		deleteTripCard(event.target.id);
		//remove trip from the arry that holds all the trips
		trips = trips.filter(trip => trip.id !== event.target.id);
		console.log(trips);
		//Update trips in localStorage
		localStorage.setItem('allTrips', JSON.stringify(trips));
	}
};


////////////////////// Execution Starts Here /////////////////////////
document.addEventListener('DOMContentLoaded', ()=>{

	//Set trips array from localStorage
	trips = localStorage.getItem('allTrips');
	trips = trips ? JSON.parse(trips) : [];

	//Build UI for previously added trips from localStorage
	trips.forEach((trip)=>{
		addTripCard(trip);
	});

	//handel submit button click
	document.getElementById('form-btn').addEventListener('click', saveTrip);

	//handel delete button click
	document.querySelector('.output-section').addEventListener('click', removeTrip);
});

