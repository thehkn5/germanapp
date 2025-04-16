import { initializeApp } from "firebase/app"
import { getAuth, setPersistence, browserLocalPersistence, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getStorage, connectStorageEmulator } from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeittib9Yrs43v9p03D9Due4Up53GkcIo",
  authDomain: "learn-e225d.firebaseapp.com",
  projectId: "learn-e225d",
  storageBucket: "learn-e225d.appspot.com",
  messagingSenderId: "556562042553",
  appId: "1:556562042553:web:5d09d705c7b5efb9e9d568",
  measurementId: "G-BZMGVWDH31",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Set persistence to LOCAL (this ensures the user stays logged in)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase persistence set to LOCAL")
  })
  .catch((error) => {
    console.error("Error setting persistence:", error)
  })

// Determine if we should use emulators
// We can set this via environment variable or explicitly set to true for development
const useEmulators = process.env.NODE_ENV === "development" && 
  (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true" || true);

// Use emulators if specified
if (useEmulators) {
  try {
    console.log("🔥 Using Firebase emulators");
    
    // Connect to Firestore emulator
    connectFirestoreEmulator(db, "localhost", 8080);
    console.log("Connected to Firestore emulator");
    
    // Connect to Auth emulator
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    console.log("Connected to Auth emulator");
    
    // Connect to Storage emulator
    connectStorageEmulator(storage, "localhost", 9199);
    console.log("Connected to Storage emulator");
  } catch (error) {
    console.error("Failed to connect to Firebase emulators:", error);
  }
}

export { auth, db, storage }
