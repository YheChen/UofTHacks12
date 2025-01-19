import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
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

export default function InitialScreen({ navigation }) {
  const [verificationNumber, setVerificationNumber] = useState("");
  const [generatedNumber, setGeneratedNumber] = useState(null);

  const createVerification = async () => {
    // const randomNumber = Math.floor(10 + Math.random() * 90); // Generate a 2-digit number
    // setGeneratedNumber(randomNumber);
    // try {
    //   await addDoc(collection(db, "verifications"), {
    //     number: randomNumber,
    //     verified: false,
    //   });
    // } catch (error) {
    //   console.error("Error creating verification:", error);
    //   Alert.alert("Error", "Failed to create verification.");
    // }
  };

  const handleVerify = async () => {
    if (!verificationNumber) {
      Alert.alert("Error", "Please enter a valid number.");
      return;
    }

    try {
      const q = query(
        collection(db, "verifications"),
        where("number", "==", parseInt(verificationNumber))
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { detected: true });
        navigation.navigate("Instructions");
      } else {
        Alert.alert("Error", "Verification number not found.");
      }
    } catch (error) {
      console.error("Error verifying:", error);
      Alert.alert("Error", "Failed to verify. Please try again.");
    }
  };

  useEffect(() => {
    createVerification();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Initial Verification</Text>
      {generatedNumber ? (
        <Text style={styles.info}>
          Please enter the number on your browser:
        </Text>
      ) : (
        <Text>Please enter the number on your browser:</Text>
      )}
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
    fontWeight: "bold",
  },
  info: {
    fontSize: 16,
    marginVertical: 20,
    textAlign: "center",
  },
  strong: {
    fontWeight: "bold",
    color: "#007BFF",
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
