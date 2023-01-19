// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCEqGVCC91SdADH1znFOgTC-aAoSM2i4QA",
    authDomain: "post-e5588.firebaseapp.com",
    projectId: "post-e5588",
    storageBucket: "post-e5588.appspot.com",
    messagingSenderId: "975118404879",
    appId: "1:975118404879:web:c6bd369a0fded038df827a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app)

export {
    db, app, storage
}
