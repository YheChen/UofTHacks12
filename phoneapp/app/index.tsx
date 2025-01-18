import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { Gyroscope } from "expo-sensors";

interface GyroData {
  x: number;
  y: number;
  z: number;
}

export default function GyroDisplacementExample() {
  // Store the raw gyroscope data (radians/sec)
  const [gyroData, setGyroData] = useState<GyroData>({ x: 0, y: 0, z: 0 });

  // Store the integrated angles (radians) since "Start"
  // (We will convert them to degrees if we want to display them as degrees.)
  const [cumulativeAngles, setCumulativeAngles] = useState<GyroData>({
    x: 0,
    y: 0,
    z: 0,
  });

  // Whether we are currently measuring
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);

  // We’ll keep track of the last timestamp so we can do dt = (currentTime - lastTime)
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    // Set the gyroscope update interval (milliseconds)
    Gyroscope.setUpdateInterval(100);

    const subscription = Gyroscope.addListener((data) => {
      setGyroData(data);

      if (isMeasuring) {
        // Calculate time delta in seconds
        const currentTime = Date.now();
        const dt = (currentTime - lastUpdateRef.current) / 1000;
        lastUpdateRef.current = currentTime;

        // Integrate: angle += angularVelocity * dt
        // data.x, data.y, data.z are in rad/s
        setCumulativeAngles((prev) => ({
          x: prev.x + data.x * dt,
          y: prev.y + data.y * dt,
          z: prev.z + data.z * dt,
        }));
      } else {
        // If not measuring, reset the reference time
        lastUpdateRef.current = Date.now();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isMeasuring]);

  const handleStart = () => {
    // Reset angles to zero
    setCumulativeAngles({ x: 0, y: 0, z: 0 });
    lastUpdateRef.current = Date.now();
    setIsMeasuring(true);
  };

  const handleStop = () => {
    setIsMeasuring(false);
  };

  // Convert integrated radians to degrees for display
  const anglesDeg = {
    x: (cumulativeAngles.x * 180) / Math.PI,
    y: (cumulativeAngles.y * 180) / Math.PI,
    z: (cumulativeAngles.z * 180) / Math.PI,
  };

  // If you want to see the raw gyro data (rad/s) displayed as well:
  //  - data.x, data.y, data.z

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gyroscope Displacement Demo</Text>

      {/* <Text style={styles.info}>
        Raw Gyroscope (rad/s):
        {"\n"}x: {gyroData.x.toFixed(3)}, y: {gyroData.y.toFixed(3)}, z:{" "}
        {gyroData.z.toFixed(3)}
      </Text> */}

      <Text style={styles.info}>
        Cumulative Rotation (degrees) since Start:
        {"\n"}x: {anglesDeg.x.toFixed(2)}°,
        {"\n"}y: {anglesDeg.y.toFixed(2)}°,
        {"\n"}z: {anglesDeg.z.toFixed(2)}°
      </Text>

      <View style={styles.buttonContainer}>
        {!isMeasuring ? (
          <Button title="Start" onPress={handleStart} />
        ) : (
          <Button title="Stop" onPress={handleStop} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 20,
  },
});
