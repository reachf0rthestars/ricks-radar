import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { auth, db } from "../firebase-config.js";
import { createDeal } from "../deals-service.js";
import { initSideMenu } from "../shared/menu.js";
import { setStatusMessage } from "../shared/messages.js";

const form = document.getElementById("add-deal-form");
const titleInput = document.getElementById("deal-title");
const discountInput = document.getElementById("deal-discount");
const descriptionInput = document.getElementById("deal-description");
const categoriesInput = document.getElementById("selected-categories");
const locationInput = document.getElementById("deal-location");
const timeInput = document.getElementById("deal-time");
const expirationInput = document.getElementById("expiration-date");
const imageInput = document.getElementById("deal-image");
const messageEl = document.getElementById("add-deal-message");
const submitBtn = document.getElementById("submit-deal-btn");

let currentUser = null;
let currentProfile = null;

function initCategorySelection() {
  const categoryButtons = document.querySelectorAll(".categories .category");
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

      categoriesInput.value = Array.from(selected).join(",");
    });
  });
}

function initExpirationDateMin() {
  if (!expirationInput) {
    return;
  }

  expirationInput.min = new Date().toISOString().split("T")[0];
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? "Submitting..." : "Submit Deal";
}

function collectFormDealInput() {
  return {
    title: titleInput.value.trim(),
    discountText: discountInput.value.trim(),
    description: descriptionInput.value.trim(),
    categories: categoriesInput.value
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    location: locationInput.value.trim(),
    timeText: timeInput.value.trim(),
    expirationDate: expirationInput.value
  };
}

async function ensureProfile(user) {
  const profileDoc = await getDoc(doc(db, "users", user.uid));
  return profileDoc.exists() ? profileDoc.data() : null;
}

function validateDealInput(dealInput) {
  if (!dealInput.title || !dealInput.discountText || !dealInput.description || !dealInput.location || !dealInput.timeText) {
    return "Please complete all required fields.";
  }

  if (!dealInput.expirationDate) {
    return "Please choose an expiration date.";
  }

  if ((dealInput.categories || []).length === 0) {
    return "Please select at least one category.";
  }

  return "";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentUser || !currentProfile) {
    window.location.href = "login.html";
    return;
  }

  const dealInput = collectFormDealInput();
  const validationMessage = validateDealInput(dealInput);
  if (validationMessage) {
    setStatusMessage(messageEl, validationMessage);
    return;
  }

  setLoading(true);
  setStatusMessage(messageEl, "Posting your deal...", "info");

  try {
    await createDeal({
      user: currentUser,
      profile: currentProfile,
      dealInput,
      imageFile: imageInput.files[0] || null
    });

    setStatusMessage(messageEl, "Deal posted successfully. Redirecting...", "success");
    form.reset();
    categoriesInput.value = "";
    window.location.href = "account.html";
  } catch (error) {
    console.error("Unable to create deal.", error);
    setStatusMessage(messageEl, error?.message || "Unable to post deal. Please try again.");
  } finally {
    setLoading(false);
  }
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    currentProfile = await ensureProfile(user);
    if (!currentProfile) {
      window.location.href = "createaccount.html";
      return;
    }
    currentUser = user;
  } catch (error) {
    console.error("Unable to load account profile for deal creation.", error);
    setStatusMessage(messageEl, "Unable to load your profile. Refresh and try again.");
  }
});

initSideMenu();
initCategorySelection();
initExpirationDateMin();
