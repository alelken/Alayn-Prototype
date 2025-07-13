// client/src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyADRJc4RqqnwW5uaMpnAqf-92RPiMpSZ6Q",
  authDomain: "alaynmvp.firebaseapp.com",
  projectId: "alaynmvp",
  storageBucket: "alaynmvp.firebasestorage.app"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 