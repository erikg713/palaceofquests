// Dev-only mock of window.Pi, installed by main.jsx when the real Pi SDK is
// absent in development. It is never used in production builds. The shape
// matches the real SDK 2.0 authenticate result: { user, accessToken }.
export function mockPiSDK() {
  if (typeof window === 'undefined' || window.Pi) return;
  window.Pi = {
    init: () => {},
    authenticate: async () => ({
      user: { username: 'dev_pioneer', uid: 'dev-uid-0001' },
      accessToken: 'dev-mock-token',
      version: '2.0',
    }),
    createPayment: async () => {
      throw new Error('Mock Pi SDK: payments are not available in dev mode.');
    },
  };
  console.log('[DEV] Using mock Pi SDK (dev_pioneer). Open in Pi Browser for real auth.');
}
