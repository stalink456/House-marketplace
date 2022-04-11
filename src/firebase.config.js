import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNCI1rds38n4dTvFhl87_Qaq_xRLxvztY",
  authDomain: "house-marketplace-app-9923b.firebaseapp.com",
  projectId: "house-marketplace-app-9923b",
  storageBucket: "house-marketplace-app-9923b.appspot.com",
  messagingSenderId: "926403439676",
  appId: "1:926403439676:web:9a44cbba96dfdd88a6a739",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
