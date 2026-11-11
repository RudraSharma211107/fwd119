// Sample staff records
let staffRecords = JSON.parse(
    localStorage.getItem("sauStaff")
) || [
    {
        id: "SAU101",
        name: "Amit Kumar",
        designation: "Security Guard",
        department: "Security",
        phone: "9876543210",
        email: "amit@example.com",
        shift: "Morning",
        status: "Active"
    },
    {
        id: "SAU102",
        name: "Rahul Singh",
        designation: "Supervisor",
        department: "Security",
        phone: "9876543211",
        email: "rahul@example.com",
        shift: "Evening",
        status: "Active"
    },
    {
        id: "SAU103",
        name: "Vijay Sharma",
        designation: "Security Officer",
        department: "Security",
        phone: "9876543212",
        email: "vijay@example.com",
        shift: "Night",
        status: "Inactive"
    }
];

let editingIndex = null;

const staffTable = document.getElementById("staffTable");
const staffForm = document.getElementById("staffForm");
const staffFormSection = document.getElementById("staffFormSection");

const searchInput = document.getElementById("searchInput");
const designationFilter = document.getElementById("designationFilter");
const statusFilter = document.getElementById("statusFilter");


// Save staff records in browser storage
function saveStaff() {
    localStorage.setItem("sauStaff", JSON.stringify(staffRecords));
}


// Display staff records
function displayStaff() {
    staffTable.innerHTML = "";

    const searchValue = searchInput.value.toLowerCase();
    const selectedDesignation = designationFilter.value;
    const selectedStatus = statusFilter.value;

    let filteredStaff = staffRecords.filter(function(person) {

        let matchesSearch =
            person.name.toLowerCase().includes(searchValue) ||
            person.id.toLowerCase().includes(searchValue);

        let matchesDesignation =
            selectedDesignation === "All" ||
            person.designation === selectedDesignation;

        let matchesStatus =
            selectedStatus === "All" ||
            person.status === selectedStatus;

        return matchesSearch && matchesDesignation && matchesStatus;
    });

    filteredStaff.forEach(function(person) {

        const originalIndex = staffRecords.indexOf(person);
        const row = document.createElement("tr");

        const details = [
            person.id,
            person.name,
            person.designation,
            person.department,
            person.phone
        ];

        details.forEach(function(value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        // Account status
        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        statusBadge.className =
            person.status === "Active"
                ? "account-status active-status"
                : "account-status inactive-status";

        statusBadge.textContent = person.status;
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        // Action buttons
        const actionCell = document.createElement("td");
        const actionButtons = document.createElement("div");

        actionButtons.className = "action-buttons";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", function() {
            editStaff(originalIndex);
        });

        const toggleButton = document.createElement("button");

        toggleButton.textContent =
            person.status === "Active" ? "Deactivate" : "Activate";

        toggleButton.className = "toggle-btn";

        toggleButton.addEventListener("click", function() {
            toggleStatus(originalIndex);
        });

        actionButtons.appendChild(editButton);
        actionButtons.appendChild(toggleButton);

        actionCell.appendChild(actionButtons);
        row.appendChild(actionCell);

        staffTable.appendChild(row);
    });

    document.getElementById("emptyMessage").hidden =
        filteredStaff.length !== 0;

    updateSummary();
}


// Update summary cards
function updateSummary() {

    const total = staffRecords.length;

    const active = staffRecords.filter(function(person) {
        return person.status === "Active";
    }).length;

    const inactive = staffRecords.filter(function(person) {
        return person.status === "Inactive";
    }).length;

    document.getElementById("totalStaff").textContent = total;
    document.getElementById("activeStaff").textContent = active;
    document.getElementById("inactiveStaff").textContent = inactive;
}


// Open blank form for adding personnel
document.getElementById("addStaffBtn").addEventListener("click", function() {

    resetForm();

    document.getElementById("formHeading").textContent =
        "Add New Personnel";

    staffFormSection.scrollIntoView({ behavior: "smooth" });
});


// Edit staff details
function editStaff(index) {

    const person = staffRecords[index];

    editingIndex = index;

    document.getElementById("personnelId").value = person.id;
    document.getElementById("personnelName").value = person.name;
    document.getElementById("designation").value = person.designation;
    document.getElementById("department").value = person.department;
    document.getElementById("phone").value = person.phone;
    document.getElementById("email").value = person.email;
    document.getElementById("shift").value = person.shift;
    document.getElementById("accountStatus").value = person.status;

    document.getElementById("formHeading").textContent =
        "Edit Personnel Details";

    document.getElementById("saveBtn").textContent =
        "Update Personnel";

    staffFormSection.scrollIntoView({ behavior: "smooth" });
}


// Add or update personnel
staffForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const newPerson = {
        id: document.getElementById("personnelId").value.trim(),
        name: document.getElementById("personnelName").value.trim(),
        designation: document.getElementById("designation").value,
        department: document.getElementById("department").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        shift: document.getElementById("shift").value,
        status: document.getElementById("accountStatus").value
    };

    // Check whether the ID already exists
    const duplicate = staffRecords.some(function(person, index) {

        return person.id.toLowerCase() === newPerson.id.toLowerCase()
            && index !== editingIndex;

    });

    if (duplicate) {
        alert("This Personnel ID already exists.");
        return;
    }

    if (editingIndex === null) {

        staffRecords.push(newPerson);
        alert("New personnel added successfully!");

    } else {

        staffRecords[editingIndex] = newPerson;
        alert("Personnel details updated successfully!");

    }

    saveStaff();
    resetForm();
    displayStaff();
});


// Activate or deactivate a staff account
function toggleStatus(index) {

    const person = staffRecords[index];

    if (person.status === "Active") {

        const confirmAction = confirm(
            "Are you sure you want to deactivate this staff account?"
        );

        if (confirmAction) {
            person.status = "Inactive";
        }

    } else {

        const confirmAction = confirm(
            "Do you want to activate this staff account?"
        );

        if (confirmAction) {
            person.status = "Active";
        }
    }

    saveStaff();
    displayStaff();
}


// Reset the form
function resetForm() {

    staffForm.reset();

    editingIndex = null;

    document.getElementById("formHeading").textContent =
        "Add New Personnel";

    document.getElementById("saveBtn").textContent =
        "Add Personnel";
}


// Cancel button
document.getElementById("cancelBtn").addEventListener("click", function() {
    resetForm();
});


// Search and filter
searchInput.addEventListener("input", displayStaff);

designationFilter.addEventListener("change", displayStaff);

statusFilter.addEventListener("change", displayStaff);


// Mobile sidebar
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", function() {

    sidebar.classList.toggle("active");

    menuBtn.textContent = sidebar.classList.contains("active")
        ? "✕"
        : "☰";

});


// Logout
function logout() {

    if (confirm("Are you sure you want to logout?")) {
        window.location.href = "index.html";
    }

}

document.getElementById("logoutBtn").addEventListener("click", function(event) {
    event.preventDefault();
    logout();
});

document.getElementById("sidebarLogout").addEventListener("click", function(event) {
    event.preventDefault();
    logout();
});


// Load staff records when page opens
displayStaff();