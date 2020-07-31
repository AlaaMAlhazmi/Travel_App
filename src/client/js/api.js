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

	if(data.totalResultsCount){
		//returns lat, lng, city, country
		return([data.geonames[0].lat, data.geonames[0].lng, data.geonames[0].toponymName, data.geonames[0].countryName]);
	}else{
		return({error: 'city not found'});
	}
};


//Get Weather for month of the trip 
export const getWeather = async (lat, lng, monthNumber) => {
	let url = `http://api.worldweatheronline.com/premium/v1/weather.ashx?key=${worldweatheronlinekey}&q=${lat},${lng}&format=json`;
	let response = await (fetch(url)).catch(err=>console.log(err));

	let data = await response.json();
	//handle 400 & 500 response
	if(!response.ok){
		alert(data.message);
	}

	if(data.error){
		return(data.error[0].msg)
	}else{
		//round temp to two decimal points
		let maxTemp = data.data.ClimateAverages[0].month[monthNumber].absMaxTemp;
		maxTemp = parseFloat(maxTemp).toFixed(1);
		let minTemp = data.data.ClimateAverages[0].month[monthNumber].avgMinTemp;
		minTemp = parseFloat(minTemp).toFixed(1);
		// return Maxtemp, Mintemp
		return([maxTemp, minTemp]);
	}
};


//Get image for Destination
export const getDestinationImg = async (keyword) =>{

	let baseURL = `https://pixabay.com/api?key=${pixabayKey}`;
	let response = await (fetch(baseURL+`&q=${keyword}`)).catch(err=>console.log(err));
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
};