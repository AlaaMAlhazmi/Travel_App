import {date_diff_indays, tempIconColor} from './helperFunctions.js';

//Delete trip card from UI
export const deleteTripCard =  (id) =>{	
	const tripColToDelete = document.getElementById(id);
	tripColToDelete.remove();

}

const addFirstDayWeather = (tripInfo) =>{
	let fisrtDayWeather;

	if(tripInfo.firstDay){
		fisrtDayWeather = `
		<div class="row weather-forcast align-items-center pb-4">
			<div class="col-12"><h5>Weather Forcast on ${tripInfo.departDate}:</h5></div>
			<div class="col-4 text-center p-3"><img src=${tripInfo.firstDay.icon}></div>
			<div class="col-8">
				<div class="temperature"><span><b>${tripInfo.firstDay.temp}</b> °C</span></div>
				<div class="weather-description"><span>${tripInfo.firstDay.description}</span></div>
			</div>
		</div>`
	} else {
		fisrtDayWeather = `
		<div class="row weather-forcast align-items-center pb-3">
		<div class="col-12"><h5>Weather Forcast on ${tripInfo.departDate}:</h5></div>
			<div class="col-10">
				<div class="temperature text-danger"><span> * This information is only available for trips 16 days away or sooner.</span></div>
			</div>
		</div>`
	}
	return fisrtDayWeather;
}

// Add new trip card to UI
export const addTripCard =  (tripInfo) =>{
	
	const tripStartsIn = date_diff_indays(new Date(), tripInfo.departDate);
	const allTripsRow = document.querySelector('.all-trips');

	const newTripCol = document.createElement('div');
	newTripCol.classList.add('col', 'p-3', 'col-xs-12', 'col-md-6', 'col-lg-4');
	newTripCol.id = tripInfo.id;
	const tempIconColorClasses = tempIconColor(tripInfo.destMaxTemp, tripInfo.destMinTemp);
	newTripCol.innerHTML = `
		<div class="card h-100">
			<img src="${tripInfo.destImgUrl}" class="card-img-top" alt="${tripInfo.destCity}, ${tripInfo.destImgDesc}">
			<div class="card-body">
	    		<h3 class="card-title">${tripInfo.destCity}, ${tripInfo.destCountry}</h3>
	    		<div class="card-text">${tripInfo.departDate} - ${tripInfo.returnDate}</div>
	    		<div class="card-text">Duration: <span><b>${tripInfo.duration}</b></span> days</div>
	    		<br>
	    		${addFirstDayWeather(tripInfo)}
	    		<div class="row weather-forcast align-items-center pb-3">
	    			<div class="col-12"><h5>Weather Forcast in ${new Date(tripInfo.departDate).toLocaleString('default', { month: 'long' })}:</h5></div>
	    			<div class="col-2 text-center p-3"><i class="${tempIconColorClasses[0]} ${tempIconColorClasses[1]} fa-2x"></i></div>
	    			<div class="col-10">
	    				<div class="Max-temperature"> Average High Temp <span><b>${tripInfo.destMaxTemp}</b></span> °C</div>
	    				<div class="weather-description"> Average Low Temp <span><b>${tripInfo.destMinTemp}</b></span> °C</div>
	    			</div>
    			</div>
			</div>
			<div class="row card-footer text-muted m-0 align-items-center">
				<p class="col-10 blockquote-footer m-0">Your trip will start in: <span><b>${tripStartsIn}</b></span> days</p>
				<button id="${tripInfo.id}" type="button" title="Delete Trip" class="delete-btn col-2 btn btn-outline-danger">
					<i class="fas fa-trash-alt fa-1x"></i>
				</button>
			</div>
		</div>
	`;

	allTripsRow.appendChild(newTripCol);
};