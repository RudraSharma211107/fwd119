

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



let buildingCards = document.querySelectorAll(".building-card");




buildingCards.forEach(function(card) {

    let header = card.querySelector(".building-header");

    header.addEventListener("click", function() {

        card.classList.toggle("active");

    });

});




let searchInput = document.getElementById("searchInput");
let coverageFilter = document.getElementById("coverageFilter");
let noResults = document.getElementById("noResults");

function filterBuildings() {

    let searchValue = searchInput.value.toLowerCase();
    let filterValue = coverageFilter.value;

    let visibleCount = 0;

    buildingCards.forEach(function(card) {

        let buildingName = card.querySelector("h3").innerText.toLowerCase();

        let buildingStatus = card.getAttribute("data-status");

        let matchesSearch = buildingName.includes(searchValue);

        let matchesFilter =
            filterValue === "all" ||
            buildingStatus === filterValue;

        if (matchesSearch && matchesFilter) {

            card.style.display = "block";
            visibleCount++;

        } else {

            card.style.display = "none";
            card.classList.remove("active");

        }

    });


    

    if (visibleCount === 0) {
        noResults.style.display = "block";
    } else {
        noResults.style.display = "none";
    }

}




searchInput.addEventListener("input", filterBuildings);




coverageFilter.addEventListener("change", filterBuildings);
