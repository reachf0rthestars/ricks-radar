import { initSideMenu } from "../shared/menu.js";

function initFilters() {
  const filtersContainer = document.querySelector(".filters");
  if (!filtersContainer) {
    return;
  }

  const mainButton = filtersContainer.querySelector(".pill--primary");
  const filterButtons = filtersContainer.querySelectorAll("button:not(.pill--primary)");
  const activeFilters = new Set();

  const applyFilters = () => {
    const cards = document.querySelectorAll(".deal-card");
    cards.forEach((card) => {
      if (activeFilters.size === 0) {
        card.style.display = "";
        return;
      }

      const hasMatch = Array.from(activeFilters).some((filter) => card.querySelector(`.${filter}`));
      card.style.display = hasMatch ? "" : "none";
    });
  };

  mainButton.addEventListener("click", () => {
    filtersContainer.classList.toggle("show-filters");
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filterClass = Array.from(button.classList).find((className) => className !== "pill");
      if (!filterClass) {
        return;
      }

      if (activeFilters.has(filterClass)) {
        activeFilters.delete(filterClass);
        button.classList.remove("active");
      } else {
        activeFilters.add(filterClass);
        button.classList.add("active");
      }

      applyFilters();
    });
  });
}

function initVoteBadges() {
  document.querySelectorAll(".badge").forEach((badge) => {
    badge.addEventListener("click", () => {
      badge.classList.toggle("active");
    });
  });
}

initSideMenu();
initFilters();
initVoteBadges();
