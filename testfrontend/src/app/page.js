"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Import Firebase dependencies
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
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
  const [detected, setDetected] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const createVerification = async () => {
    const randomNumber = Math.floor(Math.random() * 900) + 100; // Generate a random 3-digit number
    setVerificationNumber(randomNumber);

    try {
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
          if (data && data.detected) {
            setDetected(true);
            unsubscribe();
          }
        }
      );
    } catch (error) {
      console.error("Error creating verifier doc:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && !docId) {
      createVerification();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (detected) {
      router.push("/instruction"); // Navigate to instruction.js
    }
  }, [detected, router]);

  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      {!isLoggedIn ? (
        <button
          onClick={() => setIsLoggedIn(true)}
          style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          LOGIN
        </button>
      ) : (
        <>
          <h1>Web App</h1>
          {verificationNumber ? (
            <p>
              Please enter this number on the app:{" "}
              <strong>{verificationNumber}</strong>
            </p>
          ) : (
            <p>Generating a number...</p>
          )}
        </>
      )}
    </div>
  );
}
