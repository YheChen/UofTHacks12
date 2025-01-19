import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

export default function VerifiedScreen() {
  const confettiRef = useRef(null);

  useEffect(() => {
    // Trigger confetti animation when the component mounts
    if (confettiRef.current) {
      confettiRef.current.start();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verification Complete!</Text>
      {/* Confetti Cannon */}
      <ConfettiCannon
        count={100}
        origin={{ x: 0, y: 0 }}
        fadeOut={true}
        explosionSpeed={350}
        fallSpeed={2500}
        ref={confettiRef}
      />
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
    textAlign: "center",
  },
});
