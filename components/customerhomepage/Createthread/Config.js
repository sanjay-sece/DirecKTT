import firebase from 'firebase/compat/app'
import'firebase/compat/storage'
const firebaseConfig = {
  apiKey: "AIzaSyAcY3RD-Tt1x3019cfbp3duBO7jVrra070",
  authDomain: "direcktappstorage.firebaseapp.com",
  projectId: "direcktappstorage",
  storageBucket: "direcktappstorage.appspot.com",
  messagingSenderId: "339141444146",
  appId: "1:339141444146:web:c50caee478d662d13b722b"
  };
  if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
   }
 
export{firebase}