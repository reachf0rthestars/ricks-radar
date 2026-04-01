import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { auth, db } from "../firebase-config.js";

export const DEFAULT_AVATAR = "https://via.placeholder.com/120";
export const PROFILE_UPDATED_EVENT = "profile:updated";

export function getDisplayName(user, profile = {}) {
  return profile.username || profile.displayName || user?.displayName || "User";
}

export function getProfileImage(user, profile = {}, fallback = DEFAULT_AVATAR) {
  return profile.profileImage || user?.photoURL || fallback;
}

export async function getUserProfileDoc(user) {
  if (!user) {
    return null;
  }

  const profileDoc = await getDoc(doc(db, "users", user.uid));
  if (!profileDoc.exists()) {
    return null;
  }

  return profileDoc.data();
}

export function onUserProfileChange(callback) {
  return onAuthStateChanged(auth, async (user) => {
    let profile = null;
    if (user) {
      try {
        profile = await getUserProfileDoc(user);
      } catch (error) {
        console.error("Unable to read user profile.", error);
      }
    }

    callback({ user, profile });
  });
}

export function emitProfileUpdated(profile) {
  document.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail: { profile } }));
}
