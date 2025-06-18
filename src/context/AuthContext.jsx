// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Prevent flicker on page refresh

  // 🔄 Refresh token on first app load (e.g. after page reload)
  useEffect(() => {
    const verifyAndRefreshToken = async () => {
      try {
        const res = await axios.post(
          "/auth/refresh",
          {},
          { withCredentials: true } // Important to send cookies!
        );
        const accessToken = res.data?.accessToken;
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          setIsLoggedIn(true);
        } else {
          throw new Error("No accessToken received");
        }
      } catch (err) {
        console.error("❌ Token refresh failed:", err.message);
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAndRefreshToken();
  }, []);

  // 🔐 Login: set token and login state
  const login = (accessToken) => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      setIsLoggedIn(true);
    }
  };

  // 🚪 Logout: call backend + clear local state
  const logout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("❌ Logout failed:", err.message);
    } finally {
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
    }
  };

  return (
 
  <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
    {children} {/* Always show children, handle redirect in route */}
  </AuthContext.Provider>
);

  );
};

export const useAuth = () => useContext(AuthContext);
