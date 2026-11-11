
// SELECT MENU ELEMENTS

let menuBtn = document.getElementById("menuBtn");
let navbar = document.getElementById("navbar");


// MOBILE MENU FUNCTION

menuBtn.addEventListener("click", function() {

    navbar.classList.toggle("active");

    // CHANGE MENU ICON

    if (navbar.classList.contains("active")) {
        menuBtn.innerHTML = "✕";
    } else {
        menuBtn.innerHTML = "☰";
    }

});


// CLOSE MENU AFTER CLICKING A LINK

let navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(function(link) {

    link.addEventListener("click", function() {

        navbar.classList.remove("active");
        menuBtn.innerHTML = "☰";

    });

});
