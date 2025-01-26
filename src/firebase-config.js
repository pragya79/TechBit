import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
const firebaseConfig = {
    apiKey: "AIzaSyAOdAjqODVjZtwbSVS7c9L6lsjNKVnGBR4",
    authDomain: "blog-site-86aad.firebaseapp.com",
    projectId: "blog-site-86aad",
    storageBucket: "blog-site-86aad.appspot.com",
    messagingSenderId: "976259537009",
    appId: "1:976259537009:web:8a1bcdfd592ee51bb863d0",
    measurementId: "G-N2ZQFT86CP"
  };
const app=initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const auth=getAuth(app);
export const provider=new GoogleAuthProvider();
