// Sample attendance records for demonstration
let attendanceRecords = JSON.parse(
    localStorage.getItem("sauAttendance")
) || [
    {
        id: "SAU101",
        name: "Amit Kumar",
        date: "2026-11-11",
        checkIn: "08:55",
        status: "Present"
    },
    {
        id: "SAU102",
        name: "Rahul Singh",
        date: "2026-11-11",
        checkIn: "",
        status: "Absent"
    },
    {
        id: "SAU103",
        name: "Vijay Sharma",
        date: "2026-11-11",
        checkIn: "09:20",
        status: "Late"
    },
    {
        id: "SAU104",
        name: "Suresh Yadav",
        date: "2026-11-11",
        checkIn: "",
        status: "On Leave"
    }
];

let editingIndex = null;

const table = document.getElementById("attendanceTable");
const form = document.getElementById("attendanceForm");
const formSection = document.getElementById("attendanceFormSection");

const personnelId = document.getElementById("personnelId");
const personnelName = document.getElementById("personnelName");
const attendanceDate = document.getElementById("attendanceDate");
const checkIn = document.getElementById("checkIn");
const attendanceStatus = document.getElementById("attendanceStatus");

const searchInput = document.getElementById("searchInput");
const dateFilter = document.getElementById("dateFilter");
const statusFilter = document.getElementById("statusFilter");


// Save records in this browser
function saveRecords() {
    localStorage.setItem(
        "sauAttendance",
        JSON.stringify(attendanceRecords)
    );
}


// Display attendance records
function displayAttendance() {
    table.innerHTML = "";

    const searchValue = searchInput.value.toLowerCase();
    const selectedDate = dateFilter.value;
    const selectedStatus = statusFilter.value;

    let filteredRecords = attendanceRecords.filter(function(record) {
        let matchesSearch =
            record.name.toLowerCase().includes(searchValue) ||
            record.id.toLowerCase().includes(searchValue);

        let matchesDate =
            selectedDate === "" || record.date === selectedDate;

        let matchesStatus =
            selectedStatus === "All" ||
            record.status === selectedStatus;

        return matchesSearch && matchesDate && matchesStatus;
    });

    filteredRecords.forEach(function(record) {
        const originalIndex = attendanceRecords.indexOf(record);

        const row = document.createElement("tr");

        const cells = [
            record.id,
            record.name,
            record.date,
            record.checkIn || "--"
        ];

        cells.forEach(function(value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        statusBadge.className =
            "status status-" +
            record.status.toLowerCase().replace(" ", "-");

        statusBadge.textContent = record.status;
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        const actionCell = document.createElement("td");
        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", function() {
            editAttendance(originalIndex);
        });

        actionCell.appendChild(editButton);
        row.appendChild(actionCell);

        table.appendChild(row);
    });

    document.getElementById("emptyMessage").hidden =
        filteredRecords.length !== 0;

    updateSummary();
}


// Update summary cards using the currently selected date
function updateSummary() {
    const selectedDate = dateFilter.value;

    const recordsForDate = attendanceRecords.filter(function(record) {
        return selectedDate === "" || record.date === selectedDate;
    });

    document.getElementById("presentCount").textContent =
        recordsForDate.filter(r => r.status === "Present").length;

    document.getElementById("absentCount").textContent =
        recordsForDate.filter(r => r.status === "Absent").length;

    document.getElementById("lateCount").textContent =
        recordsForDate.filter(r => r.status === "Late").length;

    document.getElementById("leaveCount").textContent =
        recordsForDate.filter(r => r.status === "On Leave").length;
}


// Open a blank form for a new attendance record
document.getElementById("addRecordBtn").addEventListener("click", function() {
    resetForm();

    attendanceDate.value =
        dateFilter.value || new Date().toISOString().slice(0, 10);

    document.getElementById("formHeading").textContent =
        "Mark Attendance";

    formSection.scrollIntoView({ behavior: "smooth" });
});


// Edit an existing attendance record
function editAttendance(index) {
    const record = attendanceRecords[index];

    editingIndex = index;

    personnelId.value = record.id;
    personnelName.value = record.name;
    attendanceDate.value = record.date;
    checkIn.value = record.checkIn;
    attendanceStatus.value = record.status;

    document.getElementById("formHeading").textContent =
        "Edit Attendance Record";

    document.getElementById("saveBtn").textContent =
        "Update Attendance";

    formSection.scrollIntoView({ behavior: "smooth" });
}


// Save or update a record
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const newRecord = {
        id: personnelId.value.trim(),
        name: personnelName.value.trim(),
        date: attendanceDate.value,
        checkIn: checkIn.value,
        status: attendanceStatus.value
    };

    if (!newRecord.id || !newRecord.name || !newRecord.date) {
        alert("Please fill in all required fields.");
        return;
    }

    if (editingIndex === null) {
        const duplicate = attendanceRecords.some(function(record) {
            return record.id.toLowerCase() === newRecord.id.toLowerCase() &&
                   record.date === newRecord.date;
        });

        if (duplicate) {
            alert("An attendance record already exists for this ID and date. Please edit that record instead.");
            return;
        }

        attendanceRecords.push(newRecord);
        alert("Attendance marked successfully!");
    } else {
        const duplicate = attendanceRecords.some(function(record, index) {
            return index !== editingIndex &&
                   record.id.toLowerCase() === newRecord.id.toLowerCase() &&
                   record.date === newRecord.date;
        });

        if (duplicate) {
            alert("Another record already exists for this ID and date.");
            return;
        }

        attendanceRecords[editingIndex] = newRecord;
        alert("Attendance record updated successfully!");
    }

    saveRecords();
    resetForm();
    displayAttendance();
});


// Clear the form
function resetForm() {
    form.reset();
    editingIndex = null;

    document.getElementById("formHeading").textContent =
        "Mark Attendance";

    document.getElementById("saveBtn").textContent =
        "Save Attendance";
}


// Cancel form
document.getElementById("cancelBtn").addEventListener("click", function() {
    resetForm();
});


// Search and filter events
searchInput.addEventListener("input", displayAttendance);
dateFilter.addEventListener("change", displayAttendance);
statusFilter.addEventListener("change", displayAttendance);


// Mobile sidebar
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", function() {
    sidebar.classList.toggle("active");

    menuBtn.textContent = sidebar.classList.contains("active")
        ? "✕"
        : "☰";
});


// Logout confirmation
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


// Load the attendance table
displayAttendance();