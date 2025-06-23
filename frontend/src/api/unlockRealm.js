// example: src/api/unlockRealm.js
axios.post('http://localhost:5000/unlock-realm', {
  user_id: piUser.uid,
  realm_id: 'moon_fortress'
});