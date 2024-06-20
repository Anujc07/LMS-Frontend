import { useState, useEffect } from 'react';

export default function useAuth() {
  const [loggedIn, setLoggedIn] = useState(false); //false krna hai
  const [role, setRole] = useState('');

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('loggedIn');
    const storedRole = sessionStorage.getItem('role');
    if (storedLoggedIn && storedRole) {
      setLoggedIn(true);
      setRole(storedRole); 
    }
  }, []);

  const login = (role) => {
    setLoggedIn(true);
    setRole(role);
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('role', role);
  };

  const logout = () => {
    setLoggedIn(false);
    setRole('');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('role');
    window.location.reload();
  };

  return { loggedIn, role, login, logout };
}
