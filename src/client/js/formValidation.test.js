import "regenerator-runtime/runtime";
//DOM Manipulation Test
test('Check validateForm able add was-validated to form', () => {
  document.body.innerHTML = `
    <form class="col-md-8 col-lg-6 border rounded p-4 m-4 needs-validation" novalidate>
            <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="currentLocation">Current Location</label>
                  <input type="text" class="form-control" id="currentLocation" placeholder="City" pattern="[A-Za-z\s]{2,85}" required>
                  <div class="invalid-feedback">
                      Please enter your current location.
                    </div>
                </div>
                <div class="form-group col-md-6">
                  <label for="destLocation">Destination/City</label>
                  <input type="text" class="form-control" id="destLocation" placeholder="City" pattern="[A-Za-z\s]{2,85}" required>
                  <div class="invalid-feedback">
                      Please enter a destination.
                    </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="departDate">Departing</label>
                  <input type="Date" class="form-control" id="departDate" required>
                  <div class="invalid-feedback">
                      Please choose a departure date.
                    </div>
                </div>
                <div class="form-group col-md-6">
                  <label for="returnDate">Returning</label>
                    <input type="Date" class="form-control" id="returnDate" required>
                    <div class="invalid-feedback">
                      Please choose a return date.
                    </div>
                </div>
              </div>
              <button id="form-btn" type="submit" title="Submit" class="btn btn-danger btn-block">Submit</button>
          </form>
  `;

  const {validateForm, setDateConstraints, setReturnDateConstraints} = require('./formValidation.js');

  const inputForm = document.querySelector('.needs-validation');
  // const userUrlInput = document.getElementById('user-url');
  const submitButton = document.getElementById('form-btn');

  // userUrlInput.value = 'test';

  submitButton.addEventListener('click', (evt)=>{
    validateForm(evt) 
  });
  submitButton.click();

  expect(inputForm.classList.contains('was-validated')).toBeTruthy();
});