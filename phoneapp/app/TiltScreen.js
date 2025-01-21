import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Gyroscope } from "expo-sensors";
import * as Haptics from "expo-haptics";
import tilt1 from "./images/tilt1.png";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

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

export default function TiltScreen({ navigation }) {
  const [cumulativeAngles, setCumulativeAngles] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [isHolding, setIsHolding] = useState(false);
  const [debugText, setDebugText] = useState("Initializing...");
  const holdTimer = useRef(null);
  const lastUpdateRef = useRef(Date.now());
  const [orientation, setOrientation] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "verifications"));
        if (!querySnapshot.empty) {
          const firstDoc = querySnapshot.docs[0];
          const data = firstDoc.data();
          // Set orientation based on document value
          setOrientation(data.orientation);
        } else {
          console.log("No documents found!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchDocument();
  });

  const handleVerify = async () => {
    try {
      // Get the first document in the "verifications" collection
      const querySnapshot = await getDocs(collection(db, "verifications"));

      if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0]; // Get the first document
        const docRef = doc(db, "verifications", firstDoc.id); // Reference to the document
        await updateDoc(docRef, { verified: true });
        navigation.navigate("Verified"); // Navigate to VerifiedScreen

        console.log("Database updated: User verified.");
      } else {
        console.log("No documents found in the 'verifications' collection.");
      }
    } catch (error) {
      console.error("Error updating the database:", error);
    }
  };

  useEffect(() => {
    Gyroscope.setUpdateInterval(100);

    const subscription = Gyroscope.addListener((data) => {
      const currentTime = Date.now();
      const dt = (currentTime - lastUpdateRef.current) / 1000; // Time delta in seconds
      lastUpdateRef.current = currentTime;

      setCumulativeAngles((prev) => ({
        x: prev.x + data.x * dt,
        y: prev.y + data.y * dt,
        z: prev.z + data.z * dt,
      }));
    });

    return () => subscription.remove();
  }, []);

  const anglesDeg = {
    x: (cumulativeAngles.x * 180) / Math.PI,
    y: (cumulativeAngles.y * 180) / Math.PI,
    z: (cumulativeAngles.z * 180) / Math.PI,
  };

  useEffect(() => {
    let isInRange = false;

    if (orientation === 1) {
      // Orientation 1: Check for anglesDeg.x close to -45°
      isInRange = Math.abs(anglesDeg.x + 45) <= 10;
    } else if (orientation === 2) {
      // Orientation 2: Check for anglesDeg.y close to 45°
      isInRange = Math.abs(anglesDeg.y + 45) <= 10;
    } else if (orientation === 3) {
      // Orientation 3: Check for anglesDeg.y close to -45°
      isInRange = Math.abs(anglesDeg.y - 45) <= 10;
    } else if (orientation === 4) {
      // Orientation 4: Check for anglesDeg.z close to 45°
      isInRange = Math.abs(anglesDeg.z - 90) <= 10;
    } else if (orientation === 5) {
      // Orientation 5: Check for anglesDeg.z close to -45°
      isInRange = Math.abs(anglesDeg.z + 90) <= 10;
    }

    if (isInRange) {
      setDebugText(
        `In range: x=${anglesDeg.x.toFixed(2)}, y=${anglesDeg.y.toFixed(
          2
        )}, z=${anglesDeg.z.toFixed(2)}`
      );

      if (!isHolding) {
        setIsHolding(true);
        holdTimer.current = setTimeout(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          handleVerify(); // Updates the verified tag
        }, 2500); // 2.5-second hold timer
      }
    } else {
      setDebugText(
        `Out of range: x=${anglesDeg.x.toFixed(2)}, y=${anglesDeg.y.toFixed(
          2
        )}, z=${anglesDeg.z.toFixed(2)}`
      );
      setIsHolding(false);
      clearTimeout(holdTimer.current); // Reset timer if out of range
    }
  }, [anglesDeg, isHolding, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tilt Screen</Text>
      <Image source={tilt1} style={styles.image} />
      <Text style={styles.message}>
        Orient the phone correctly and hold steady for 2.5 seconds to proceed.
      </Text>

      {/* Debugging: Display cumulative angles */}
      <Text style={styles.info}>{debugText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
  },
  message: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
