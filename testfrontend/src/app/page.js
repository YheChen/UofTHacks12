"use client";
import React, { useState, useEffect } from "react";
import { db } from "./firebase";

export default function WebApp() {
  const [docId, setDocId] = useState(null);
  const [verificationNumber, setVerificationNumber] = useState(null);
  const [verified, setVerified] = useState(false);

  const createVerification = async () => {
    // Generate a random 2-digit number
    const randomNum = Math.floor(10 + Math.random() * 90);
    setVerificationNumber(randomNum);

    // Create a new document in Firestore
    const docRef = await db.collection("verifications").add({
      number: randomNum,
      verified: false,
    });
    setDocId(docRef.id);

    // Start listening for changes
    const unsubscribe = docRef.onSnapshot((doc) => {
      const data = doc.data();
      if (data.verified) {
        setVerified(true);
        unsubscribe(); // Stop listening
        db.collection("verifications").doc(docRef.id).delete(); // Delete document
      }
    });
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
