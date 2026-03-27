import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Safely grab the token, ensuring we don't treat the strings "null" or "undefined" as truthy
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken === "null" || storedToken === "undefined") return null;
    return storedToken;
  });

  const [user, setUser] = useState(() => {
    if (token) {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      try {
        setUser(JSON.parse(atob(token.split(".")[1])));
      } catch (e) {
        setUser(null);
      }
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  const login = (data) => {
    setToken(data.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token"); // ensure it's removed immediately
  };

  // Setup axio interceptor to auto-logout the user if any request returns exactly 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
