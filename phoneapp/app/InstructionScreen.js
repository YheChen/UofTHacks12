import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";

export default function InstructionScreen() {
  const handleBegin = () => {
    Alert.alert(
      "Begin button pressed",
      "You can now proceed to the next stage!"
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Instructions</Text>
      <Text style={styles.info}>
        Hold your device parallel to your face, then click begin to continue.
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
