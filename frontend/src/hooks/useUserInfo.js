import { useEffect, useState } from 'react';

export function useUserInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/auth/me', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(setUser);
  }, []);

  return user;
}
