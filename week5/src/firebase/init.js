// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9GxJ0dD6c5BFHCAtOaNiwtb-iNfjUriw",
  authDomain: "week7-feiyu.firebaseapp.com",
  projectId: "week7-feiyu",
  storageBucket: "week7-feiyu.firebasestorage.app",
  messagingSenderId: "343995999226",
  appId: "1:343995999226:web:1f7e61bf9dd14d8bb3fa43"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore() 
export default db