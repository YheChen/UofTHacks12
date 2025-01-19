"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://100.67.69.9:3001"); // Adjust to your server URL

export default function Home() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Web app connected to server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Web app disconnected from server");
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const handleLoginClick = () => {
    // Emit an event that the server will relay to the phone
    socket.emit("triggerPhone");
  };

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h1>Web Login</h1>
      <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
      <button onClick={handleLoginClick}>Login</button>
    </div>
  );
}
