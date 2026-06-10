import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDg5akulHPJKbRPkJGwgbFQvQf1juhCDsQ",
  authDomain: "elos-app-719a6.firebaseapp.com",
  projectId: "elos-app-719a6",
  storageBucket: "elos-app-719a6.firebasestorage.app",
  messagingSenderId: "852445987356",
  appId: "1:852445987356:web:fa097892197aa9131055d9"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()