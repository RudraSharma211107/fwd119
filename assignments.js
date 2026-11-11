// Sample duty assignment records
let assignments = JSON.parse(
    localStorage.getItem("sauAssignments")
) || [
    {
        id: "SAU101",
        name: "Amit Kumar",
        building: "Academic Block",
        floor: "Ground Floor",
        shift: "Morning",
        date: "2026-11-11",
        time: "08:00",
        supervisor: "Rajesh Kumar",
        status: "Active"
    },
    {
        id: "SAU102",
        name: "Rahul Singh",
        building: "Library Block",
        floor: "First Floor",
        shift: "Evening",
        date: "2026-11-11",
        time: "14:00",
        supervisor: "Rajesh Kumar",
        status: "Active"
    },
    {
        id: "SAU103",
        name: "Vijay Sharma",
        building: "Hostel Block",
        floor: "Ground Floor",
        shift: "Night",
        date: "2026-11-11",
        time: "22:00",
        supervisor: "Manoj Singh",
        status: "Cancelled"
    }
];

let editingIndex = null;

const assignmentTable = document.getElementById("assignmentTable");
const assignmentForm = document.getElementById("assignmentForm");
const formSection = document.getElementById("assignmentFormSection");

const searchInput = document.getElementById("searchInput");
const dateFilter = document.getElementById("dateFilter");
const statusFilter = document.getElementById("statusFilter");


// Save assignments in browser storage
function saveAssignments() {
    localStorage.setItem("sauAssignments", JSON.stringify(assignments));
}


// Display assignments
function displayAssignments() {

    assignmentTable.innerHTML = "";

    const searchValue = searchInput.value.toLowerCase();
    const selectedDate = dateFilter.value;
    const selectedStatus = statusFilter.value;

    let filteredAssignments = assignments.filter(function(item) {

        const matchesSearch =
            item.name.toLowerCase().includes(searchValue) ||
            item.id.toLowerCase().includes(searchValue);

        const matchesDate =
            selectedDate === "" || item.date === selectedDate;

        const matchesStatus =
            selectedStatus === "All" || item.status === selectedStatus;

        return matchesSearch && matchesDate && matchesStatus;
    });

    filteredAssignments.forEach(function(item) {

        const originalIndex = assignments.indexOf(item);
        const row = document.createElement("tr");

        const details = [
            item.id,
            item.name,
            item.building,
            item.floor,
            item.shift,
            item.date
        ];

        details.forEach(function(value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        // Status
        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        statusBadge.className =
            item.status === "Active"
                ? "assignment-status active-status"
                : "assignment-status cancelled-status";

        statusBadge.textContent = item.status;

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
            editAssignment(originalIndex);
        });

        actionButtons.appendChild(editButton);

        if (item.status === "Active") {

            const cancelButton = document.createElement("button");

            cancelButton.textContent = "Cancel";
            cancelButton.className = "cancel-assignment-btn";

            cancelButton.addEventListener("click", function() {
                cancelAssignment(originalIndex);
            });

            actionButtons.appendChild(cancelButton);
        }

        actionCell.appendChild(actionButtons);
        row.appendChild(actionCell);

        assignmentTable.appendChild(row);
    });

    document.getElementById("emptyMessage").hidden =
        filteredAssignments.length !== 0;

    updateSummary();
}


// Update summary cards
function updateSummary() {

    const total = assignments.length;

    const active = assignments.filter(function(item) {
        return item.status === "Active";
    }).length;

    const cancelled = assignments.filter(function(item) {
        return item.status === "Cancelled";
    }).length;

    document.getElementById("totalAssignments").textContent = total;
    document.getElementById("activeAssignments").textContent = active;
    document.getElementById("cancelledAssignments").textContent = cancelled;
}


// Open form for a new assignment
document.getElementById("addAssignmentBtn").addEventListener("click", function() {

    resetForm();

    document.getElementById("formHeading").textContent =
        "Create New Assignment";

    document.getElementById("dutyDate").value =
        new Date().toISOString().slice(0, 10);

    formSection.scrollIntoView({ behavior: "smooth" });
});


// Edit an assignment
function editAssignment(index) {

    const item = assignments[index];

    editingIndex = index;

    document.getElementById("personnelId").value = item.id;
    document.getElementById("personnelName").value = item.name;
    document.getElementById("building").value = item.building;
    document.getElementById("floor").value = item.floor;
    document.getElementById("shift").value = item.shift;
    document.getElementById("dutyDate").value = item.date;
    document.getElementById("reportingTime").value = item.time;
    document.getElementById("supervisor").value = item.supervisor;
    document.getElementById("assignmentStatus").value = item.status;

    document.getElementById("formHeading").textContent =
        "Edit Duty Assignment";

    document.getElementById("saveBtn").textContent =
        "Update Assignment";

    formSection.scrollIntoView({ behavior: "smooth" });
}


// Add or update an assignment
assignmentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const newAssignment = {
        id: document.getElementById("personnelId").value.trim(),
        name: document.getElementById("personnelName").value.trim(),
        building: document.getElementById("building").value,
        floor: document.getElementById("floor").value.trim(),
        shift: document.getElementById("shift").value,
        date: document.getElementById("dutyDate").value,
        time: document.getElementById("reportingTime").value,
        supervisor: document.getElementById("supervisor").value.trim(),
        status: document.getElementById("assignmentStatus").value
    };

    // Prevent duplicate active assignments for the same person,
    // date and shift.
    const duplicate = assignments.some(function(item, index) {

        return index !== editingIndex &&
            item.id.toLowerCase() === newAssignment.id.toLowerCase() &&
            item.date === newAssignment.date &&
            item.shift === newAssignment.shift &&
            item.status === "Active" &&
            newAssignment.status === "Active";

    });

    if (duplicate) {
        alert("This person already has an active assignment for this date and shift.");
        return;
    }

    if (editingIndex === null) {

        assignments.push(newAssignment);
        alert("Duty assignment created successfully!");

    } else {

        assignments[editingIndex] = newAssignment;
        alert("Duty assignment updated successfully!");

    }

    saveAssignments();
    resetForm();
    displayAssignments();
});


// Cancel an assignment
function cancelAssignment(index) {

    const confirmAction = confirm(
        "Are you sure you want to cancel this duty assignment?"
    );

    if (confirmAction) {

        assignments[index].status = "Cancelled";

        saveAssignments();
        displayAssignments();

        alert("Assignment cancelled successfully!");
    }
}


// Reset the form
function resetForm() {

    assignmentForm.reset();

    editingIndex = null;

    document.getElementById("formHeading").textContent =
        "Create New Assignment";

    document.getElementById("saveBtn").textContent =
        "Save Assignment";
}


// Cancel form button
document.getElementById("cancelBtn").addEventListener("click", function() {
    resetForm();
});


// Search and filter
searchInput.addEventListener("input", displayAssignments);
dateFilter.addEventListener("change", displayAssignments);
statusFilter.addEventListener("change", displayAssignments);


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


// Load assignments when page opens
displayAssignments();