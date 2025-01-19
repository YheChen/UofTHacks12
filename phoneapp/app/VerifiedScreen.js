import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function VerifiedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verification Complete!</Text>
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
  message: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});
