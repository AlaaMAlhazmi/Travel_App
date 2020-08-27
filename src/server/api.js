module.exports = {
  getDestinationInfo,
  getFirstDayWeather,
  getWeather,
  getDestinationImg
};

const fetch = require('node-fetch');

// environment variables requirments
require('dotenv').config()
const geonamesKey = process.env.GEONAMES_KEY
const weatherbitKey = process.env.WEATHERBIT_KEY
const worldweatheronlinekey = process.env.WORLDWEATHERONLINE_KEY
const pixabayKey = process.env.PIXABAY_KEY

////geonames API call
async function getDestinationInfo (cityName){

	let url = `http://api.geonames.org/searchJSON?q=${cityName}&maxRows=1&username=${geonamesKey}`;
	let response = await (fetch(url))
	let data = await response.json();
	//handle 400 & 500 response
	if(!response.ok){
		throw new Error('Sowmthing Went Wrong');
	}

	if(data.totalResultsCount){
		//returns lat, lng, city, country
		return([data.geonames[0].lat, data.geonames[0].lng, data.geonames[0].toponymName, data.geonames[0].countryName]);
	}else{
		throw new Error('City Not Found!');
	}
}

//weatherbit API call
async function getFirstDayWeather (lat, lng, date){
	let url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${weatherbitKey}`
	let response = await (fetch(url))
	let data = await response.json();

	//handle 400 & 500 response
	if(!response.ok){
		throw new Error('Sowmthing Went Wrong');
	}

	if(!data.data){
		throw new Error('Weather Not Found');
	} else {
		for (i=0; i<=(data.data).length-1; i++){
			if (data.data[i].valid_date === date) {
				return({
					temp: data.data[i].temp,
					description: data.data[i].weather.description,
					icon: `https://www.weatherbit.io/static/img/icons/${data.data[i].weather.icon}.png`});
			}
		}
	}
}


//worldweatheronline API call 
async function getWeather (lat, lng, monthNumber){

	let url = `http://api.worldweatheronline.com/premium/v1/weather.ashx?key=${worldweatheronlinekey}&q=${lat},${lng}&format=json`;
	let response = await (fetch(url))
	let data = await response.json();
	//handle 400 & 500 response
	if(!response.ok){
		throw new Error('Sowmthing Went Wrong');
	}

	if(data.error){
		throw new Error(data.error[0].msg)
	}else{
		//round temp to two decimal points
		let maxTemp = data.data.ClimateAverages[0].month[monthNumber].absMaxTemp;
		maxTemp = parseFloat(maxTemp).toFixed(1);
		let minTemp = data.data.ClimateAverages[0].month[monthNumber].avgMinTemp;
		minTemp = parseFloat(minTemp).toFixed(1);
		// return Maxtemp, Mintemp
		return([maxTemp, minTemp]);
	}
}


//Pixabay API Call
async function getDestinationImg (keyword) {

	let baseURL = `https://pixabay.com/api?key=${pixabayKey}`;
	let response = await (fetch(baseURL+`&q=${keyword}`))
	let data = await response.json();
	
	//handle 400 & 500 response
	if(!response.ok){
		//return totalHits, image url, image tags for accessibility
		return ([0, './assets/imgs/fallbackImage.jpg', 'no image for the city/country found']);
	};

	if(data.totalHits){
		//return totalHits, image url, image tags for accessibility
		return ([data.totalHits, data.hits[0].webformatURL, data.hits[0].tags]);
	}else{
		//handle no hits
		//return totalHits, fallback image url, image tag for accessibility
		return ([data.totalHits, './assets/imgs/fallbackImage.jpg', 'globe image, no image for the city/country found']);
	}	
}