import React from "react";
import "./styles/ui.css";

export default function PiWalletStatus({ isLoggedIn, username, onLogin }) {
  return (
    <div className="wallet-status">
      {isLoggedIn ? (
        <p>
          🔒 Logged in as <strong>{username}</strong>
        </p>
      ) : (
        <button className="wallet-button" onClick={onLogin}>
          🔑 Login with Pi
        </button>
      )}
    </div>
  );
}
f;
