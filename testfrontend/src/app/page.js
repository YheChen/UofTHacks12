"use client";
import React, { useState, useEffect } from "react";

// Import Firebase dependencies
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADAhk1O9ahfD5o5S2DE8rWxgmw1CttsR8",
  authDomain: "viewcaptcha.firebaseapp.com",
  projectId: "viewcaptcha",
  storageBucket: "viewcaptcha.firebasestorage.app",
  messagingSenderId: "107579019457",
  appId: "1:107579019457:web:e812a2b6293fa779138440",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function WebApp() {
  const [docId, setDocId] = useState(null);
  const [verificationNumber, setVerificationNumber] = useState(null);
  const [verified, setVerified] = useState(false);

  const createVerification = async () => {
    // Generate a random 3 digit number
    let randomNumber = Math.floor(Math.random() * 900) + 100;
    console.log(randomNumber);
    setVerificationNumber(randomNumber);

    try {
      // Create a new document in Firestore
      const docRef = await addDoc(collection(db, "verifications"), {
        number: randomNumber,
        detected: false,
        verified: false,
      });
      setDocId(docRef.id);

      // Start listening for changes
      const unsubscribe = onSnapshot(
        doc(db, "verifications", docRef.id),
        (doc) => {
          const data = doc.data();
          if (data && data.verified) {
            setVerified(true);
            unsubscribe(); // Stop listening
            // deleteDoc(doc(db, "verifications", docRef.id)); // Delete document
          }
        }
      );
    } catch (error) {
      console.error("Error creating new verifier doc:", error);
    }
  };

  useEffect(() => {
    if (!docId) {
      createVerification();
    }
  }, []);

  if (verified) {
    return <h1>Verification Successful!</h1>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <h1>Web App</h1>
      {verificationNumber ? (
        <p>
          Please enter this number on the app:{" "}
          <strong>{verificationNumber}</strong>
        </p>
      ) : (
        <p>Generating a number...</p>
      )}
    </div>
  );
}
