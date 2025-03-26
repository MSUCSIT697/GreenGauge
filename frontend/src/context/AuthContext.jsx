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
  const handleLogin = (data) => {
    localStorage.setItem("token", data.token); // Set token in localStorage
    localStorage.setItem("profile", JSON.stringify(data.profile)); // Set profile in localStorage
    setIsLoggedIn(true); // Update isLoggedIn state
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("profile"); // Remove profile from localStorage
    localStorage.removeItem("userResults"); // Remove userResults from localStorage
    setIsLoggedIn(false); // Update isLoggedIn state
    // Force a hard navigation to home page with full page reload
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};