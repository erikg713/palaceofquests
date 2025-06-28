/**
 * Pi Network Login Module
 * Handles Pi Network authentication for Palace of Quests
 *
 * @author Palace of Quests Team
 * @version 1.0.0
 */

"use strict";

// Configuration - should be set via environment variables in production
const piConfig = {
  clientId: window.PI_CLIENT_ID || "YOUR_CLIENT_ID",
  network: window.PI_NETWORK || "testnet",
  appName: "Palace of Quests",
};

// DOM element cache
let elements = {};

// State management
let isInitialized = false;
let isLoggingIn = false;

/**
 * Initialize Pi SDK
 * @returns {Promise<void>}
 */
async function initializePiSDK() {
  if (isInitialized || !window.Pi) {
    return;
  }

  try {
    Pi.init({
      version: "2.0",
      sandbox: piConfig.network === "testnet",
    });
    isInitialized = true;
  } catch (error) {
    console.error("Failed to initialize Pi SDK:", error);
    throw new Error("Pi SDK initialization failed");
  }
}

/**
 * Cache DOM elements for better performance
 */
function cacheElements() {
  elements = {
    loginBtn: document.getElementById("pi-login-btn"),
    statusMsg: document.getElementById("login-status"),
    spinner: document.getElementById("spinner"),
  };

  // Validate required elements exist
  if (!elements.loginBtn || !elements.statusMsg || !elements.spinner) {
    throw new Error("Required DOM elements not found");
  }
}

/**
 * Update login status message
 * @param {string} message - Status message to display
 * @param {boolean} isError - Whether this is an error message
 */
function setStatus(message, isError = false) {
  if (!elements.statusMsg) return;

  elements.statusMsg.textContent = message;
  elements.statusMsg.className = isError ? "error" : "";

  // Hide spinner on error
  if (isError) {
    showSpinner(false);
  }
}

/**
 * Toggle spinner visibility
 * @param {boolean} show - Whether to show the spinner
 */
function showSpinner(show = true) {
  if (!elements.spinner) return;

  elements.spinner.style.display = show ? "block" : "none";
  elements.spinner.setAttribute("aria-hidden", show ? "false" : "true");
}

/**
 * Set button state and accessibility attributes
 * @param {boolean} disabled - Whether the button should be disabled
 */
function setBtnState(disabled) {
  if (!elements.loginBtn) return;

  elements.loginBtn.disabled = disabled;

  if (disabled) {
    elements.loginBtn.setAttribute("aria-disabled", "true");
  } else {
    elements.loginBtn.removeAttribute("aria-disabled");
  }
}

/**
 * Send login data to backend API
 * @param {string} accessToken - Pi Network access token
 * @returns {Promise<void>}
 */
async function sendLoginToBackend(accessToken) {
  try {
    const response = await fetch("/api/pi-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend rejected login: ${errorText}`);
    }

    const data = await response.json();
    setStatus(`Welcome, ${data.username || "user"}!`);
  } catch (error) {
    setStatus(`Network error: ${error.message}`, true);
    throw error;
  }
}

/**
 * Main Pi Network login function
 * @returns {Promise<void>}
 */
async function loginWithPi() {
  // Prevent multiple simultaneous login attempts
  if (isLoggingIn) {
    return;
  }

  isLoggingIn = true;
  setStatus("Connecting to Pi Network…");
  setBtnState(true);
  showSpinner(true);

  try {
    // Ensure Pi SDK is available
    if (!window.Pi) {
      throw new Error("Pi SDK failed to load. Please refresh the page.");
    }

    // Initialize SDK if needed
    await initializePiSDK();

    // Get Pi account
    const { account } = await Pi.initializer({
      clientId: piConfig.clientId,
      network: piConfig.network,
    });

    // Request authentication
    const authResponse = await account.requestAuth({
      app: { name: piConfig.appName },
      permissions: [
        piConfig.network === "testnet" ? "testnet_access" : "mainnet_access",
      ],
    });

    // Handle authentication response
    if (authResponse.status === "success" && authResponse.account) {
      setStatus(`Logged in as: ${authResponse.account.username}`);
      await sendLoginToBackend(authResponse.accessToken);
    } else {
      throw new Error(authResponse.error || "Login failed. Please try again.");
    }
  } catch (error) {
    console.error("Pi login error:", error);
    setStatus(error.message || "Unexpected error during login.", true);
  } finally {
    isLoggingIn = false;
    setBtnState(false);
    showSpinner(false);
  }
}

/**
 * Handle keyboard events for accessibility
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyboard(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    loginWithPi();
  }
}

/**
 * Initialize the Pi login module
 */
function initPiLogin() {
  try {
    // Cache DOM elements
    cacheElements();

    // Add event listeners
    elements.loginBtn.addEventListener("click", loginWithPi);
    elements.loginBtn.addEventListener("keydown", handleKeyboard);

    // Optional: Auto-focus for accessibility
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        elements.loginBtn.focus();
      });
    } else {
      elements.loginBtn.focus();
    }
  } catch (error) {
    console.error("Failed to initialize Pi login:", error);
  }
}

// Export for potential module usage
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = {
    loginWithPi,
    initPiLogin,
  };
}

// Auto-initialize when script loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPiLogin);
} else {
  initPiLogin();
}
