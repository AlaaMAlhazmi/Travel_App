import "regenerator-runtime/runtime";
import {getDestinationInfo, getWeather, getDestinationImg} from './api.js';
import {addTripCard, deleteTripCard} from './updateUI';
import {date_diff_indays, smoothScrollTo} from './helperFunctions.js';
import {validateForm, setDateConstraints, setReturnDateConstraints} from './formValidation.js';
import $ from 'jquery';
import 'bootstrap/js/dist/modal.js';

//Array that holds all the rtips
let trips;
let d = new Date();
let todaysDate =  d.getFullYear()+'-'+ (d.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})+'-'+ d.getDate();

const departDateInput = document.getElementById('departDate');
const returnDateInput = document.getElementById('returnDate');

//Set an object with complete info about the trip (form data + API calls results)  
const getTripInfo = async (url='', formData={})=>{

	let d = new Date();
	let todaysDate =  d.getFullYear()+'-'+ (d.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})+'-'+ d.getDate();
	if(date_diff_indays(todaysDate, formData.departDate) <= 16 ){
		formData.within16Days = true;
	} else {
		formData.within16Days = false;
	}

	//post entry to server
	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify(formData),
		headers:{
			"Content-type": "application/json; charset=UTF-8"
		}
	});
	

	let data = await response.json();
	//handle 404 & 500 response
	if(!response.ok){
		throw new Error(data.error);
	}

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
	trip = data;
	//Create ID by Date/Time when adding the trip
	trip.id = (Date.now()).toString();
	//Departure Date
	trip.departDate = formData.departDate;
	//Return Date
	trip.returnDate = formData.returnDate;
	//Duration
	trip.duration = date_diff_indays(trip.departDate, trip.returnDate);

	//Return Trip Info
	return trip;
}

//Get User Data 
const getFormData = (event)=> {
	let formData = {};

	//Departure Date
	formData.departDate = document.getElementById('departDate').value;
	//Return Date
	formData.returnDate = document.getElementById('returnDate').value;
	//Destination City, Destenation Country
	formData.destCity = document.getElementById('destLocation').value

	return formData
}

//Handle Submit Button click
const saveTrip = (tripCompleteInfo)=>{

	//object to hold trip info
	if(tripCompleteInfo){
		//add the trip to the arry that holds all the trips
		trips.push(tripCompleteInfo);
		
		//add All trips to localStorage
		localStorage.setItem('allTrips', JSON.stringify(trips));
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
document.addEventListener('DOMContentLoaded', async ()=>{

	//Set Date Validation Rules
	setDateConstraints();

	//Set Return Date Validation Rule when Depart Date is added
	document.getElementById('departDate').addEventListener('input', setReturnDateConstraints);

	//Set trips array from localStorage
	trips = localStorage.getItem('allTrips');
	trips = trips ? JSON.parse(trips) : [];

	//Build UI for previously added trips from localStorage
	trips.forEach((trip)=>{
		addTripCard(trip);
	});

	//Handle form submit
	const form = document.querySelector('.needs-validation');
	form.addEventListener('submit', async (event) =>{

		try{

			//If Form inputs are valid do the following:
			if(validateForm(event)){
				//prevent submitting the form
				event.preventDefault();
				// get trip data user entered in the form
				const formData = getFormData(event);
				//get other trip data from APIs
				const tripCompleteInfo = await getTripInfo('/tripApiInfo', formData);
				//save trip to local storage
				saveTrip(tripCompleteInfo);
				// Add trip card to the UI
				addTripCard(tripCompleteInfo);
				//scroll to the newly added card
				smoothScrollTo(tripCompleteInfo.id);
				//Empty form inputs
				document.querySelector('form').reset();
			}	
		} catch (err) {
			document.querySelector('.modal-text').innerHTML = err.message;
			$('#myModal').modal('show');
		}
		
	})
		
	//handle delete button click
	document.querySelector('.output-section').addEventListener('click', removeTrip);
});