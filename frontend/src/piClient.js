/**
 * Pi Network client — window.Pi (Pi SDK 2.0, loaded from the <script> tag in
 * index.html). There is no npm SDK import: the browser build of the Pi SDK is
 * served by Pi and injected as window.Pi inside Pi Browser / the Sandbox.
 *
 * Named export `PiNetwork` matches what the app imports; the default export
 * is the same object for convenience.
 */

let initialized = false;

/** Sandbox (testnet) unless VITE_PI_SANDBOX is explicitly 'false'. */
function useSandbox() {
  const v = import.meta.env.VITE_PI_SANDBOX;
  if (typeof v === 'string') return v.toLowerCase() !== 'false';
  return true;
}

function getPi() {
  if (typeof window === 'undefined') return null;
  return window.Pi || null;
}

/** Initialize the SDK once. Returns true when window.Pi is ready. */
export function initPi() {
  const Pi = getPi();
  if (!Pi) return false;
  if (initialized) return true;
  try {
    Pi.init({ version: '2.0', sandbox: useSandbox() });
    initialized = true;
    return true;
  } catch (err) {
    console.error('[Pi] Pi.init failed:', err);
    return false;
  }
}

export function isPiAvailable() {
  return getPi() !== null;
}

/**
 * Sign in with Pi. Resolves to the auth object ({ user, accessToken }) or
 * throws. The access token is kept in memory by the caller — never persisted.
 */
export async function authenticatePi(scopes = ['username']) {
  const Pi = getPi();
  if (!Pi) {
    throw new Error('Pi SDK not available — open this app in Pi Browser.');
  }
  initPi();
  return Pi.authenticate(scopes, onIncompletePaymentFound);
}

/**
 * Required callback for Pi.authenticate. Pi Payments have no backend wired
 * up yet, so an incomplete payment can only be surfaced honestly — nothing
 * is completed or charged from here.
 */
export function onIncompletePaymentFound(payment) {
  console.warn(
    '[Pi] Incomplete payment found; payments are not wired up yet. Payment id:',
    payment && payment.identifier
  );
}

/** The raw window.Pi object (or null outside Pi Browser / Sandbox). */
export const PiNetwork = {
  get raw() {
    return getPi();
  },
  init: initPi,
  authenticate: authenticatePi,
  isAvailable: isPiAvailable,
  onIncompletePaymentFound,
};

export default PiNetwork;
