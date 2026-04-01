import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { auth, db } from "../firebase-config.js";
import { initSideMenu } from "../shared/menu.js";

const avatarEl = document.querySelector(".profile-avatar");
const nameEl = document.querySelector(".profile-name");
const bioEl = document.querySelector(".profile-bio");
const statValueEls = document.querySelectorAll(".profile-stats strong");
const DEFAULT_AVATAR = "https://via.placeholder.com/120";

function toSafeCount(value) {
  return Number.isFinite(value) ? value : 0;
}

function updateProfileUI(user, profile = {}) {
  const displayName = profile.username || user.displayName || "User";
  const bio = profile.bio || "Tell us about yourself.";
  const profileImage = profile.profileImage || user.photoURL || DEFAULT_AVATAR;

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

    updateProfileUI(user, userDoc.data());
  } catch (error) {
    console.error("Unable to load account profile.", error);
  }
});

initSideMenu();
