// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Prevent flicker on first load

  // ✅ Called on first load to refresh token (if refreshToken exists in cookies)
  useEffect(() => {
    const verifyAndRefreshToken = async () => {
      try {
        const res = await axios.get("/auth/refresh"); // ✅ use GET instead of POST
        if (res.data?.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
          setIsLoggedIn(true);
        } else {
          throw new Error("No accessToken received");
        }
      } catch (err) {
        console.error("Token refresh failed:", err.message);
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAndRefreshToken();
  }, []);

  // ✅ Login: store token & update state
  const login = (accessToken) => {
    if (!accessToken) return;
    localStorage.setItem("accessToken", accessToken);
    setIsLoggedIn(true);
  };

  // ✅ Logout: clear cookies and state
  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err.message);
    } finally {
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
