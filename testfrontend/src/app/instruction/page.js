"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
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

export default function InstructionPage() {
  const [orientation, setOrientation] = useState(null);
  const [tiltImage, setTiltImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "verifications"));
        if (!querySnapshot.empty) {
          const firstDoc = querySnapshot.docs[0];
          const data = firstDoc.data();

          // Set orientation based on document value
          setOrientation(data.orientation);

          // Listen for changes in the "verified" field
          const unsubscribe = onSnapshot(
            doc(db, "verifications", firstDoc.id),
            (snapshot) => {
              if (snapshot.exists()) {
                const verifyValue = snapshot.data().verified; // Access the 'detected' field
                console.log("Verify value:", verifyValue);

                if (verifyValue === true) {
                  unsubscribe(); // Stop listening
                  router.push("/verified"); // Navigate to verified page
                }
              }
            }
          );
        } else {
          console.log("No documents found!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchDocument();
  }, [router]);

  const basePath = "/images/";
  useEffect(() => {
    // Update tilt image based on orientation
    if (orientation === 1) {
      setTiltImage(basePath + "doggo_xForward.png");
    } else if (orientation === 2) {
      setTiltImage(basePath + "doggo_yLeft.png");
    } else if (orientation === 3) {
      setTiltImage(basePath + "doggo_yRight.png");
    } else if (orientation === 4) {
      setTiltImage(basePath + "doggo_zLeft.png");
    } else if (orientation === 5) {
      setTiltImage(basePath + "doggo_zRight.png");
    }
  }, [orientation]);

  return (
    <div style={{ textAlign: "center", marginTop: "10%" }}>
      <h1>Instructions</h1>
      <p>Tilt/Rotate your device until the image matches the instructions.</p>
      {tiltImage && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "40vh",
          }}
        >
          <img
            src={tiltImage}
            alt="Tilt Instruction"
            style={{
              maxWidth: "70%",
              height: "auto",
            }}
          />
        </div>
      )}
    </div>
  );
}
