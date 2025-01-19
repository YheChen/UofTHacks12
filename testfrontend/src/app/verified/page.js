"use client";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function VerifiedPage() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    console.log("User has been verified and navigated to /verified.");

    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <h1>Verification Complete!</h1>
      <p>You are now logged in!</p>
      <Confetti
        width={windowDimensions.width}
        height={windowDimensions.height}
      />
    </div>
  );
}
