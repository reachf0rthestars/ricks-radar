import { listDeals } from "../deals-service.js";
import { createDealCardElement } from "../shared/deal-card-ui.js";
import { initSideMenu } from "../shared/menu.js";

const dealsContainer = document.getElementById("home-deals-list");
const emptyMessageEl = document.getElementById("home-deals-empty");
const filtersContainer = document.querySelector(".filters");
const mainFilterButton = filtersContainer?.querySelector(".pill--primary");
const filterButtons = filtersContainer?.querySelectorAll("button:not(.pill--primary)") || [];
const activeFilters = new Set();
let allDeals = [];

function getFilterClass(button) {
  return Array.from(button.classList).find((className) => className !== "pill");
}

function hasCategoryMatch(deal, filterClass) {
  return (deal.categories || []).includes(filterClass);
}

function filteredDeals() {
  if (activeFilters.size === 0) {
    return allDeals;
  }

  return allDeals.filter((deal) =>
    Array.from(activeFilters).some((filterClass) => hasCategoryMatch(deal, filterClass))
  );
}

function renderDeals() {
  const dealsToRender = filteredDeals();
  dealsContainer.textContent = "";

  if (dealsToRender.length === 0) {
    emptyMessageEl.style.display = "";
    return;
  }

  emptyMessageEl.style.display = "none";

  const fragment = document.createDocumentFragment();
  dealsToRender.forEach((deal) => {
    const card = createDealCardElement(deal, {
      onOpenProfile: (uid) => {
        if (!uid) {
          return;
        }
        window.location.href = `account.html?uid=${encodeURIComponent(uid)}`;
      }
    });
    fragment.appendChild(card);
  });

  dealsContainer.appendChild(fragment);
}

function initFilters() {
  if (!filtersContainer || !mainFilterButton) {
    return;
  }

  mainFilterButton.addEventListener("click", () => {
    filtersContainer.classList.toggle("show-filters");
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filterClass = getFilterClass(button);
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

      renderDeals();
    });
  });
}

async function loadDeals() {
  try {
    allDeals = await listDeals();
    renderDeals();
  } catch (error) {
    console.error("Unable to load deals.", error);
    emptyMessageEl.textContent = "Unable to load deals right now.";
    emptyMessageEl.style.display = "";
  }
}

initSideMenu();
initFilters();
loadDeals();
