import {geonamesKey, worldweatheronlinekey, pixabayKey} from './apiKeys.js';

//Get coordinates, city name, country for Destination
export const getDestinationInfo = async (cityName) =>{
	let url = `http://api.geonames.org/searchJSON?q=${cityName}&maxRows=1&username=${geonamesKey}`;
	let response = await (fetch(url)).catch(err=>console.log(err));

	let data = await response.json();
	//handle 400 & 500 response
	if(!response.ok){
		alert(data.message);
	}
	//returns lat, lng, city, country
	return([data.geonames[0].lat, data.geonames[0].lng, data.geonames[0].toponymName, data.geonames[0].countryName]);
}


//Get Weather for month of the trip 
export const getWeather = async (lat, lng, monthNumber) => {
	let url = `http://api.worldweatheronline.com/premium/v1/weather.ashx?key=${worldweatheronlinekey}&q=${lat},${lng}&format=json`;
	let response = await (fetch(url)).catch(err=>console.log(err));

	let data = await response.json();
	//handle 400 & 500 response
	if(!response.ok){
		alert(data.message);
	}
	//round temp to two decimal points
	let maxTemp = data.data.ClimateAverages[0].month[monthNumber].absMaxTemp;
	maxTemp = parseFloat(maxTemp).toFixed(1);
	let minTemp = data.data.ClimateAverages[0].month[monthNumber].avgMinTemp;
	minTemp = parseFloat(minTemp).toFixed(1);
	// return Maxtemp, Mintemp
	return([maxTemp, minTemp]);
}


//Get image for Destination
export const getDestinationImg = async (cityName) =>{

	let url = `https://pixabay.com/api?key=${pixabayKey}&q=${cityName}`;
	let response = await (fetch(url)).catch(err=>console.log(err));
	let data = await response.json();
	//handle 400 & 500 response
	if(!response.ok){
		alert(data.message);
	}
	//return image url, image tags for accessibility
	return ([data.hits[0].webformatURL, data.hits[0].tags]);
}


