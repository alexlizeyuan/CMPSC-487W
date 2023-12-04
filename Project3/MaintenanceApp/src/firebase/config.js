import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDdXhivc_G4CAKpGjpgP0nDvO85crIP8x4",
  authDomain: "maintenanceapp-e0124.firebaseapp.com",
  projectId: "maintenanceapp-e0124",
  storageBucket: "maintenanceapp-e0124.appspot.com",
  messagingSenderId: "515851932261",
  appId: "1:515851932261:web:e31ed82fea50f28cce6c8c"
};

  // init firebase
  firebase.initializeApp(firebaseConfig)
  
  //init services
  const projectFirestore = firebase.firestore()
  const projectAuth = firebase.auth()
  const projectStorage = firebase.storage()

  //timestamp
  const timestamp = firebase.firestore.Timestamp

  export { projectFirestore, projectAuth, projectStorage, timestamp}