"use client";

import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
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

export default function VerifiedPage() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    console.log("User has been verified and navigated to /verified.");

    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Delete the first document in the Firestore collection
    const deleteFirstDocument = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "verifications"));

        if (!querySnapshot.empty) {
          const firstDoc = querySnapshot.docs[0]; // Get the first document
          const docId = firstDoc.id; // Document ID
          console.log(`Found document to delete with ID: ${docId}`);

          const docRef = doc(db, "verifications", docId); // Reference to the document
          await deleteDoc(docRef); // Delete the document

          console.log(`Document with ID ${docId} deleted successfully.`);
        } else {
          console.log("No documents found in the 'verifications' collection.");
        }
      } catch (error) {
        console.error("Error deleting the first document:", error);
      }
    };

    // Call the delete function
    deleteFirstDocument();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <h1 style={{ fontSize: "100px" }}>Verification Complete!</h1>{" "}
      {/* 10x larger font */}
      <p style={{ fontSize: "50px" }}>You are now logged in!</p>{" "}
      {/* Adjust size as needed */}
      <Confetti
        width={windowDimensions.width}
        height={windowDimensions.height}
      />
    </div>
  );
}
