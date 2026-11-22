
/* =========================================
   SAU SECURITY PORTAL - JAVASCRIPT
========================================= */

/* 1. LOCAL STORAGE HELPERS */

function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getElement(id) {
    return document.getElementById(id);
}

function showMessage(id, message, success = true) {
    const element = getElement(id);

    if (element) {
        element.textContent = message;
        element.className = success
            ? "message success-message"
            : "message error-message";
    }
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function makeId() {
    return Date.now().toString() + Math.random().toString(16).slice(2);
}

/* 2. MOBILE NAVIGATION */

const menuBtn = getElement("menuBtn");

if (menuBtn) {
    menuBtn.addEventListener("click", function () {
        const nav = document.querySelector(".nav-links");
        const sidebar = document.querySelector(".sidebar");

        if (nav) nav.classList.toggle("show");
        if (sidebar) sidebar.classList.toggle("show");
    });
}


/* 3. SHOW / HIDE PASSWORD */

document.querySelectorAll(".toggle-password, .show-password").forEach(button => {

    button.addEventListener("click", function () {

        const input = this.parentElement.querySelector("input");

        if (!input) return;

        if (input.type === "password") {
            input.type = "text";

            if (this.classList.contains("show-password")) {
                this.textContent = "Hide";
            }

        } else {
            input.type = "password";

            if (this.classList.contains("show-password")) {
                this.textContent = "Show";
            }
        }

    });

});


/* 4. LOGIN SYSTEM - FRONTEND DEMO */

function setupLogin(formId, idField, passwordField, messageId, role) {
    const form = getElement(formId);

    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const userId = getElement(idField).value.trim();
        const password = getElement(passwordField).value;

        if (!userId || !password) {
            showMessage(messageId, "Please fill in all fields.", false);
            return;
        }

        /*
          Demo-only login:
          This accepts any non-empty ID and password.
          It does NOT verify real university accounts.
        */

        const destination = role === "admin"
            ? "admin-dashboard.html"
            : "personnel-dashboard.html";

        sessionStorage.setItem("sauDemoRole", role);
        sessionStorage.setItem("sauDemoUser", userId);

        window.location.href = destination;
    });
}

setupLogin(
    "adminLoginForm",
    "adminId",
    "adminPassword",
    "adminLoginMessage",
    "admin"
);

setupLogin(
    "personnelLoginForm",
    "personnelId",
    "personnelPassword",
    "personnelLoginMessage",
    "personnel"
);

/* 5. LOGOUT */

document.querySelectorAll(".logout-btn").forEach(button => {
    button.addEventListener("click", function (event) {
        event.preventDefault();
        sessionStorage.removeItem("sauDemoRole");
        sessionStorage.removeItem("sauDemoUser");
        window.location.href = "index.html";
    });
});

/* 6. STAFF MANAGEMENT */

const staffForm = getElement("staffForm");

function renderStaff() {
    const table = getElement("staffTableBody");
    if (!table) return;

    const search = (getElement("staffSearch")?.value || "").toLowerCase();
    const filter = getElement("staffStatusFilter")?.value || "";

    const staff = getData("sauStaff");

    const filtered = staff.filter(person => {
        const matchesSearch =
            person.id.toLowerCase().includes(search) ||
            person.name.toLowerCase().includes(search);

        const matchesStatus =
            !filter || person.status === filter;

        return matchesSearch && matchesStatus;
    });

    table.innerHTML = "";

    filtered.forEach(person => {
        table.innerHTML += `
            <tr>
                <td>${escapeHTML(person.id)}</td>
                <td>${escapeHTML(person.name)}</td>
                <td>${escapeHTML(person.phone)}</td>
                <td>${escapeHTML(person.email)}</td>
                <td>${escapeHTML(person.shift)}</td>
                <td>${escapeHTML(person.status)}</td>
                <td>
                    <button class="btn-primary" onclick="editStaff('${person.key}')">Edit</button>
                    <button class="btn-danger" onclick="deleteStaff('${person.key}')">Delete</button>
                </td>
            </tr>
        `;
    });

    if (getElement("staffCount")) {
        getElement("staffCount").textContent = staff.length;
    }

    if (getElement("staffEmptyMessage")) {
        getElement("staffEmptyMessage").style.display =
            filtered.length ? "none" : "block";
    }
}

if (staffForm) {
    staffForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const staff = getData("sauStaff");
        const editId = getElement("staffEditId").value;

        const person = {
            key: editId || makeId(),
            id: getElement("staffId").value.trim(),
            name: getElement("staffName").value.trim(),
            phone: getElement("staffPhone").value.trim(),
            email: getElement("staffEmail").value.trim(),
            shift: getElement("staffShift").value,
            status: getElement("staffStatus").value
        };

        const duplicate = staff.some(item =>
            item.id.toLowerCase() === person.id.toLowerCase() &&
            item.key !== editId
        );

        if (duplicate) {
            alert("This Staff ID already exists.");
            return;
        }

        if (editId) {
            const index = staff.findIndex(item => item.key === editId);
            if (index !== -1) staff[index] = person;
        } else {
            staff.push(person);
        }

        saveData("sauStaff", staff);
        staffForm.reset();
        getElement("staffEditId").value = "";
        renderStaff();
    });
}

function editStaff(key) {
    const person = getData("sauStaff").find(item => item.key === key);
    if (!person) return;

    getElement("staffEditId").value = person.key;
    getElement("staffId").value = person.id;
    getElement("staffName").value = person.name;
    getElement("staffPhone").value = person.phone;
    getElement("staffEmail").value = person.email;
    getElement("staffShift").value = person.shift;
    getElement("staffStatus").value = person.status;

    window.scrollTo(0, 0);
}

function deleteStaff(key) {
    if (!confirm("Delete this staff member?")) return;

    const staff = getData("sauStaff").filter(item => item.key !== key);
    saveData("sauStaff", staff);
    renderStaff();
}

getElement("staffSearch")?.addEventListener("input", renderStaff);
getElement("staffStatusFilter")?.addEventListener("change", renderStaff);
getElement("staffResetBtn")?.addEventListener("click", function () {
    getElement("staffEditId").value = "";
});

renderStaff();

/* 7. STAFF DROPDOWN HELPER */

function fillStaffDropdown(id) {
    const select = getElement(id);
    if (!select) return;

    const previousValue = select.value;
    const staff = getData("sauStaff");

    select.innerHTML = '<option value="">Select Staff</option>';

    staff.forEach(person => {
        select.innerHTML += `
            <option value="${escapeHTML(person.id)}">
                ${escapeHTML(person.id)} - ${escapeHTML(person.name)}
            </option>
        `;
    });

    if (staff.some(person => person.id === previousValue)) {
        select.value = previousValue;
    }
}

fillStaffDropdown("attendanceStaffId");
fillStaffDropdown("assignmentStaffId");
fillStaffDropdown("scheduleStaffId");
fillStaffDropdown("leaveStaffId");

/* 8. ATTENDANCE MANAGEMENT */

const attendanceForm = getElement("attendanceForm");

function renderAttendance() {
    const table = getElement("attendanceTableBody");
    if (!table) return;

    const records = getData("sauAttendance");
    const search = (getElement("attendanceSearch")?.value || "").toLowerCase();
    const filter = getElement("attendanceStatusFilter")?.value || "";
    const date = getElement("attendanceDateFilter")?.value || "";

    const filtered = records.filter(item =>
        (item.name.toLowerCase().includes(search) ||
         item.staffId.toLowerCase().includes(search)) &&
        (!filter || item.status === filter) &&
        (!date || item.date === date)
    );

    table.innerHTML = "";

    filtered.forEach(item => {
        table.innerHTML += `
            <tr>
                <td>${escapeHTML(item.staffId)}</td>
                <td>${escapeHTML(item.name)}</td>
                <td>${escapeHTML(item.date)}</td>
                <td>${escapeHTML(item.status)}</td>
                <td>
                    <button class="btn-danger" onclick="deleteRecord('sauAttendance','${item.key}',renderAttendance)">Delete</button>
                </td>
            </tr>
        `;
    });

    if (getElement("attendanceEmptyMessage")) {
        getElement("attendanceEmptyMessage").style.display =
            filtered.length ? "none" : "block";
    }
}

if (attendanceForm) {
    attendanceForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const staffId = getElement("attendanceStaffId").value;
        const person = getData("sauStaff").find(item => item.id === staffId);

        if (!person) {
            alert("Please select a valid staff member from the Staff Directory.");
            return;
        }

        const records = getData("sauAttendance");
        const editId = getElement("attendanceEditId").value;

        const record = {
            key: editId || makeId(),
            staffId: person.id,
            name: person.name,
            date: getElement("attendanceDate").value,
            status: getElement("attendanceStatus").value
        };

        if (editId) {
            const index = records.findIndex(item => item.key === editId);
            if (index !== -1) records[index] = record;
        } else {
            records.push(record);
        }

        saveData("sauAttendance", records);
        attendanceForm.reset();
        getElement("attendanceEditId").value = "";
        renderAttendance();
    });
}

getElement("attendanceSearch")?.addEventListener("input", renderAttendance);
getElement("attendanceStatusFilter")?.addEventListener("change", renderAttendance);
getElement("attendanceDateFilter")?.addEventListener("change", renderAttendance);

renderAttendance();

/* 9. DUTY ASSIGNMENTS */

const assignmentForm = getElement("assignmentForm");

function renderAssignments() {
    const table = getElement("assignmentTableBody");
    if (!table) return;

    const records = getData("sauAssignments");
    const search = (getElement("assignmentSearch")?.value || "").toLowerCase();
    const filter = getElement("assignmentStatusFilter")?.value || "";

    const filtered = records.filter(item =>
        (item.name.toLowerCase().includes(search) ||
         item.location.toLowerCase().includes(search)) &&
        (!filter || item.status === filter)
    );

    table.innerHTML = "";

    filtered.forEach(item => {
        table.innerHTML += `
            <tr>
                <td>${escapeHTML(item.staffId)}</td>
                <td>${escapeHTML(item.name)}</td>
                <td>${escapeHTML(item.location)}</td>
                <td>${escapeHTML(item.shift)}</td>
                <td>${escapeHTML(item.date)}</td>
                <td>${escapeHTML(item.status)}</td>
                <td>
                    <button class="btn-danger" onclick="deleteRecord('sauAssignments','${item.key}',renderAssignments)">Delete</button>
                </td>
            </tr>
        `;
    });

    if (getElement("assignmentEmptyMessage")) {
        getElement("assignmentEmptyMessage").style.display =
            filtered.length ? "none" : "block";
    }
}

if (assignmentForm) {
    assignmentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const staffId = getElement("assignmentStaffId").value;
        const person = getData("sauStaff").find(item => item.id === staffId);

        if (!person) {
            alert("Please select a valid staff member.");
            return;
        }

        const records = getData("sauAssignments");
        const editId = getElement("assignmentEditId").value;

        const record = {
            key: editId || makeId(),
            staffId: person.id,
            name: person.name,
            location: getElement("assignmentLocation").value,
            shift: getElement("assignmentShift").value,
            date: getElement("assignmentDate").value,
            status: getElement("assignmentStatus").value
        };

        if (editId) {
            const index = records.findIndex(item => item.key === editId);
            if (index !== -1) records[index] = record;
        } else {
            records.push(record);
        }

        saveData("sauAssignments", records);
        assignmentForm.reset();
        getElement("assignmentEditId").value = "";
        renderAssignments();
    });
}

getElement("assignmentSearch")?.addEventListener("input", renderAssignments);
getElement("assignmentStatusFilter")?.addEventListener("change", renderAssignments);

renderAssignments();

/* 10. COMMON DELETE FUNCTION */

function deleteRecord(storageKey, recordKey, renderFunction) {
    if (!confirm("Are you sure you want to delete this record?")) return;

    const records = getData(storageKey).filter(item => item.key !== recordKey);
    saveData(storageKey, records);
    renderFunction();
}

/* 11. SCHEDULE MANAGEMENT */

const scheduleForm = getElement("scheduleForm");

function renderSchedule() {
    const table = getElement("scheduleTableBody");
    if (!table) return;

    const records = getData("sauSchedules");
    const search = (getElement("scheduleSearch")?.value || "").toLowerCase();
    const date = getElement("scheduleDateFilter")?.value || "";

    const filtered = records.filter(item =>
        (item.name.toLowerCase().includes(search) ||
         item.staffId.toLowerCase().includes(search)) &&
        (!date || item.date === date)
    );

    table.innerHTML = "";

    filtered.forEach(item => {
        table.innerHTML += `
            <tr>
                <td>${escapeHTML(item.staffId)}</td>
                <td>${escapeHTML(item.name)}</td>
                <td>${escapeHTML(item.date)}</td>
                <td>${escapeHTML(item.shift)}</td>
                <td>${escapeHTML(item.start)}</td>
                <td>${escapeHTML(item.end)}</td>
                <td>
                    <button class="btn-danger" onclick="deleteRecord('sauSchedules','${item.key}',renderSchedule)">Delete</button>
                </td>
            </tr>
        `;
    });

    if (getElement("scheduleEmptyMessage")) {
        getElement("scheduleEmptyMessage").style.display =
            filtered.length ? "none" : "block";
    }
}

if (scheduleForm) {
    scheduleForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const staffId = getElement("scheduleStaffId").value;
        const person = getData("sauStaff").find(item => item.id === staffId);

        if (!person) {
            alert("Please select a valid staff member.");
            return;
        }

        const records = getData("sauSchedules");
        const editId = getElement("scheduleEditId").value;

        const record = {
            key: editId || makeId(),
            staffId: person.id,
            name: person.name,
            date: getElement("scheduleDate").value,
            shift: getElement("scheduleShift").value,
            start: getElement("scheduleStart").value,
            end: getElement("scheduleEnd").value
        };

        if (editId) {
            const index = records.findIndex(item => item.key === editId);
            if (index !== -1) records[index] = record;
        } else {
            records.push(record);
        }

        saveData("sauSchedules", records);
        scheduleForm.reset();
        getElement("scheduleEditId").value = "";
        renderSchedule();
    });
}

getElement("scheduleSearch")?.addEventListener("input", renderSchedule);
getElement("scheduleDateFilter")?.addEventListener("change", renderSchedule);

renderSchedule();

/* 12. LEAVE MANAGEMENT */

const leaveForm = getElement("leaveForm");

function renderLeaves() {
    const table = getElement("leaveTableBody");
    if (!table) return;

    const records = getData("sauLeaves");
    const search = (getElement("leaveSearch")?.value || "").toLowerCase();
    const filter = getElement("leaveStatusFilter")?.value || "";

    const filtered = records.filter(item =>
        (item.name.toLowerCase().includes(search) ||
         item.staffId.toLowerCase().includes(search)) &&
        (!filter || item.status === filter)
    );

    table.innerHTML = "";

    filtered.forEach(item => {
        table.innerHTML += `
            <tr>
                <td>${escapeHTML(item.staffId)}</td>
                <td>${escapeHTML(item.name)}</td>
                <td>${escapeHTML(item.start)}</td>
                <td>${escapeHTML(item.end)}</td>
                <td>${escapeHTML(item.reason)}</td>
                <td>${escapeHTML(item.status)}</td>
                <td>
                    <button class="btn-danger" onclick="deleteRecord('sauLeaves','${item.key}',renderLeaves)">Delete</button>
                </td>
            </tr>
        `;
    });

    if (getElement("leaveEmptyMessage")) {
        getElement("leaveEmptyMessage").style.display =
            filtered.length ? "none" : "block";
    }
}

if (leaveForm) {
    leaveForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const staffId = getElement("leaveStaffId").value;
        const person = getData("sauStaff").find(item => item.id === staffId);

        if (!person) {
            alert("Please select a valid staff member.");
            return;
        }

        const records = getData("sauLeaves");
        const editId = getElement("leaveEditId").value;

        const record = {
            key: editId || makeId(),
            staffId: person.id,
            name: person.name,
            start: getElement("leaveStart").value,
            end: getElement("leaveEnd").value,
            reason: getElement("leaveReason").value,
            status: getElement("leaveStatus").value
        };

        if (record.end < record.start) {
            alert("The leave end date cannot be before the start date.");
            return;
        }

        if (editId) {
            const index = records.findIndex(item => item.key === editId);
            if (index !== -1) records[index] = record;
        } else {
            records.push(record);
        }

        saveData("sauLeaves", records);
        leaveForm.reset();
        getElement("leaveEditId").value = "";
        renderLeaves();
    });
}

getElement("leaveSearch")?.addEventListener("input", renderLeaves);
getElement("leaveStatusFilter")?.addEventListener("change", renderLeaves);

renderLeaves();

/* 13. NOTICE MANAGEMENT */

const noticeForm = getElement("noticeForm");

function renderNotices() {
    const container = getElement("noticeContainer");
    if (!container) return;

    const notices = getData("sauNotices");
    const search = (getElement("noticeSearch")?.value || "").toLowerCase();

    const filtered = notices.filter(item =>
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search)
    );

    container.innerHTML = "";

    filtered.forEach(item => {
        container.innerHTML += `
            <div class="notice-card">
                <h3>${escapeHTML(item.title)}</h3>
                <p><strong>Category:</strong> ${escapeHTML(item.category)}</p>
                <p><strong>Date:</strong> ${escapeHTML(item.date)}</p>
                <p>${escapeHTML(item.description)}</p>
                <button class="btn-danger" onclick="deleteRecord('sauNotices','${item.key}',renderNotices)">Delete</button>
            </div>
        `;
    });

    if (getElement("noticeEmptyMessage")) {
        getElement("noticeEmptyMessage").style.display =
            filtered.length ? "none" : "block";
    }
}

if (noticeForm) {
    noticeForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const notices = getData("sauNotices");
        const editId = getElement("noticeEditId").value;

        const notice = {
            key: editId || makeId(),
            title: getElement("noticeTitle").value.trim(),
            category: getElement("noticeCategory").value,
            date: getElement("noticeDate").value,
            description: getElement("noticeDescription").value.trim()
        };

        if (editId) {
            const index = notices.findIndex(item => item.key === editId);
            if (index !== -1) notices[index] = notice;
        } else {
            notices.push(notice);
        }

        saveData("sauNotices", notices);
        noticeForm.reset();
        getElement("noticeEditId").value = "";
        renderNotices();
    });
}

getElement("noticeSearch")?.addEventListener("input", renderNotices);

renderNotices();

/* 14. ADMIN PROFILE */

const profileForm = getElement("profileForm");

if (profileForm) {
    const profile = JSON.parse(localStorage.getItem("sauAdminProfile"));

    if (profile) {
        getElement("adminProfileName").value = profile.name || "";
        getElement("adminProfileEmail").value = profile.email || "";
        getElement("adminProfilePhone").value = profile.phone || "";
    }

    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const updatedProfile = {
            name: getElement("adminProfileName").value,
            email: getElement("adminProfileEmail").value,
            phone: getElement("adminProfilePhone").value
        };

        localStorage.setItem(
            "sauAdminProfile",
            JSON.stringify(updatedProfile)
        );

        alert("Profile updated successfully!");
    });
}

/* 15. PASSWORD FORM - DEMO */

const passwordForm = getElement("passwordForm");

if (passwordForm) {
    passwordForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const oldPassword = getElement("oldPassword").value;
        const newPassword = getElement("newPassword").value;
        const confirmPassword = getElement("confirmPassword").value;

        if (!oldPassword || !newPassword || !confirmPassword) {
            showMessage("passwordMessage", "Fill in all password fields.", false);
            return;
        }

        if (newPassword.length < 8) {
            showMessage("passwordMessage", "Use at least 8 characters.", false);
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage("passwordMessage", "New passwords do not match.", false);
            return;
        }

        showMessage(
            "passwordMessage",
            "Demo only: connect a secure backend to change the real password."
        );

        passwordForm.reset();
    });
}

/* 16. REPORTS */

function generateReport() {
    const type = getElement("reportType")?.value || "staff";
    const date = getElement("reportDate")?.value || "";

    const head = getElement("reportTableHead");
    const body = getElement("reportTableBody");

    if (!head || !body) return;

    let records = [];
    let headings = [];
    let values = [];

    if (type === "staff") {
        records = getData("sauStaff");
        headings = ["Staff ID", "Name", "Phone", "Shift", "Status"];
        values = item => [
            item.id, item.name, item.phone, item.shift, item.status
        ];
    } else if (type === "attendance") {
        records = getData("sauAttendance");
        headings = ["Staff ID", "Name", "Date", "Status"];
        values = item => [
            item.staffId, item.name, item.date, item.status
        ];
    } else if (type === "assignments") {
        records = getData("sauAssignments");
        headings = ["Staff ID", "Name", "Location", "Shift", "Date", "Status"];
        values = item => [
            item.staffId, item.name, item.location,
            item.shift, item.date, item.status
        ];
    }

    if (date && type !== "staff") {
        records = records.filter(item => item.date === date);
    }

    head.innerHTML = `
        <tr>${headings.map(item => `<th>${item}</th>`).join("")}</tr>
    `;

    body.innerHTML = records.map(item => `
        <tr>
            ${values(item).map(value => `<td>${escapeHTML(value)}</td>`).join("")}
        </tr>
    `).join("");

    if (!records.length) {
        body.innerHTML = `
            <tr><td colspan="${headings.length}">No records found.</td></tr>
        `;
    }
}

getElement("generateReportBtn")?.addEventListener("click", generateReport);
getElement("printReportBtn")?.addEventListener("click", function () {
    window.print();
});

/* 17. DASHBOARD STATISTICS */

function updateDashboardStats() {
    const staff = getData("sauStaff");
    const attendance = getData("sauAttendance");
    const assignments = getData("sauAssignments");

    if (getElement("reportTotalStaff")) {
        getElement("reportTotalStaff").textContent = staff.length;
    }

    if (getElement("reportPresent")) {
        getElement("reportPresent").textContent =
            attendance.filter(item => item.status === "Present").length;
    }

    if (getElement("reportAbsent")) {
        getElement("reportAbsent").textContent =
            attendance.filter(item => item.status === "Absent").length;
    }

    if (getElement("reportAssignments")) {
        getElement("reportAssignments").textContent = assignments.length;
    }
}

updateDashboardStats();

/* 18. INITIALIZE REPORT IF PAGE IS OPEN */

if (getElement("reportTableBody")) {
    generateReport();
}

/* =================================
   PERSONNEL PROFILE
================================= */

function renderPersonnelProfilePage() {

    const profileId = sessionStorage.getItem("sauDemoUser");

    const message = document.getElementById("profileMessage");

    if (!profileId) {
        if (message) {
            message.textContent = "Please log in to view your profile.";
        }
        return;
    }

    const staffList = getData("sauStaff");

    const person = staffList.find(
        staff => staff.id === profileId
    );

    if (!person) {
        if (message) {
            message.textContent =
                "Your personnel record could not be found. Please contact the administrator.";
        }

        document.getElementById("profileName").textContent =
            "Profile Not Found";

        return;
    }

    document.getElementById("profileName").textContent =
        person.name || "--";

    document.getElementById("profileId").textContent =
        person.id || "--";

    document.getElementById("profileFullName").textContent =
        person.name || "--";

    document.getElementById("profilePhone").textContent =
        person.phone || "--";

    document.getElementById("profileEmail").textContent =
        person.email || "--";

    document.getElementById("profileShift").textContent =
        person.shift || "--";

    document.getElementById("profileStatus").textContent =
        person.status || "--";
}

if (document.getElementById("profileName")) {
    renderPersonnelProfilePage();
}

/* =================================
   PERSONNEL ATTENDANCE
================================= */

function renderPersonnelAttendance() {

    const staffId = sessionStorage.getItem("sauDemoUser");

    const table = document.getElementById("myAttendanceTable");
    const message = document.getElementById("myAttendanceMessage");

    if (!staffId) {
        if (message) {
            message.textContent = "Please log in to view your attendance.";
        }
        return;
    }

    const staffList = getData("sauStaff");

    const person = staffList.find(item => item.id === staffId);

    if (!person) {
        if (message) {
            message.textContent = "Personnel record not found.";
        }
        return;
    }

    // Get only this personnel member's attendance
    const records = getData("sauAttendance")
        .filter(item => item.staffId === staffId);

    // Update summary
    document.getElementById("myTotalAttendance").textContent =
        records.length;

    document.getElementById("myPresentCount").textContent =
        records.filter(item => item.status === "Present").length;

    document.getElementById("myAbsentCount").textContent =
        records.filter(item => item.status === "Absent").length;

    document.getElementById("myOtherCount").textContent =
        records.filter(item =>
            item.status !== "Present" && item.status !== "Absent"
        ).length;

    // Display attendance records
    function displayAttendance() {

        const selectedDate =
            document.getElementById("myAttendanceDate").value;

        const selectedStatus =
            document.getElementById("myAttendanceStatus").value;

        let filteredRecords = records.filter(item => {

            const matchesDate =
                !selectedDate || item.date === selectedDate;

            const matchesStatus =
                !selectedStatus || item.status === selectedStatus;

            return matchesDate && matchesStatus;

        });

        filteredRecords.sort((a, b) =>
            b.date.localeCompare(a.date)
        );

        if (filteredRecords.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="4">No attendance records found.</td>
                </tr>
            `;

            return;
        }

        table.innerHTML = filteredRecords.map(item => {

            let statusClass = "status-on-leave";

            if (item.status === "Present") {
                statusClass = "status-present";
            } else if (item.status === "Absent") {
                statusClass = "status-absent";
            } else if (item.status === "Late") {
                statusClass = "status-late";
            }

            return `
                <tr>
                    <td>${escapeHTML(item.staffId)}</td>
                    <td>${escapeHTML(item.name)}</td>
                    <td>${escapeHTML(item.date)}</td>
                    <td>
                        <span class="attendance-status ${statusClass}">
                            ${escapeHTML(item.status)}
                        </span>
                    </td>
                </tr>
            `;

        }).join("");

    }

    // Filter events
    document.getElementById("myAttendanceDate")
        .addEventListener("change", displayAttendance);

    document.getElementById("myAttendanceStatus")
        .addEventListener("change", displayAttendance);

    document.getElementById("clearAttendanceFilters")
        .addEventListener("click", function () {

            document.getElementById("myAttendanceDate").value = "";
            document.getElementById("myAttendanceStatus").value = "";

            displayAttendance();

        });

    displayAttendance();
}

// Run only on the attendance page
if (document.getElementById("myAttendanceTable")) {
    renderPersonnelAttendance();
}


/* =================================
   PERSONNEL DUTIES
================================= */

function renderPersonnelDuties() {

    const staffId = sessionStorage.getItem("sauDemoUser");

    const table = document.getElementById("myDutiesTable");
    const message = document.getElementById("myDutiesMessage");

    if (!staffId) {
        if (message) {
            message.textContent = "Please log in to view your duties.";
        }
        return;
    }

    const staffList = getData("sauStaff");

    const person = staffList.find(item => item.id === staffId);

    if (!person) {
        if (message) {
            message.textContent = "Personnel record not found.";
        }
        return;
    }

    // Get only this person's assignments
    const records = getData("sauAssignments")
        .filter(item => item.staffId === staffId);

    // Update summary
    document.getElementById("myTotalDuties").textContent =
        records.length;

    document.getElementById("myActiveDuties").textContent =
        records.filter(item => item.status === "Active").length;

    document.getElementById("myCompletedDuties").textContent =
        records.filter(item => item.status === "Completed").length;

    const locations = new Set(
        records.map(item => item.location).filter(Boolean)
    );

    document.getElementById("myDutyLocations").textContent =
        locations.size;

    // Display assignments
    function displayDuties() {

        const selectedDate =
            document.getElementById("myDutyDate").value;

        const selectedStatus =
            document.getElementById("myDutyStatus").value;

        let filteredRecords = records.filter(item => {

            const matchesDate =
                !selectedDate || item.date === selectedDate;

            const matchesStatus =
                !selectedStatus || item.status === selectedStatus;

            return matchesDate && matchesStatus;

        });

        filteredRecords.sort((a, b) =>
            b.date.localeCompare(a.date)
        );

        if (filteredRecords.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="4">No duty assignments found.</td>
                </tr>
            `;

            return;
        }

        table.innerHTML = filteredRecords.map(item => {

            let statusClass = "duty-assigned";

            if (item.status === "Active") {
                statusClass = "duty-active";
            } else if (item.status === "Completed") {
                statusClass = "duty-completed";
            }

            return `
                <tr>
                    <td>${escapeHTML(item.location)}</td>
                    <td>${escapeHTML(item.shift)}</td>
                    <td>${escapeHTML(item.date)}</td>
                    <td>
                        <span class="duty-status ${statusClass}">
                            ${escapeHTML(item.status)}
                        </span>
                    </td>
                </tr>
            `;

        }).join("");

    }

    // Filter events
    document.getElementById("myDutyDate")
        .addEventListener("change", displayDuties);

    document.getElementById("myDutyStatus")
        .addEventListener("change", displayDuties);

    document.getElementById("clearDutyFilters")
        .addEventListener("click", function () {

            document.getElementById("myDutyDate").value = "";
            document.getElementById("myDutyStatus").value = "";

            displayDuties();

        });

    displayDuties();
}

// Run only on the duties page
if (document.getElementById("myDutiesTable")) {
    renderPersonnelDuties();
}

/* =================================
   PERSONNEL SCHEDULE
================================= */

function renderPersonnelSchedule() {

    const staffId = sessionStorage.getItem("sauDemoUser");

    const table = document.getElementById("personnelScheduleTable");
    const message = document.getElementById("personnelScheduleMessage");

    if (!staffId) {
        message.textContent = "Please log in to view your schedule.";
        return;
    }

    const person = getData("sauStaff").find(
        item => item.id === staffId
    );

    if (!person) {
        message.textContent = "Personnel record not found.";
        return;
    }

    // Get this person's schedules only
    const records = getData("sauSchedules")
        .filter(item => item.staffId === staffId);

    const today = new Date().toLocaleDateString("en-CA");

    // Summary statistics
    document.getElementById("myScheduleTotal").textContent =
        records.length;

    document.getElementById("myUpcomingShifts").textContent =
        records.filter(item => item.date >= today).length;

    document.getElementById("myMorningShifts").textContent =
        records.filter(item =>
            item.shift.toLowerCase() === "morning"
        ).length;

    document.getElementById("myEveningShifts").textContent =
        records.filter(item =>
            item.shift.toLowerCase() === "evening"
        ).length;

    // Display schedules
    function displaySchedule() {

        const selectedDate =
            document.getElementById("personnelScheduleDate").value;

        const selectedShift =
            document.getElementById("personnelScheduleShift").value;

        let filteredRecords = records.filter(item => {

            const matchesDate =
                !selectedDate || item.date === selectedDate;

            const matchesShift =
                !selectedShift || item.shift === selectedShift;

            return matchesDate && matchesShift;

        });

        filteredRecords.sort((a, b) =>
            a.date.localeCompare(b.date)
        );

        if (filteredRecords.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="4">No schedule records found.</td>
                </tr>
            `;

            return;
        }

        table.innerHTML = filteredRecords.map(item => `
            <tr>
                <td>${escapeHTML(item.date)}</td>
                <td>${escapeHTML(item.shift)}</td>
                <td>${escapeHTML(item.start)}</td>
                <td>${escapeHTML(item.end)}</td>
            </tr>
        `).join("");

    }

    // Filter events
    document.getElementById("personnelScheduleDate")
        .addEventListener("change", displaySchedule);

    document.getElementById("personnelScheduleShift")
        .addEventListener("change", displaySchedule);

    document.getElementById("clearScheduleFilters")
        .addEventListener("click", function () {

            document.getElementById("personnelScheduleDate").value = "";
            document.getElementById("personnelScheduleShift").value = "";

            displaySchedule();

        });

    displaySchedule();
}

// Run only on personnel schedule page
if (document.getElementById("personnelScheduleTable")) {
    renderPersonnelSchedule();
}

/* =================================
   PERSONNEL LEAVE MANAGEMENT
================================= */

function renderPersonnelLeaves() {

    const staffId = sessionStorage.getItem("sauDemoUser");

    const table = document.getElementById("personnelLeaveTable");
    const form = document.getElementById("personnelLeaveForm");
    const message = document.getElementById("personnelLeaveMessage");

    if (!staffId) {
        message.textContent = "Please log in to continue.";
        return;
    }

    const staffList = getData("sauStaff");

    const person = staffList.find(item => item.id === staffId);

    if (!person) {
        message.textContent = "Personnel record not found.";
        return;
    }

    // Display only this person's requests
    function displayPersonnelLeaves() {

        const leaves = getData("sauLeaves")
            .filter(item => item.staffId === staffId);

        document.getElementById("personnelTotalLeaves").textContent =
            leaves.length;

        document.getElementById("personnelPendingLeaves").textContent =
            leaves.filter(item => item.status === "Pending").length;

        document.getElementById("personnelApprovedLeaves").textContent =
            leaves.filter(item => item.status === "Approved").length;

        document.getElementById("personnelRejectedLeaves").textContent =
            leaves.filter(item => item.status === "Rejected").length;

        if (leaves.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="4">No leave requests submitted yet.</td>
                </tr>
            `;
            return;
        }

        table.innerHTML = leaves.slice().reverse().map(item => {

            let statusClass = "leave-pending";

            if (item.status === "Approved") {
                statusClass = "leave-approved";
            } else if (item.status === "Rejected") {
                statusClass = "leave-rejected";
            }

            return `
                <tr>
                    <td>${escapeHTML(item.start)}</td>
                    <td>${escapeHTML(item.end)}</td>
                    <td>${escapeHTML(item.reason)}</td>
                    <td>
                        <span class="leave-status ${statusClass}">
                            ${escapeHTML(item.status)}
                        </span>
                    </td>
                </tr>
            `;

        }).join("");
    }

    // Submit a new leave request
    form.addEventListener("submit", function(event) {

        event.preventDefault();

        const start = document.getElementById("personnelLeaveStart").value;
        const end = document.getElementById("personnelLeaveEnd").value;
        const reason = document.getElementById("personnelLeaveReason").value.trim();

        if (!start || !end || !reason) {
            message.textContent = "Please fill in all the fields.";
            return;
        }

        if (end < start) {
            message.textContent = "End date cannot be before start date.";
            return;
        }

        const leaves = getData("sauLeaves");

        const newLeave = {
            key: makeId(),
            staffId: person.id,
            name: person.name,
            start: start,
            end: end,
            reason: reason,
            status: "Pending"
        };

        leaves.push(newLeave);

        saveData("sauLeaves", leaves);

        message.textContent = "Leave request submitted successfully!";
        message.style.color = "green";

        form.reset();

        displayPersonnelLeaves();

    });

    displayPersonnelLeaves();
}

// Run only on the personnel leave page
if (document.getElementById("personnelLeaveForm")) {
    renderPersonnelLeaves();
}

// =================================
// PERSONNEL NOTICES
// =================================

function renderPersonnelNotices() {

    const container = document.getElementById(
        "personnelNoticeContainer"
    );

    const searchInput = document.getElementById(
        "personnelNoticeSearch"
    );

    const message = document.getElementById(
        "personnelNoticeMessage"
    );

    const notices = getData("sauNotices");

    // Sort newest first
    notices.sort((a, b) =>
        (b.date || "").localeCompare(a.date || "")
    );

    // Update summary
    document.getElementById("personnelNoticeCount").textContent =
        notices.length;

    document.getElementById("personnelLatestNotice").textContent =
        notices.length ? notices[0].date : "--";

    // Display notices
    function displayNotices() {

        const searchText = searchInput.value
            .trim()
            .toLowerCase();

        const filtered = notices.filter(item => {

            const title = (item.title || "").toLowerCase();
            const category = (item.category || "").toLowerCase();
            const description = (item.description || "").toLowerCase();

            return title.includes(searchText) ||
                   category.includes(searchText) ||
                   description.includes(searchText);
        });

        if (filtered.length === 0) {

            container.innerHTML = `
                <p>No notices found.</p>
            `;

            return;
        }

        container.innerHTML = filtered.map(item => `
            <article class="personnel-notice-card">

                <h3>${escapeHTML(item.title)}</h3>

                <span class="personnel-notice-category">
                    ${escapeHTML(item.category)}
                </span>

                <p>
                    <strong>Published:</strong>
                    ${escapeHTML(item.date)}
                </p>

                <p>${escapeHTML(item.description)}</p>

            </article>
        `).join("");
    }

    searchInput.addEventListener("input", displayNotices);

    displayNotices();
}

// Run only on personnel notices page
if (document.getElementById("personnelNoticeContainer")) {
    renderPersonnelNotices();
}
