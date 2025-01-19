import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import io from "socket.io-client";

// Adjust to your server URL/IP:
const socket = io("http://100.67.69.9:3001");

export default function ExamplePhoneApp() {
  const [showBegin, setShowBegin] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // On connect/disconnect
    socket.on("connect", () => {
      console.log("Phone connected to server");
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      console.log("Phone disconnected from server");
      setIsConnected(false);
    });

    // Listen for the "showBegin" event from the server
    socket.on("showBegin", () => {
      console.log("Received showBegin from server");
      setShowBegin(true);
    });

    // Cleanup listeners when unmounting
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("showBegin");
    };
  }, []);

  const handleBegin = () => {
    // Do whatever you need when "Begin" is pressed...
    alert("Begin Pressed!");
    // Potentially reset the button
    setShowBegin(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone App</Text>
      <Text>Status: {isConnected ? "Connected" : "Disconnected"}</Text>
      {showBegin ? (
        <Button title="Begin" onPress={handleBegin} />
      ) : (
        <Text>Awaiting prompt from web app...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
