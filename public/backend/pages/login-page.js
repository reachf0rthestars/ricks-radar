import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { auth, db } from "../firebase-config.js";
import { setStatusMessage } from "../shared/messages.js";
import { initSideMenu } from "../shared/menu.js";

const loginButton = document.getElementById("google-login");
const messageEl = document.getElementById("login-message");

async function routeUser(user) {
  if (!user) {
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  window.location.href = userDoc.exists() ? "account.html" : "createaccount.html";
}

function setLoading(isLoading) {
  loginButton.disabled = isLoading;
  loginButton.textContent = isLoading ? "Signing in..." : "Sign in with Google";
}

loginButton.addEventListener("click", async () => {
  setStatusMessage(messageEl, "");
  setLoading(true);

  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (error) {
    if (error?.code === "auth/popup-closed-by-user") {
      setStatusMessage(messageEl, "Sign-in popup closed before completing login.");
    } else {
      setStatusMessage(messageEl, error?.message || "Unable to sign in. Please try again.");
    }
  } finally {
    setLoading(false);
  }
});

onAuthStateChanged(auth, async (user) => {
  try {
    await routeUser(user);
  } catch (error) {
    setStatusMessage(messageEl, "Unable to check account status. Please refresh.");
    console.error(error);
  }
});

initSideMenu();
