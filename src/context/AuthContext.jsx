// src/context/AuthContext.js
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // to prevent flicker on first load

  useEffect(() => {
    const verifyAndRefreshToken = async () => {
      try {
        const res = await axios.post("/auth/refresh");
        localStorage.setItem("accessToken", res.data.accessToken);
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
        localStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    };

    verifyAndRefreshToken();
  }, []);

  const login = (accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await axios.post("/auth/logout");
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
