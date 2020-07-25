let d = new Date();
let todaysDate =  d.getFullYear()+'-'+ (d.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})+'-'+ d.getDate();

const departDateInput = document.getElementById('departDate');
const returnDateInput = document.getElementById('returnDate');


export const setConstraints = () => {
	//Set Validation Rules
	departDateInput.setAttribute("min", `${todaysDate}`);
	returnDateInput.setAttribute("min", `${todaysDate}`);
}

export const validateForm = (event)=>{

	const addTripForm = document.querySelector('.needs-validation');

	//Set Validation Rules
	if(departDateInput.value !== ""){
		returnDateInput.setAttribute("min", `${departDateInput.value}`);
		if(departDateInput.value > returnDateInput.value && returnDateInput.value !== ""){
			returnDateInput.nextElementSibling.innerHTML = 'Return date should be equal or greater than departure date';
		}
	};

	//handling validation
	if (addTripForm.checkValidity() === false){
		event.preventDefault();
		event.stopPropagation();

		addTripForm.classList.add('was-validated');

		return false;

	}else{
		return true;
	}
}