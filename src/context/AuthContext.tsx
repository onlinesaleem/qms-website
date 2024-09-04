// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/api/auth/me')
        .then(response => {
          console.log("User data set in context:", response.data);
          setUser(response.data);
        })
        .catch(() => {
          console.log("Failed to fetch user data.");
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false)); // Set loading to false after attempt
    } else {
      console.log("No token found in local storage.");
      setUser(null);
      setLoading(false); // No user, but done loading
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
