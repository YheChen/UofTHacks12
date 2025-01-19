import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADAhk1O9ahfD5o5S2DE8rWxgmw1CttsR8",
  authDomain: "viewcaptcha.firebaseapp.com",
  projectId: "viewcaptcha",
  storageBucket: "viewcaptcha.appspot.com",
  messagingSenderId: "107579019457",
  appId: "1:107579019457:web:e812a2b6293fa779138440",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db, collection, doc, query, where, getDocs, updateDoc };
