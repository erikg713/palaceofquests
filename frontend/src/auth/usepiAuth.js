// src/auth/piAuth.js
export async function authenticateWithPi() {
  const scopes = ['username', 'payments'];
  const auth = await window.Pi.authenticate(scopes, () => {});
  return { user: { uid: auth.user.uid, username: auth.user.username } };
}
