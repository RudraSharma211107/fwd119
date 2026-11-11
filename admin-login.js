
// SELECT ELEMENTS

let adminLoginForm = document.getElementById("adminLoginForm");

let adminId = document.getElementById("adminId");

let adminPassword = document.getElementById("adminPassword");

let togglePassword = document.getElementById("togglePassword");

let forgotPassword = document.getElementById("forgotPassword");

let message = document.getElementById("message");


// SHOW AND HIDE PASSWORD

togglePassword.addEventListener("click", function() {

    if (adminPassword.type === "password") {

        adminPassword.type = "text";
        togglePassword.innerHTML = "Hide";

    } else {

        adminPassword.type = "password";
        togglePassword.innerHTML = "Show";

    }

});


// FORGOT PASSWORD

forgotPassword.addEventListener("click", function() {

    alert("Please contact the authorized system administrator to reset your password.");

});


// ADMIN LOGIN FORM

adminLoginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    let id = adminId.value.trim();

    let pass = adminPassword.value.trim();


    // CHECK EMPTY FIELDS

    if (id === "" || pass === "") {

        message.innerHTML = "Please enter your Admin ID and Password.";

        message.className = "message error";

    } else {

        message.innerHTML = "Demo login successful! Redirecting...";

        message.className = "message success";

        setTimeout(function() {

            window.location.href = "admin-dashboard.html";

        }, 1000);

    }

});
