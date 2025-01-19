import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

// Import Firebase dependencies
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [verificationNumber, setVerificationNumber] = useState("");

  const handleVerify = async () => {
    if (!verificationNumber) {
      Alert.alert("Error", "Please enter a valid number.");
      return;
    }

    try {
      // Query Firestore for the document with the matching number
      const q = query(
        collection(db, "verifications"),
        where("number", "==", parseInt(verificationNumber))
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;

        // Update the `verified` field to true
        await updateDoc(docRef, { verified: true });
        Alert.alert("Success", "Verification complete!");
      } else {
        Alert.alert("Error", "Verification number not found.");
      }
    } catch (error) {
      console.error("Error verifying document:", error);
      Alert.alert("Error", "Failed to verify. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Verification Number"
        value={verificationNumber}
        onChangeText={setVerificationNumber}
        keyboardType="numeric"
      />
      <Button title="Verify" onPress={handleVerify} />
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
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
});
