import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

  // Your web app's Firebase configuration
firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "roland-react-8.firebaseapp.com",
    databaseURL: "https://roland-react-8.firebaseio.com",
    projectId: "roland-react-8",
    storageBucket: "roland-react-8.appspot.com",
    messagingSenderId: "669321455528",
    appId: "1:669321455528:web:3c8950d86d8f5407a85f9d",
    measurementId: "G-2K3YK57QRV"
  });

export const firestore = firebase.firestore();

export const provider = new firebase.auth.GoogleAuthProvider();

export default firebase;