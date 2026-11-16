

let logoutBtn = document.getElementById("logoutBtn");

let sidebarLogout = document.getElementById("sidebarLogout");

let menuBtn = document.getElementById("menuBtn");

let sidebar = document.getElementById("sidebar");



menuBtn.addEventListener("click", function() {

    sidebar.classList.toggle("active");

    if (sidebar.classList.contains("active")) {

        menuBtn.innerHTML = "✕";

    } else {

        menuBtn.innerHTML = "☰";

    }

});



let sidebarLinks = document.querySelectorAll(".sidebar a");

sidebarLinks.forEach(function(link) {

    link.addEventListener("click", function() {

        sidebar.classList.remove("active");

        menuBtn.innerHTML = "☰";

    });

});



function confirmLogout(event) {

    let answer = confirm("Are you sure you want to logout?");

    if (!answer) {

        event.preventDefault();

    }

}



logoutBtn.addEventListener("click", confirmLogout);




sidebarLogout.addEventListener("click", confirmLogout);



let totalStaff = document.getElementById("totalStaff");

let presentToday = document.getElementById("presentToday");

let pendingLeaves = document.getElementById("pendingLeaves");

let activePosts = document.getElementById("activePosts");

totalStaff.innerHTML = "--";

presentToday.innerHTML = "--";

pendingLeaves.innerHTML = "--";

activePosts.innerHTML = "--";
