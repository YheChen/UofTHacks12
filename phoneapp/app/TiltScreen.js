import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image, StyleSheet, Alert } from "react-native";
import { Gyroscope } from "expo-sensors";
import * as Haptics from "expo-haptics";
import tilt1 from "./images/tilt1.png";
import tilt2 from "./images/tilt2.png";
// import tilt1 from "./images/tilt1.png";
// import tilt1 from "./images/tilt1.png";

export default function TiltScreen({ navigation }) {
  const [cumulativeAngles, setCumulativeAngles] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [isTiltDetected, setIsTiltDetected] = useState(false);
  const lastUpdateRef = useRef(Date.now());

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
    if (!isTiltDetected && anglesDeg.y >= 90) {
      setIsTiltDetected(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Tilt Detected", "You tilted the phone 90°!");
      navigation.navigate("Verified"); // Navigate to VerifiedScreen
    }
  }, [anglesDeg, isTiltDetected, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tilt Screen</Text>
      <Image source={require("./images/tilt1.png")} style={styles.image} />
      <Text style={styles.message}>
        Tilt your phone 90° to the right to proceed.
      </Text>

      {/* Testing: Display cumulative angles */}
      <Text style={styles.info}>
        Cumulative Rotation (degrees) since Start:
        {"\n"}x: {anglesDeg.x.toFixed(2)}°,
        {"\n"}y: {anglesDeg.y.toFixed(2)}°,
        {"\n"}z: {anglesDeg.z.toFixed(2)}°
      </Text>
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
  },
});
