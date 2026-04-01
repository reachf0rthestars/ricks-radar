import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { auth, db } from "../firebase-config.js";
import { createDeal } from "../deals-service.js";
import { initSideMenu } from "../shared/menu.js";
import { setStatusMessage } from "../shared/messages.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const form = document.getElementById("add-deal-form");
const categoryButtons = document.querySelectorAll(".categories .category");
const hiddenCategoriesInput = document.getElementById("selected-categories");
const expirationDateInput = document.getElementById("expiration-date");
const messageEl = document.getElementById("add-deal-message");
const submitBtn = document.getElementById("submit-deal-btn");
const imageInput = document.getElementById("deal-image");

let currentUser = null;
let currentProfile = null;
const selectedCategories = new Set();

function initCategorySelection() {
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.value;
      if (!value) {
        return;
      }

      if (selectedCategories.has(value)) {
        selectedCategories.delete(value);
        button.classList.remove("active");
      } else {
        selectedCategories.add(value);
        button.classList.add("active");
      }

      hiddenCategoriesInput.value = Array.from(selectedCategories).join(",");
    });
  });
}

function initExpirationDateMin() {
  if (!expirationDateInput) {
    return;
  }

  expirationDateInput.min = new Date().toISOString().split("T")[0];
}

function setSubmitLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? "Submitting..." : "Submit Deal";
}

function clearCategorySelection() {
  selectedCategories.clear();
  hiddenCategoriesInput.value = "";
  categoryButtons.forEach((button) => button.classList.remove("active"));
}

function getDealFormPayload() {
  const formData = new FormData(form);

  return {
    title: String(formData.get("title") || "").trim(),
    discountText: String(formData.get("discountText") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    categories: hiddenCategoriesInput.value
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    location: String(formData.get("location") || "").trim(),
    timeInfo: String(formData.get("timeInfo") || "").trim(),
    expirationDate: String(formData.get("expirationDate") || "").trim()
  };
}

function validateDealInput(dealInput) {
  if (!dealInput.title || !dealInput.discountText || !dealInput.description) {
    return "Please complete all required text fields.";
  }

  if (!dealInput.location || !dealInput.timeInfo || !dealInput.expirationDate) {
    return "Location, time details, and expiration date are required.";
  }

  if (dealInput.categories.length === 0) {
    return "Select at least one category.";
  }

  return "";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentUser || !currentProfile) {
    setStatusMessage(messageEl, "You must be signed in before adding a deal.");
    return;
  }

  const dealInput = getDealFormPayload();
  const validationMessage = validateDealInput(dealInput);

  if (validationMessage) {
    setStatusMessage(messageEl, validationMessage);
    return;
  }

  setSubmitLoading(true);
  setStatusMessage(messageEl, "Saving your deal...", "info");

  try {
    await createDeal({
      user: currentUser,
      profile: currentProfile,
      dealInput,
      imageFile: imageInput.files[0] || null
    });

    setStatusMessage(messageEl, "Deal posted successfully.", "success");
    form.reset();
    clearCategorySelection();
    initExpirationDateMin();
  } catch (error) {
    console.error("Unable to create deal.", error);
    setStatusMessage(messageEl, error?.message || "Unable to save this deal right now.");
  } finally {
    setSubmitLoading(false);
  }
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    const profileDoc = await getDoc(doc(db, "users", user.uid));
    if (!profileDoc.exists()) {
      window.location.href = "createaccount.html";
      return;
    }

    currentUser = user;
    currentProfile = profileDoc.data();
  } catch (error) {
    console.error("Unable to load account state for deal form.", error);
    setStatusMessage(messageEl, "Unable to verify your account right now.");
  }

  document.body.style.visibility = "visible";
});

document.body.style.visibility = "hidden";
initSideMenu({ topRightMode: "logout" });
initCategorySelection();
initExpirationDateMin();
