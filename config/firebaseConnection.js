const { initializeApp } =  require('firebase/app');
const { getFirestore, collection, getDocs }=require('firebase/firestore/lite');
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCxlG3UkPZ0ADCg4_2NdifFAVwUYfh086Q",
    authDomain: "adbrokers-86765.firebaseapp.com",
    projectId: "adbrokers-86765",
    storageBucket: "adbrokers-86765.appspot.com",
    messagingSenderId: "807171167314",
    appId: "1:807171167314:web:a0d38286b833989bee7b8b",
    measurementId: "G-D7SDGRY5KZ"
  };
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports=db;