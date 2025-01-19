import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function InstructionScreen({ navigation }) {
  const handleBegin = () => {
    navigation.navigate("Tilt"); // Navigate to the Tilt screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Instructions</Text>
      <Text style={styles.info}>
        Hold your device parallel to your face. Once ready, click the "Begin"
        button to proceed.
      </Text>
      <Button title="Begin" onPress={handleBegin} />
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
});
