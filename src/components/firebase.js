import { initializeApp } from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from '@firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAs-sT6uKk31ywBRq_dIRGyCGLsOith2o0",
  authDomain: "carpoolingapp-development.firebaseapp.com",
  projectId: "carpoolingapp-development",
  storageBucket: "carpoolingapp-development.appspot.com",
  messagingSenderId: "463218851533",
  appId: "1:463218851533:web:c2227d2f02d2f21b253384"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 