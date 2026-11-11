import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "interviewai-abbca.firebaseapp.com",
    projectId: "interviewai-abbca",
    storageBucket: "interviewai-abbca.firebasestorage.app",
    messagingSenderId: "708878518951",
    appId: "1:708878518951:web:88aa7dbf0fa5bcd610a982",
    measurementId: "G-GT5V7JKRT8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
