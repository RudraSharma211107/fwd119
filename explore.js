

let menuBtn = document.getElementById("menuBtn");
let navbar = document.getElementById("navbar");




menuBtn.addEventListener("click", function() {

    navbar.classList.toggle("active");

   

    if (navbar.classList.contains("active")) {
        menuBtn.innerHTML = "✕";
    } else {
        menuBtn.innerHTML = "☰";
    }

});




let navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(function(link) {

    link.addEventListener("click", function() {

        navbar.classList.remove("active");
        menuBtn.innerHTML = "☰";

    });

});
