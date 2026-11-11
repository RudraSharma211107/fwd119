
// SELECT MENU ELEMENTS

let menuBtn = document.getElementById("menuBtn");
let navbar = document.getElementById("navbar");


// MOBILE MENU FUNCTION

menuBtn.addEventListener("click", function() {

    navbar.classList.toggle("active");

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


// SELECT BUILDING CARDS

let buildingCards = document.querySelectorAll(".building-card");


// EXPAND AND COLLAPSE BUILDING CARDS

buildingCards.forEach(function(card) {

    let header = card.querySelector(".building-header");

    header.addEventListener("click", function() {

        card.classList.toggle("active");

    });

});


// SEARCH BUILDINGS

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


    // SHOW MESSAGE IF NO BUILDING IS FOUND

    if (visibleCount === 0) {
        noResults.style.display = "block";
    } else {
        noResults.style.display = "none";
    }

}


// SEARCH EVENT

searchInput.addEventListener("input", filterBuildings);


// FILTER EVENT

coverageFilter.addEventListener("change", filterBuildings);
