import { initSideMenu } from "../shared/menu.js";

function initCategorySelection() {
  const categoryButtons = document.querySelectorAll(".categories .category");
  const hiddenInput = document.getElementById("selected-categories");
  const selected = new Set();

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.value;
      if (!value) {
        return;
      }

      if (selected.has(value)) {
        selected.delete(value);
        button.classList.remove("active");
      } else {
        selected.add(value);
        button.classList.add("active");
      }

      hiddenInput.value = Array.from(selected).join(",");
    });
  });
}

function initExpirationDateMin() {
  const dateInput = document.getElementById("expiration-date");
  if (!dateInput) {
    return;
  }

  dateInput.min = new Date().toISOString().split("T")[0];
}

initSideMenu();
initCategorySelection();
initExpirationDateMin();