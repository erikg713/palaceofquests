import { useEffect, useState } from 'react';

/**
 * Custom hook to fetch authenticated user's information.
 * @returns {object|null} User information or null if not available.
 */
export function useUserInfo() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController(); // To abort the fetch on unmount
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No authentication token found.');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal, // Attach the abort signal
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      }
    };

    fetchUserInfo();

    return () => {
      controller.abort(); // Clean up the fetch on component unmount
    };
  }, []);

  return { user, error };
}
