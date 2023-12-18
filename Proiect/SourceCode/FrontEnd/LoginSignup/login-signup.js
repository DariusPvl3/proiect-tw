function validateLogin() {
  document.getElementById("validation-message").innerHTML = "";

  if (document.formFill.email.value == "") {
    document.getElementById("validation-message").innerHTML =
      "Please enter your email!";
    return false;
  } else if (document.formFill.password.value == "") {
    document.getElementById("validation-message").innerHTML =
      "Please enter a password!";
    return false;
  }

  document.getElementById("loginForm").submit();

  return false;
}

function validateSignup() {
  document.getElementById("validation-message").innerHTML = "";

  if (document.formFill.first_name.value == "") {
    document.getElementById("validation-message").innerHTML =
      "Please enter your first name!";
    return false;
  } else if (document.formFill.last_name.value == "") {
    document.getElementById("validation-message").innerHTML =
      "Please enter your last name!";
    return false;
  } else if (document.formFill.email.value == "") {
    document.getElementById("validation-message").innerHTML =
      "Please enter your email!";
    return false;
  } else if (document.formFill.password.value == "") {
    document.getElementById("validation-message").innerHTML =
      "Please enter a password!";
    return false;
  } else if (document.formFill.confirmPassword.value == "") {
    document.getElementById("validation-message").innerHTML =
      "Please confirm your password!";
    return false;
  } else if (
    document.formFill.password.value !== document.formFill.confirmPassword.value
  ) {
    document.getElementById("validation-message").innerHTML =
      "The entered passwords do not match!";
    return false;
  } else if (document.formFill.password.value.length < 6) {
    document.getElementById("validation-message").innerHTML =
      "Password must be at least 6 characters long!";
    return false;
  }

  document.getElementById("signupForm").submit();

  return false;
}

function validateForgotPassword() {
  document.getElementById("email-validation").innerHTML = "";

  if (document.formFill.email.value == "") {
    document.getElementById("validation-message").innerHTML =
      "Please enter your email!";
    return false;
  }

  document.getElementById("forgotForm").submit();

  return false;
}

function validateResetPassword() {
  document.getElementById("password-validation").innerHTML = "";

  if (document.formFill.password.value == "") {
    document.getElementById("validation-message").innerHTML =
      "Please enter a password!";
    return false;
  } else if (document.formFill.password.value.length < 6) {
    document.getElementById("validation-message").innerHTML =
      "Password must be at least 6 characters long!";
    return false;
  } else if (
    document.formFill.password.value !== document.formFill.confirmPassword.value
  ) {
    document.getElementById("validation-message").innerHTML =
      "The entered passwords do not match!";
    return false;
  }

  document.getElementById("resetForm").submit();

  return false;
}

function validateAndSubmitForgot() {
  const isValidationPassed = validateForgotPassword();

  if (isValidationPassed) {
    const formData = {
      email: document.formFill.email.value,
    };
    submitForm(formData, "forgot-password");
  } else {
    return false;
  }
}

function validateAndSubmitReset() {
  const isValidationPassed = validateResetPassword();

  if (isValidationPassed) {
    const formData = {
      password: document.formFill.password.value,
      token: document.formFill.token
        ? document.formFill.token.value
        : undefined,
    };
    submitForm(formData, "reset-password");
  } else {
    return false;
  }
}

function submitForm(formData, formType) {
  fetch(`/auth/${formType}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        document.getElementById("validation-message").innerHTML = data.error;
      } else if (data.success) {
        document.getElementById("success-message").innerHTML = data.success;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      if (formType === "login") {
        document.getElementById("validation-message").innerHTML =
          "Invalid credentials";
      }
    });
}

function validateAndSubmitLogin() {
  const isValidationPassed = validateLogin();

  if (isValidationPassed) {
    const formData = {
      email: document.formFill.email.value,
      password: document.formFill.password.value,
    };
    submitForm(formData, "login");
  } else {
    return false;
  }
}

function validateAndSubmitSignup() {
  const isValidationPassed = validateSignup();
  if (isValidationPassed) {
    const formData = {
      first_name: document.formFill.first_name.value,
      last_name: document.formFill.last_name.value,
      email: document.formFill.email.value,
      password: document.formFill.password.value,
      confirmPassword: document.formFill.confirmPassword.value,
    };
    submitForm(formData, "signup");
  } else {
    return false;
  }
}

function togglePasswordVisibility(inputId, toggleTextId) {
  const passwordInput = document.getElementById(inputId);
  const toggleText = document.getElementById(toggleTextId);

  // Toggle the 'type' attribute between 'password' and 'text'
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleText.innerText = "Hide Password";
  } else {
    passwordInput.type = "password";
    toggleText.innerText = "Show Password";
  }
}

function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const errorMessage = getQueryParam("errorMessage");
const successMessage = getQueryParam("successMessage");

if (errorMessage) {
  document.getElementById("validation-message").innerText = errorMessage;
}

if (successMessage) {
  document.getElementById("success-message").innerText = successMessage;
}

document.addEventListener("DOMContentLoaded", async () => {
  const authLinks = document.querySelectorAll(".menu-item[data-page^='auth/']");
  authLinks.forEach((authLink) => {
    const page = authLink.getAttribute("data-page").replace("auth/", "");
    authLink.addEventListener("click", async (event) => {
      event.preventDefault();
      loadAuthPage(page);
    });
  });
});
