import {getDestinationInfo, getWeather, getDestinationImg} from './api.js';
import {addTripCard, deleteTripCard} from './updateUI';
import {date_diff_indays, smoothScrollTo} from './helperFunctions.js';
import {validateForm, setConstraints} from './formValidation.js';
import $ from 'jquery';
import 'bootstrap/js/dist/modal.js';

//Array that holds all the rtips
let trips;
let d = new Date();
let todaysDate =  d.getFullYear()+'-'+ (d.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})+'-'+ d.getDate();

const departDateInput = document.getElementById('departDate');
const returnDateInput = document.getElementById('returnDate');

//Set an object with user data for the trip  
const getTripInfo = async ()=>{

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

	//Create ID by Date/Time when adding the trip
	trip.id = (Date.now()).toString();
	//Departure Date
	trip.departDate = document.getElementById('departDate').value;
	//Return Date
	trip.returnDate = document.getElementById('returnDate').value;
	
	//Destination City, Destenation Country
	apiCallResultHolder = await getDestinationInfo(document.getElementById('destLocation').value);
	if(apiCallResultHolder.error){
		document.querySelector('.modal-text').innerHTML = apiCallResultHolder.error;
		$('#myModal').modal('show');
		return null;
	}else{
		[lat, lng, trip.destCity, trip.destCountry] = apiCallResultHolder
	}


	//Destination Maximum temperature, Destination Minimum temperature
	apiCallResultHolder = await getWeather(lat, lng, new Date(trip.departDate).getMonth());
	if(apiCallResultHolder.error){
		document.querySelector('.modal-text').innerHTML = apiCallResultHolder.error;
		$('#myModal').modal('show');
		console.log(apiCallResultHolder.error);
		return null;
	}else{
		[trip.destMaxTemp, trip.destMinTemp] = apiCallResultHolder;
	}
	
	//Destination Image URL, Destination Image Description
	[totalImageHits, trip.destImgUrl, trip.destImgDesc] = await getDestinationImg(trip.destCity);
	//Handle no image for city name
	if(!totalImageHits){
		[totalImageHits, trip.destImgUrl, trip.destImgDesc] = await getDestinationImg(trip.destCountry);
	}


	//Duration
	trip.duration = date_diff_indays(trip.departDate, trip.returnDate);

	//Return Trip Info
	return trip;
}

//Handle Submit Button click
const saveTrip = async (event)=>{

	if(validateForm(event)){

		//prevent submitting the form
		event.preventDefault();
		//object to hold trip info
		const newTrip = await getTripInfo();
		if(newTrip){
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

		(document.querySelector('.needs-validation')).classList.remove('was-validated');
		}
	}
};

//Handle Delete Button click
const removeTrip = (event)=>{
	if(event.target.classList.contains('delete-btn')){
		//Delete trip card from the UI
		deleteTripCard(event.target.id);
		//remove trip from the arry that holds all the trips
		trips = trips.filter(trip => trip.id !== event.target.id);
		//Update trips in localStorage
		localStorage.setItem('allTrips', JSON.stringify(trips));
	}
};


////////////////////// Execution Starts Here /////////////////////////
document.addEventListener('DOMContentLoaded', ()=>{

	//Set Validation Rules
	setConstraints();

	//Set trips array from localStorage
	trips = localStorage.getItem('allTrips');
	trips = trips ? JSON.parse(trips) : [];

	//Build UI for previously added trips from localStorage
	trips.forEach((trip)=>{
		addTripCard(trip);
	});

	//handle form submit
	const form = document.querySelector('.needs-validation');
	form.addEventListener('submit', saveTrip)
		

	//handle submit button click
	//document.getElementById('form-btn').addEventListener('click', saveTrip);

	//handle delete button click
	document.querySelector('.output-section').addEventListener('click', removeTrip);
});

