import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCm63gNxk1sR4UG4PX4eE4bZ5RcNn61I_o",
  authDomain: "dotjo-8c9ca.firebaseapp.com",
  projectId: "dotjo-8c9ca",
  storageBucket: "dotjo-8c9ca.firebasestorage.app",
  messagingSenderId: "162196277156",
  appId: "1:162196277156:web:2f5d6549b496a414e66331",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
