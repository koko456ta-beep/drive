import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyBnztR8Toq9Miqf-94J4Yg3_Z-ZHA1s7oA",
  authDomain: "drive-91f88.firebaseapp.com",
  projectId: "drive-91f88",
  storageBucket: "drive-91f88.firebasestorage.app",
  messagingSenderId: "321288829450",
  appId: "1:321288829450:web:880678246f6e3a191ebdf3",
  measurementId: "G-DECW930PS1"
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
