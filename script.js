

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", function () {
        sidebar.classList.toggle("show");
    });
}



const profileForm = document.getElementById("profileForm");

if (profileForm) {

    const savedProfile = JSON.parse(
        localStorage.getItem("sauAdminProfile")
    );

    if (savedProfile) {
        document.getElementById("name").value = savedProfile.name;
        document.getElementById("email").value = savedProfile.email;
        document.getElementById("phone").value = savedProfile.phone;

        document.getElementById("displayName").textContent =
            savedProfile.name;
    }

    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const profile = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value
        };

        localStorage.setItem(
            "sauAdminProfile",
            JSON.stringify(profile)
        );

        document.getElementById("displayName").textContent =
            profile.name;

        alert("Profile updated successfully!");
    });
}




const passwordForm = document.getElementById("passwordForm");

if (passwordForm) {

    passwordForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const newPassword =
            document.getElementById("newPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        if (newPassword.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }

        alert(
            "Password change is a demo only. " +
            "A secure backend is needed for real password changes."
        );

        passwordForm.reset();
    });
}



const logoutLinks = document.querySelectorAll(".logout");

logoutLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) {
            event.preventDefault();
        }

    });

});
