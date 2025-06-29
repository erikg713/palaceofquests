export async function loginWithPi() {
  const scopes = ['username', 'payments'];
  return new Promise((resolve, reject) => {
    window.Pi.authenticate(scopes, onSuccess, onFailure);

    function onSuccess(auth) {
      fetch('/auth/pi-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(auth),
      })
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            localStorage.setItem('token', data.token);
            resolve(data);
          } else {
            reject(data);
          }
        });
    }

    function onFailure(error) {
      reject(error);
    }
  });
}
