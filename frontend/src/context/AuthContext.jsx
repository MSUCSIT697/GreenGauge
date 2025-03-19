// AuthContext.js
import React, { createContext, useState, useEffect } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Synchronize isLoggedIn with localStorage on component mount
  useEffect(() => {
    const authToken = localStorage.getItem("token");
    setIsLoggedIn(!!authToken);
  }, []);

  // Function to handle login
  const handleLogin = (token) => {
    localStorage.setItem("token", token); // Set token in localStorage
    setIsLoggedIn(true); // Update isLoggedIn state
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setIsLoggedIn(false); // Update isLoggedIn state
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};