import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";
import { 
  getFirestore, 
  collection, 
  query, 
  getDocs, 
  limit 
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0twUQGPv--7re_dU2hfvEtVdXd0zALrs",
  authDomain: "ricksradar.firebaseapp.com",
  projectId: "ricksradar",
  storageBucket: "ricksradar.firebasestorage.app",
  messagingSenderId: "624236538983",
  appId: "1:624236538983:web:3879f6d7b0c359a6d7b8c2"
};

// 1. Initialize Firebase ONCE
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// 2. Test the connection
async function testFirebaseConfig() {
  try {
    console.log("Attempting Firebase connection...");
    
    // Using the imported collection, query, limit, and getDocs functions
    const testQuery = query(collection(db, "connection_test"), limit(1));
    await getDocs(testQuery);

    console.log("✅ Firebase connection successful: Configuration is valid.");
  } catch (error) {
    console.error("❌ Firebase connection failed:");
    console.error(`Error Code: ${error.code}`);
    console.error(`Message: ${error.message}`);
  }
}

console.log("firebase-config.js is loaded...");
testFirebaseConfig();
