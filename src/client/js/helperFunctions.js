///// Helper Functions //////////

// find difference between two dates in days
//Ref: https://www.w3resource.com/javascript-exercises/javascript-date-exercise-8.php
export const date_diff_indays = (date1, date2) => {
	const dt1 = new Date(date1);
	const dt2 = new Date(date2);
	return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
};


//scroll to element by its id
export const smoothScrollTo = (id) =>{
	window.scrollTo({
				top: document.getElementById(id).offsetTop,
				behavior: 'smooth'
			});
};


// Choose Icon specifications set by classes according to the avarge tempreature
export const tempIconColor = (maxTemp, minTemp)=>{

	const iconClasses = ["fas fa-thermometer-quarter", "fas fa-thermometer-half", "fas fa-thermometer-full"];
	const colorClasses = ['text-info', 'text-warning', 'text-danger'];

	const temAvg = (Number(maxTemp)+Number(minTemp))/2;

	if (temAvg<=10) {
		return ([iconClasses[0], colorClasses[0]]);
	} else if (temAvg<35 && temAvg>10) {
		return ([iconClasses[1], colorClasses[1]]);
	} else {
		return ([iconClasses[2], colorClasses[2]])
	};
};