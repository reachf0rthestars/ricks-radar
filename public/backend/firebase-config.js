import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

 // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyB0twUQGPv--7re_dU2hfvEtVdXd0zALrs",
    authDomain: "ricksradar.firebaseapp.com",
    projectId: "ricksradar",
    storageBucket: "ricksradar.firebasestorage.app",
    messagingSenderId: "624236538983",
    appId: "1:624236538983:web:3879f6d7b0c359a6d7b8c2"
  };

async function testFirebaseConfig() {
  try {
    // 2. Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // 3. Attempt to query a collection (even if it's empty) 
    // to verify the API key and Project ID are valid.
    const testQuery = query(collection(db, "connection_test"), limit(1));
    await getDocs(testQuery);

    console.log("✅ Firebase connection successful: Configuration is valid.");
  } catch (error) {
    console.error("❌ Firebase connection failed:");
    console.error(`Error Code: ${error.code}`);
    console.error(`Message: ${error.message}`);
  }
}

// test the console to see if it can be wrote it
console.log("firebase-config.js is loaded...");

// test the firebase config
testFirebaseConfig();


// Initialize the Apps
const app = initializeApp(firebaseConfig);

// Export the services so your other JS files can use them
export const db = getFirestore(app);
export const auth = getAuth(app);