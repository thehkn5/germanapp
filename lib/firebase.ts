import { initializeApp } from "firebase/app"
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getStorage } from "firebase/storage"

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

// Set persistence to LOCAL (this ensures the user stays logged in)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase persistence set to LOCAL")
  })
  .catch((error) => {
    console.error("Error setting persistence:", error)
  })

const db = getFirestore(app)

// Initialize Storage
const storage = getStorage(app)

// Use emulators in development if needed
if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true") {
  try {
    connectFirestoreEmulator(db, "localhost", 8080)
    console.log("Connected to Firestore emulator")
  } catch (error) {
    console.error("Failed to connect to Firestore emulator:", error)
  }
}

export { auth, db, storage }
