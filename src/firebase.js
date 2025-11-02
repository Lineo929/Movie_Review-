
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBjNjCHe3VuKn3ibs3Xvivmrybj1B7cXjQ",
  authDomain: "school-work-a4018.firebaseapp.com",
  projectId: "school-work-a4018",
  storageBucket: "school-work-a4018.appspot.com",
  messagingSenderId: "201275393299",
  appId: "1:201275393299:web:0d70a2acb7edf3c62186e6",
  measurementId: "G-B7NNGX4NV9",
};


const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);  
export const auth = getAuth(app);     




export const registerUser = async (email, password) => {
  return auth.createUserWithEmailAndPassword(auth, email, password);
};


export const loginUser = async (email, password) => {
  return auth.signInWithEmailAndPassword(auth, email, password);
};


export const logoutUser = async () => {
  return auth.signOut();
};


export const getCurrentUser = () => {
  return auth.currentUser;
};

export default app;
