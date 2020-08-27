let d = new Date();
let todaysDate =  d.getFullYear()+'-'+ (d.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})+'-'+ d.getDate();

const departDateInput = document.getElementById('departDate');
const returnDateInput = document.getElementById('returnDate');
const currentCityInput = document.getElementById('currentLocation');
const destinationCityinput = document.getElementById('destLocation');


export const setDateConstraints = () => {
	//Set Validation Rules
	departDateInput.setAttribute("min", `${todaysDate}`);
	returnDateInput.setAttribute("min", `${todaysDate}`);
}

export const setReturnDateConstraints = () =>{
	returnDateInput.setAttribute("min", departDateInput.value);
}

export const validateForm = (event)=>{

	const addTripForm = document.querySelector('.needs-validation');

	//Set Return Date Validation Massege
	if(departDateInput.value > returnDateInput.value && returnDateInput.value !== ""){
		returnDateInput.nextElementSibling.innerHTML = 'Return date should be equal or greater than departure date';
	};

	//Set Current City Validation Massege
	if(currentCityInput.validity.patternMismatch){
		currentCityInput.nextElementSibling.innerHTML = 'City name should be longer than 2 and shorter than 85 letters';
	};

	//Set Destination City Validation Massege
	if(destinationCityinput.validity.patternMismatch){
		destinationCityinput.nextElementSibling.innerHTML = 'City name should be longer than 2 and shorter than 85 letters';
	};


	//handling validation
	if (addTripForm.checkValidity() === false){
		event.preventDefault();
		event.stopPropagation();

		addTripForm.classList.add('was-validated');

		return false;

	}else{
		
		addTripForm.classList.remove('was-validated');
		return true;
	}
}