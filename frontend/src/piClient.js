import Pi from "@pi-network/pi-sdk";

/**
 * Pi Network SDK Initialization
 *
 * This module sets up the Pi Network SDK for both production and sandbox (Pi Browser) environments.
 * The SDK version can be set via environment variable: REACT_APP_PI_SDK_VERSION (defaults to '2.0').
 */

// Centralized SDK version control
const PI_SDK_VERSION = process.env.REACT_APP_PI_SDK_VERSION || "2.0";

// Detect Pi Browser sandbox mode
function isPiBrowserSandbox() {
  if (typeof window === "undefined") return false;
  // Pi Browser may inject window.Pi or identify itself via user agent
  return (
    (window.Pi && window.Pi.isSandbox === true) ||
    /PiBrowser/i.test(window.navigator.userAgent)
  );
}

const piNetwork = Pi.init({
  version: PI_SDK_VERSION,
  sandbox: isPiBrowserSandbox(),
});

export default piNetwork;
