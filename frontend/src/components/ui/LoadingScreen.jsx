import React from "react";
import "./LoadingScreen.css";
import logo from "../assets/logos.png"; // Adjust path as needed

export default function LoadingScreen({ text = "Loading your quest..." }) {
  return (
    <div className="loading-screen">
      <img src={logo} alt="Game Logo" className="loading-logo" />
      <p className="loading-text">{text}</p>
    </div>
  );
}
