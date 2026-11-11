
// Mobile Sidebar
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", function () {
    sidebar.classList.toggle("show");
});

// Load saved profile
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

// Save profile details
document.getElementById("profileForm").addEventListener(
    "submit", function (event) {

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

// Change Password Demo
document.getElementById("passwordForm").addEventListener(
    "submit", function (event) {

    event.preventDefault();

    const currentPassword =
        document.getElementById("currentPassword").value;

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

    alert("Password change is a demo only. Connect a secure backend to enable it.");

    document.getElementById("passwordForm").reset();
});
