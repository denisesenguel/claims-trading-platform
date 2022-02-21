const loginForm = document.getElementById("login-form");
if (loginForm) {

  const loginSubmit = loginForm.querySelector(".btn");
  
  loginSubmit.addEventListener("click", () => {

    const radioElmArray = Array.from(loginForm.querySelectorAll("input.form-check-input"));
    const radioElmSelected = radioElmArray.filter(inputField => inputField.checked);

    const textFieldArray = Array.from(loginForm.querySelectorAll("input.form-control"));
    const textFieldEmpty = textFieldArray.filter(inputField => inputField.value === "");

    if (radioElmSelected.length < 1 || textFieldEmpty.length > 0) {
      loginSubmit.classList.add('animate__animated', 'animate__headShake');
      setTimeout(function() {
        loginSubmit.classList.remove('animate__animated', 'animate__headShake');
      }, 1000);
    }
  });
}
