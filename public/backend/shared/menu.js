import { signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { auth } from "../firebase-config.js";
import {
  DEFAULT_AVATAR,
  getDisplayName,
  getProfileImage,
  onUserProfileChange,
  PROFILE_UPDATED_EVENT
} from "./auth-profile.js";

function getElement(selector) {
  return document.querySelector(selector);
}

export function ensureMenuOverlay(overlaySelector = "#menu-overlay") {
  let overlay = getElement(overlaySelector);
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = overlaySelector.startsWith("#") ? overlaySelector.slice(1) : "menu-overlay";
    document.body.appendChild(overlay);
  }
  return overlay;
}

function findMenuLinkByHref(href) {
  return document.querySelector(`#side-menu a[href="${href}"]`);
}

function setMenuAuthVisibility(isSignedIn) {
  const accountLink = findMenuLinkByHref("account.html");
  const loginLink = findMenuLinkByHref("login.html");
  const logoutButton = document.getElementById("logout-btn");

  if (accountLink) {
    accountLink.style.display = isSignedIn ? "" : "none";
  }

  if (loginLink) {
    loginLink.style.display = isSignedIn ? "none" : "";
  }

  if (logoutButton) {
    logoutButton.style.display = isSignedIn ? "" : "none";
  }
}

function getTopBar() {
  return getElement(".top-bar");
}

function ensureProfileBadge() {
  const topBar = getTopBar();
  if (!topBar) {
    return null;
  }

  let badge = topBar.querySelector(".top-profile-badge");
  if (badge) {
    return badge;
  }

  badge = document.createElement("button");
  badge.type = "button";
  badge.className = "top-profile-badge";
  badge.innerHTML = `
    <img class="top-profile-badge__img" alt="Profile" src="${DEFAULT_AVATAR}">
    <span class="top-profile-badge__name">Sign In</span>
  `;
  topBar.appendChild(badge);
  return badge;
}

function updateProfileBadge(badge, user, profile) {
  if (!badge) {
    return;
  }

  const img = badge.querySelector(".top-profile-badge__img");
  const name = badge.querySelector(".top-profile-badge__name");

  if (!user) {
    img.src = DEFAULT_AVATAR;
    name.textContent = "Sign In";
    return;
  }

  img.src = getProfileImage(user, profile, DEFAULT_AVATAR);
  name.textContent = getDisplayName(user, profile);
}

function initLogout() {
  const logoutButton = document.getElementById("logout-btn");
  if (!logoutButton) {
    return;
  }

  logoutButton.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (error) {
      console.error("Unable to sign out.", error);
    }
  });
}

export function initSideMenu({
  menuButtonSelector = "#menu-btn",
  sideMenuSelector = "#side-menu",
  overlaySelector = "#menu-overlay"
} = {}) {
  const menuButton = getElement(menuButtonSelector) || getElement(".top-btn--secondary");
  const sideMenu = getElement(sideMenuSelector);
  const overlay = ensureMenuOverlay(overlaySelector);

  if (!menuButton || !sideMenu || !overlay) {
    return;
  }

  const openMenu = () => {
    sideMenu.classList.add("active");
    overlay.classList.add("active");
  };

  const closeMenu = () => {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
  };

  menuButton.addEventListener("click", openMenu);
  overlay.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  const profileBadge = ensureProfileBadge();
  let activeUser = auth.currentUser;
  let activeProfile = null;

  if (profileBadge) {
    profileBadge.addEventListener("click", () => {
      window.location.href = auth.currentUser ? "account.html" : "login.html";
    });
  }

  setMenuAuthVisibility(Boolean(auth.currentUser));

  onUserProfileChange(({ user, profile }) => {
    activeUser = user;
    activeProfile = profile;
    setMenuAuthVisibility(Boolean(user));
    updateProfileBadge(profileBadge, user, profile);
  });

  document.addEventListener(PROFILE_UPDATED_EVENT, (event) => {
    activeProfile = event.detail?.profile || activeProfile;
    updateProfileBadge(profileBadge, activeUser, activeProfile);
  });

  initLogout();
}
