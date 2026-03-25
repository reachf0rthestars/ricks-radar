import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_CONFIG_API_KEY,
  authDomain: "ricksradar.firebaseapp.com",
  projectId: "ricksradar",
  storageBucket: "ricksradar.firebasestorage.app",
  messagingSenderId: import.meta.env.FIREBASE_CONFIG_MESSAGING_SENDER_ID,
  appId: import.meta.env.FIREBASE_CONFIG_APP_ID,
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