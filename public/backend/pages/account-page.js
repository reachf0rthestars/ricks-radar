import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { doc, getDoc, serverTimestamp, updateDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { getDownloadURL, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";
import { auth, db, storage } from "../firebase-config.js";
import {
  DEFAULT_AVATAR,
  emitProfileUpdated,
  getDisplayName,
  getProfileImage
} from "../shared/auth-profile.js";
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

let currentUser = null;
let currentProfile = null;

function toSafeCount(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function updateProfileUI(user, profile = {}) {
  const displayName = getDisplayName(user, profile);
  const bio = profile.bio || "Tell us about yourself.";
  const profileImage = getProfileImage(user, profile, DEFAULT_AVATAR);

  nameEl.textContent = displayName;
  bioEl.textContent = bio;
  avatarEl.src = profileImage;

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
  editForm.style.display = isVisible ? "grid" : "none";
  editProfileBtn.textContent = isVisible ? "Close Edit" : "Edit Profile";
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

  if (!currentUser || !currentProfile) {
    setStatusMessage(editMessageEl, "You must be signed in to edit your profile.");
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

editProfileBtn.addEventListener("click", () => {
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
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      window.location.href = "createaccount.html";
      return;
    }

    currentUser = user;
    currentProfile = userDoc.data();
    updateProfileUI(user, currentProfile);
    populateEditForm(currentProfile);
  } catch (error) {
    console.error("Unable to load account profile.", error);
  }

  document.body.style.visibility = "visible";
});

document.body.style.visibility = "hidden";
setEditFormVisibility(false);
initSideMenu({ topRightMode: "logout" });
