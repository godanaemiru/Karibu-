const API = "http://localhost:5000/api";

// 1. ADDED 'event' parameter to stop form refresh
async function login(event) {
  event.preventDefault(); 
  
  const name = document.getElementById("name").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

// 2. ADDED 'event' parameter here too
async function recordSale(event) {
  event.preventDefault();

  const produceName = document.getElementById("produce").value;
  const tonnage = document.getElementById("tonnage").value;
  const amountPaid = document.getElementById("amount").value;
  const buyerName = document.getElementById("buyer").value;

  try {
    const res = await fetch(`${API}/sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ produceName, tonnage, amountPaid, buyerName })
    });

    const data = await res.json();
    showToast("Sale recorded successfully"); // Moved inside the function
    
    // Optional: Refresh the dashboard data after sale
    // loadDirectorDashboard(); 
  } catch (err) {
    console.error(err);
    alert("Failed to record sale");
  }
}

async function loadDirectorDashboard() {
  const res = await fetch(`${API}/reports/summary`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const data = await res.json();

  const labels = data.sales.map(s => s._id);
  const values = data.sales.map(s => s.totalRevenue);

  new Chart(document.getElementById("salesChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Revenue per Branch",
        data: values
      }]
    }
  });
}

function showSection(sectionId) {
  const sections = ["dashboardSection","salesSection","procurementSection","creditSection","reportsSection"];
  sections.forEach(sec => {
    const el = document.getElementById(sec);
    if(el) el.style.display = "none";
  });

  const target = document.getElementById(sectionId);
  if (target) target.style.display = "block";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// Decode JWT to get role
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

// 3. CRITICAL FIX: LOGIC TO PREVENT INFINITE LOOP
window.onload = function () {
  const token = localStorage.getItem("token");
  const currentPage = window.location.pathname;

  // If no token AND we are NOT on the login page, redirect to login
  if (!token && !currentPage.includes("login.html")) {
    window.location.href = "login.html";
    return;
  }

  // If we ARE on the login page, stop here so dashboard logic doesn't run
  if (currentPage.includes("login.html")) {
    return;
  }

  // --- DASHBOARD LOGIC STARTS HERE ---
  const user = parseJwt(token);
  
  if (!user) {
    logout(); // Token invalid
    return;
  }

  // Check if elements exist before accessing them (prevents errors on partial pages)
  if(document.getElementById("userRole")) document.getElementById("userRole").innerText = user.role;
  if(document.getElementById("branchName")) document.getElementById("branchName").innerText = user.branch || "All Branches";

  // Hide menus based on role
  if (user.role !== "manager" && document.getElementById("managerMenu")) {
    document.getElementById("managerMenu").style.display = "none";
  }

  if (user.role !== "director" && document.getElementById("directorMenu")) {
    document.getElementById("directorMenu").style.display = "none";
  }
};

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("content");
  if(sidebar) sidebar.classList.toggle("collapsed");
  if(content) content.classList.toggle("expanded");
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function showToast(message) {
  const toastText = document.getElementById("toastText");
  const toastEl = document.getElementById("toastMsg");
  
  if (toastText && toastEl) {
    toastText.innerText = message;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  } else {
    alert(message); // Fallback if toast HTML is missing
  }
}

function animateCounter(id, value) {
  let count = 0;
  const element = document.getElementById(id);
  if (!element) return;

  const interval = setInterval(() => {
    count += Math.ceil(value / 30);
    if (count >= value) {
      count = value;
      clearInterval(interval);
    }
    element.innerText = count.toLocaleString();
  }, 30);
}

function exportTableToCSV(tableId) {
  let csv = [];
  let rows = document.querySelectorAll(`#${tableId} tr`);

  rows.forEach(row => {
    let cols = row.querySelectorAll("td, th");
    let rowData = [];
    cols.forEach(col => rowData.push(col.innerText));
    csv.push(rowData.join(","));
  });

  let blob = new Blob([csv.join("\n")], { type: "text/csv" });
  let url = window.URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "report.csv";
  a.click();
}