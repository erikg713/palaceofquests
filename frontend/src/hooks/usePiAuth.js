import { useState, useEffect } from "react";

export const usePiAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simple mock implementation for build purposes
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  return { isLoggedIn, user };
};
