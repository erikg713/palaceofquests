// Simulate window.Pi in dev
export function mockPiSDK() {
  if (!window.Pi) {
    window.Pi = {
      authenticate: async () => {
        return { address: "pi_user_0x123456789" };
      },
    };
    console.log("⚠️ Using mock Pi SDK");
  }
}
