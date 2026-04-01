import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { getDownloadURL, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";
import { auth, db, storage } from "../firebase-config.js";
import { setStatusMessage } from "../shared/messages.js";
import { initSideMenu } from "../shared/menu.js";

const googleBtn = document.getElementById("google-signup");
const profileForm = document.getElementById("profile-form");
const profilePreview = document.getElementById("profile-img-preview");
const usernameInput = document.getElementById("username");
const bioInput = document.getElementById("bio");
const profileImageInput = document.getElementById("profileImage");
const messageEl = document.getElementById("auth-message");
const submitBtn = profileForm.querySelector("button[type='submit']");

const DEFAULT_AVATAR = "https://via.placeholder.com/100";
const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,20}$/;
let currentUser = null;

function setFormVisibility(isVisible) {
  profileForm.style.display = isVisible ? "flex" : "none";
  googleBtn.style.display = isVisible ? "none" : "block";
}

function setLoading(isLoading, buttonText = "Save Profile") {
  googleBtn.disabled = isLoading;
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? "Saving..." : buttonText;
}

function validateUsername(username) {
  return USERNAME_PATTERN.test(username);
}

function getUsernameKey(username) {
  return username.trim().toLowerCase();
}

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function routeUser(user) {
  currentUser = user;

  if (!user) {
    setFormVisibility(false);
    profilePreview.src = DEFAULT_AVATAR;
    setStatusMessage(messageEl, "");
    return;
  }

  profilePreview.src = user.photoURL || DEFAULT_AVATAR;
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    window.location.href = "account.html";
    return;
  }

  setFormVisibility(true);
  setStatusMessage(messageEl, "Signed in. Complete your profile to finish account setup.", "info");
}

async function uploadProfileImage(user) {
  const file = profileImageInput.files[0];
  if (!file) {
    return user.photoURL || "";
  }

  const fileName = sanitizeFileName(file.name);
  const imageRef = ref(
    storage,
    `profileImages/${user.uid}/${Date.now()}-${fileName}`
  );
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}

async function saveProfile(user, username, bio, profileImageURL) {
  const usernameKey = getUsernameKey(username);
  const userDocRef = doc(db, "users", user.uid);
  const usernameDocRef = doc(db, "usernames", usernameKey);

  await runTransaction(db, async (transaction) => {
    const usernameSnap = await transaction.get(usernameDocRef);
    if (usernameSnap.exists()) {
      const usernameData = usernameSnap.data();
      if (usernameData.uid !== user.uid) {
        throw new Error("USERNAME_TAKEN");
      }
    }

    const existingUserSnap = await transaction.get(userDocRef);
    const existingUser = existingUserSnap.exists() ? existingUserSnap.data() : null;
    const now = serverTimestamp();

    transaction.set(
      usernameDocRef,
      {
        uid: user.uid,
        originalUsername: username,
        createdAt: usernameSnap.exists() ? usernameSnap.data().createdAt || now : now
      },
      { merge: true }
    );

    transaction.set(
      userDocRef,
      {
        username,
        usernameKey,
        displayName: user.displayName || username,
        email: user.email || "",
        bio,
        profileImage: profileImageURL,
        dealsPosted: existingUser?.dealsPosted ?? 0,
        likes: existingUser?.likes ?? 0,
        followers: existingUser?.followers ?? 0,
        savedDeals: existingUser?.savedDeals ?? 0,
        createdAt: existingUser?.createdAt || now,
        updatedAt: now
      },
      { merge: true }
    );
  });
}

googleBtn.addEventListener("click", async () => {
  setStatusMessage(messageEl, "");
  setLoading(true, "Save Profile");

  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (error) {
    if (error?.code === "auth/popup-closed-by-user") {
      setStatusMessage(messageEl, "Sign-in popup closed before completing login.");
    } else {
      setStatusMessage(messageEl, error?.message || "Unable to sign in with Google.");
    }
  } finally {
    setLoading(false, "Save Profile");
  }
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentUser) {
    setStatusMessage(messageEl, "Sign in with Google before saving your profile.");
    return;
  }

  const username = usernameInput.value.trim();
  const bio = bioInput.value.trim();

  if (!validateUsername(username)) {
    setStatusMessage(messageEl, "Username must be 3-20 characters using letters, numbers, or underscore.");
    return;
  }

  if (!bio) {
    setStatusMessage(messageEl, "Bio is required.");
    return;
  }

  setLoading(true);
  setStatusMessage(messageEl, "Creating your account...", "info");

  try {
    const profileImageURL = await uploadProfileImage(currentUser);
    await saveProfile(currentUser, username, bio, profileImageURL);
    setStatusMessage(messageEl, "Profile saved. Redirecting...", "success");
    window.location.href = "account.html";
  } catch (error) {
    if (error?.message === "USERNAME_TAKEN") {
      setStatusMessage(messageEl, "That username is already taken. Try a different one.");
    } else {
      setStatusMessage(messageEl, error?.message || "Unable to save profile. Please try again.");
    }
  } finally {
    setLoading(false);
  }
});

onAuthStateChanged(auth, async (user) => {
  try {
    await routeUser(user);
  } catch (error) {
    setStatusMessage(messageEl, "Unable to load account state. Refresh and try again.");
    console.error(error);
  }
});

initSideMenu();
