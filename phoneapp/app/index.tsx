import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Accelerometer, Gyroscope } from "expo-sensors";

export default function OrientationApp() {
  const [accelerometerData, setAccelerometerData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [zeroedData, setZeroedData] = useState({ pitch: 0, roll: 0, yaw: 0 });
  const [isCentered, setIsCentered] = useState(false);
  const [cumulativeYaw, setCumulativeYaw] = useState(0);

  useEffect(() => {
    // Start listening to accelerometer updates
    Accelerometer.setUpdateInterval(100); // Update every 100ms
    const accelSubscription = Accelerometer.addListener((data) => {
      setAccelerometerData(data);
    });

    // Start listening to gyroscope updates
    Gyroscope.setUpdateInterval(100); // Update every 100ms
    const gyroSubscription = Gyroscope.addListener((data) => {
      setGyroscopeData(data);

      // Integrate gyroscope z-axis for yaw (raw integration in radians/sec * time)
      // Note: This will drift over time unless you fuse with other sensors
      setCumulativeYaw((prevYaw) => prevYaw + data.z * (100 / 1000));
    });

    // Cleanup listeners on component unmount
    return () => {
      accelSubscription.remove();
      gyroSubscription.remove();
    };
  }, []);

  const calculatePitchAndRoll = (x, y, z) => {
    const pitch = Math.atan2(-z, Math.sqrt(x * x + y * y)) * (180 / Math.PI);
    const roll = Math.atan2(x, Math.sqrt(y * y + z * z)) * (180 / Math.PI);
    return { pitch, roll };
  };

  const handleCenter = () => {
    // Calculate pitch and roll for the current accelerometer data
    const { pitch, roll } = calculatePitchAndRoll(
      accelerometerData.x,
      accelerometerData.y,
      accelerometerData.z
    );
    // Set zeroed data, including the current cumulative yaw
    setZeroedData({ pitch, roll, yaw: cumulativeYaw });
    setIsCentered(true);
  };

  const getDisplacement = () => {
    const { pitch, roll } = calculatePitchAndRoll(
      accelerometerData.x,
      accelerometerData.y,
      accelerometerData.z
    );
    return {
      pitch: pitch - zeroedData.pitch,
      roll: roll - zeroedData.roll,
      yaw: cumulativeYaw - zeroedData.yaw,
    };
  };

  const displacement = isCentered
    ? getDisplacement()
    : { pitch: 0, roll: 0, yaw: 0 };

  return (
    <View style={styles.container}>
      {!isCentered ? (
        <>
          <Text style={styles.title}>Hold Your Phone Upright</Text>
          <Text style={styles.subtitle}>
            Hold the phone parallel to your face (perpendicular to the ground),
            then press the button to zero the orientation.
          </Text>
          <Button title="Zero and Begin" onPress={handleCenter} />
        </>
      ) : (
        <>
          <Text style={styles.title}>Angular Displacement</Text>
          <Text style={styles.data}>
            Pitch: {displacement.pitch.toFixed(2)}°
          </Text>
          <Text style={styles.data}>Roll: {displacement.roll.toFixed(2)}°</Text>
          <Text style={styles.data}>Yaw: {displacement.yaw.toFixed(2)}°</Text>

          {/* New line to display the raw gyroscope values */}
          <Text style={styles.data}>
            Gyroscope — X: {gyroscopeData.x.toFixed(2)}, Y:{" "}
            {gyroscopeData.y.toFixed(2)}, Z: {gyroscopeData.z.toFixed(2)}
          </Text>

          <Text style={styles.instructions}>
            Tilt and rotate the phone to see the angular displacement from the
            zeroed position.
          </Text>
          <Button title="Reset" onPress={() => setIsCentered(false)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  data: {
    fontSize: 18,
    marginVertical: 5,
  },
  instructions: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});
