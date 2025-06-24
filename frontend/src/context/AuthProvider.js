import { createContext, useContext, useState, useEffect } from "react";
import authAPI from "../api/AuthAPI";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const userData = await authAPI.getUserData(storedToken);
      setUser(userData);
      setToken(storedToken);
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
