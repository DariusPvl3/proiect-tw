const menu_toggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");

menu_toggle.addEventListener("click", () => {
  menu_toggle.classList.toggle("is-active");
  sidebar.classList.toggle("is-active");
});

const imageFolderPath = "../Images/";

function renderDoctors(doctors, searchQuery = "") {
  // Get the current active page
  const activePage = document
    .querySelector(".menu-item.active")
    .getAttribute("data-page");

  // Check if the current active page is "Appointments"
  if (activePage !== "appointments") {
    // If not "Appointments," do nothing and return
    return;
  }

  doctors.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );

  const doctorsContainer = document.querySelector(".doctors-container");

  // Check if doctorsContainer is null before proceeding
  if (!doctorsContainer) {
    console.error("Error: doctorsContainer is null");
    return;
  }

  // Clear existing content in the container
  doctorsContainer.innerHTML = "";

  doctors.forEach((doctor) => {
    // Check if the doctor's name or specialization includes the search query
    if (
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      const doctorElement = document.createElement("div");
      doctorElement.classList.add("doctors-container-element");

      const doctorImage = document.createElement("img");
      doctorImage.src = imageFolderPath + doctor.image;
      doctorImage.alt = doctor.name;
      doctorElement.appendChild(doctorImage);

      const doctorName = document.createElement("h3");
      doctorName.textContent = doctor.name;
      doctorElement.appendChild(doctorName);

      const doctorSpecialization = document.createElement("p");
      doctorSpecialization.textContent = doctor.specialization;
      doctorElement.appendChild(doctorSpecialization);

      doctorsContainer.appendChild(doctorElement);
    }
  });
}

async function fetchAndRenderDoctors(searchQuery = "") {
  try {
    const response = await fetch("/api/doctors");
    const doctors = await response.json();
    renderDoctors(doctors, searchQuery);
  } catch (error) {
    console.error("Error fetching doctors:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach((menuItem) => {
    const page = menuItem.getAttribute("data-page");

    // Only add click event listener for links that should load dynamically
    if (page !== "logout") {
      menuItem.addEventListener("click", async (event) => {
        event.preventDefault();
        loadPage(page);
      });
    }
  });

  const currentPath = window.location.pathname.split("/").pop();
  const defaultPage = currentPath || "home";
  setActiveLink(defaultPage);

  // Trigger the initial load when the page is refreshed
  loadPage(defaultPage);
});

// Add a separate event listener for the logout link
const logoutLink = document.querySelector(".menu-item[data-page='logout']");
logoutLink.addEventListener("click", () => {
  // Simply follow the logout link without preventing the default behavior
  window.location.href = logoutLink.getAttribute("href");
});

function setActiveLink(page) {
  const activeClass = "active";
  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach((menuItem) => {
    const menuItemPage = menuItem.getAttribute("data-page");
    if (menuItemPage === page) {
      menuItem.classList.add(activeClass);
    } else {
      menuItem.classList.remove(activeClass);
    }
  });
}

async function loadPage(page) {
  try {
    // Fetch the content for the specified page
    const response = await fetch(`/patient/${page}`);
    const pageContent = await response.text();

    // Replace the content in the .main-content container
    document.querySelector(".main-content").innerHTML = pageContent;

    // Set the active link when a new page is loaded
    setActiveLink(page);

    // Re-fetch and render doctors for "appointments" page
    if (page === "appointments") {
      await fetchAndRenderDoctors();

      // Add an event listener for the search input if it exists
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        searchInput.addEventListener("input", () => {
          const searchQuery = searchInput.value.trim();
          fetchAndRenderDoctors(searchQuery);
        });

        const clearSearchIcon = document.getElementById("clearSearch");
        if (clearSearchIcon) {
          clearSearchIcon.addEventListener("click", () => {
            searchInput.value = ""; // Clear the search input
            fetchAndRenderDoctors(); // Fetch and render doctors with an empty search query
          });
        }
      }
    }
  } catch (error) {
    console.error("Error loading page:", error);
  }
}
