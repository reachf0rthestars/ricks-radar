import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { doc, serverTimestamp, updateDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { getDownloadURL, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";
import { auth, db, storage } from "../firebase-config.js";
import { deleteDeal, getPublicProfileByUid, listDealsByUser } from "../deals-service.js";
import { createDealCardElement } from "../shared/deal-card-ui.js";
import { DEFAULT_AVATAR, emitProfileUpdated, getDisplayName, getProfileImage } from "../shared/auth-profile.js";
import { initSideMenu } from "../shared/menu.js";
import { setStatusMessage } from "../shared/messages.js";

const avatarEl = document.querySelector(".profile-avatar");
const nameEl = document.querySelector(".profile-name");
const bioEl = document.querySelector(".profile-bio");
const statValueEls = document.querySelectorAll(".profile-stats strong");
const editProfileBtn = document.getElementById("edit-profile-btn");
const editForm = document.getElementById("edit-profile-form");
const editBioInput = document.getElementById("edit-bio");
const editProfileImageInput = document.getElementById("edit-profile-image");
const cancelEditBtn = document.getElementById("cancel-profile-btn");
const saveProfileBtn = document.getElementById("save-profile-btn");
const editMessageEl = document.getElementById("edit-profile-message");
const dealsTitleEl = document.getElementById("deals-section-title");
const dealsListEl = document.getElementById("account-deals-list");
const dealsEmptyEl = document.getElementById("account-deals-empty");
const pageMessageEl = document.getElementById("account-page-message");

let currentUser = null;
let currentProfile = null;
let viewedProfile = null;
let viewedUid = "";
let isOwnerView = false;
let viewedDeals = [];

function toSafeCount(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDealsTitle(profile, ownerMode) {
  if (ownerMode) {
    return "Your Deals";
  }

  const displayName = profile?.username || profile?.displayName || "User";
  return `${displayName}'s Deals`;
}

function updateProfileUI(user, profile = {}) {
  const displayName = getDisplayName(user, profile);
  const bio = profile.bio || "No bio has been added yet.";
  const profileImage = getProfileImage(user, profile, DEFAULT_AVATAR);

  nameEl.textContent = displayName;
  bioEl.textContent = bio;
  avatarEl.src = profileImage;
  dealsTitleEl.textContent = formatDealsTitle(profile, isOwnerView);

  const values = [
    toSafeCount(profile.dealsPosted),
    toSafeCount(profile.likes),
    toSafeCount(profile.followers),
    toSafeCount(profile.savedDeals)
  ];

  values.forEach((value, index) => {
    if (statValueEls[index]) {
      statValueEls[index].textContent = String(value);
    }
  });
}

function setEditFormVisibility(isVisible) {
  editForm.style.display = isVisible && isOwnerView ? "grid" : "none";
  editProfileBtn.textContent = isVisible ? "Close Edit" : "Edit Profile";
}

function setEditControlsVisibility() {
  editProfileBtn.style.display = isOwnerView ? "" : "none";
  if (!isOwnerView) {
    setEditFormVisibility(false);
  }
}

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function setEditLoading(isLoading) {
  saveProfileBtn.disabled = isLoading;
  cancelEditBtn.disabled = isLoading;
  editProfileBtn.disabled = isLoading;
  saveProfileBtn.textContent = isLoading ? "Saving..." : "Save Changes";
}

function populateEditForm(profile = {}) {
  editBioInput.value = profile.bio || "";
  editProfileImageInput.value = "";
}

async function uploadProfileImageIfNeeded(user) {
  const file = editProfileImageInput.files[0];
  if (!file) {
    return currentProfile?.profileImage || user.photoURL || "";
  }

  const safeFileName = sanitizeFileName(file.name);
  const imageRef = ref(storage, `profileImages/${user.uid}/${Date.now()}-${safeFileName}`);
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}

async function saveProfileChanges(event) {
  event.preventDefault();

  if (!isOwnerView || !currentUser || !currentProfile) {
    setStatusMessage(editMessageEl, "You can only edit your own profile.");
    return;
  }

  const bio = editBioInput.value.trim();
  if (!bio) {
    setStatusMessage(editMessageEl, "Bio cannot be empty.");
    return;
  }

  setEditLoading(true);
  setStatusMessage(editMessageEl, "Saving profile changes...", "info");

  try {
    const profileImage = await uploadProfileImageIfNeeded(currentUser);
    await updateDoc(doc(db, "users", currentUser.uid), {
      bio,
      profileImage,
      updatedAt: serverTimestamp()
    });

    currentProfile = {
      ...currentProfile,
      bio,
      profileImage
    };
    viewedProfile = {
      ...viewedProfile,
      bio,
      profileImage
    };

    updateProfileUI(currentUser, currentProfile);
    emitProfileUpdated(currentProfile);
    setStatusMessage(editMessageEl, "Profile updated successfully.", "success");
    setEditFormVisibility(false);
  } catch (error) {
    console.error("Unable to save profile changes.", error);
    setStatusMessage(editMessageEl, error?.message || "Unable to save profile changes.");
  } finally {
    setEditLoading(false);
  }
}

function renderDeals() {
  dealsListEl.textContent = "";

  if (viewedDeals.length === 0) {
    dealsEmptyEl.style.display = "";
    return;
  }

  dealsEmptyEl.style.display = "none";

  const fragment = document.createDocumentFragment();
  viewedDeals.forEach((deal) => {
    const card = createDealCardElement(deal, {
      showDelete: isOwnerView,
      onOpenProfile: (uid) => {
        if (!uid) {
          return;
        }
        window.location.href = `account.html?uid=${encodeURIComponent(uid)}`;
      },
      onDelete: async (dealToDelete) => {
        if (!currentUser) {
          window.location.href = "login.html";
          return;
        }

        const isConfirmed = window.confirm("Delete this deal?");
        if (!isConfirmed) {
          return;
        }

        try {
          await deleteDeal(dealToDelete.id, currentUser.uid);
          viewedDeals = viewedDeals.filter((item) => item.id !== dealToDelete.id);
          if (currentProfile) {
            currentProfile.dealsPosted = Math.max(0, toSafeCount(currentProfile.dealsPosted) - 1);
            viewedProfile.dealsPosted = currentProfile.dealsPosted;
            updateProfileUI(currentUser, currentProfile);
          }
          renderDeals();
          setStatusMessage(pageMessageEl, "Deal deleted.", "success");
        } catch (error) {
          console.error("Unable to delete deal.", error);
          setStatusMessage(pageMessageEl, error?.message || "Unable to delete deal.");
        }
      }
    });
    fragment.appendChild(card);
  });

  dealsListEl.appendChild(fragment);
}

async function loadViewedDeals() {
  try {
    viewedDeals = await listDealsByUser(viewedUid);
    renderDeals();
  } catch (error) {
    console.error("Unable to load profile deals.", error);
    dealsEmptyEl.textContent = "Unable to load posted deals right now.";
    dealsEmptyEl.style.display = "";
  }
}

async function loadAccountPageState(user) {
  const uidFromQuery = new URLSearchParams(window.location.search).get("uid");
  const targetUid = uidFromQuery || user?.uid || "";

  if (!targetUid) {
    window.location.href = "login.html";
    return;
  }

  viewedUid = targetUid;
  isOwnerView = Boolean(user?.uid && user.uid === targetUid);
  currentUser = user || null;

  if (!uidFromQuery && !user) {
    window.location.href = "login.html";
    return;
  }

  viewedProfile = await getPublicProfileByUid(targetUid);
  if (!viewedProfile) {
    if (isOwnerView) {
      window.location.href = "createaccount.html";
      return;
    }

    isOwnerView = false;
    setEditControlsVisibility();
    setStatusMessage(pageMessageEl, "That account was not found.");
    nameEl.textContent = "Profile not found";
    bioEl.textContent = "The requested user profile could not be loaded.";
    dealsTitleEl.textContent = "Posted Deals";
    dealsEmptyEl.style.display = "";
    dealsEmptyEl.textContent = "No deals to display.";
    return;
  }

  if (isOwnerView) {
    currentProfile = viewedProfile;
    populateEditForm(currentProfile);
  } else {
    currentProfile = null;
  }

  updateProfileUI(user, viewedProfile);
  setEditControlsVisibility();
  setStatusMessage(pageMessageEl, "");
  await loadViewedDeals();
}

editProfileBtn.addEventListener("click", () => {
  if (!isOwnerView) {
    return;
  }

  const shouldOpen = editForm.style.display === "none";
  setEditFormVisibility(shouldOpen);
  if (shouldOpen) {
    populateEditForm(currentProfile || {});
    setStatusMessage(editMessageEl, "");
  }
});

cancelEditBtn.addEventListener("click", () => {
  populateEditForm(currentProfile || {});
  setStatusMessage(editMessageEl, "");
  setEditFormVisibility(false);
});

editForm.addEventListener("submit", saveProfileChanges);

onAuthStateChanged(auth, async (user) => {
  try {
    await loadAccountPageState(user);
  } catch (error) {
    console.error("Unable to load account profile.", error);
    setStatusMessage(pageMessageEl, "Unable to load this account right now.");
  } finally {
    document.body.style.visibility = "visible";
  }
});

document.body.style.visibility = "hidden";
setEditFormVisibility(false);
initSideMenu();
