// Navbar.jsx
import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const { isLoggedIn, handleLogout } = useContext(AuthContext); // Use AuthContext
  const location = useLocation();
  const dropdownRef = useRef(null);


  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Calculator", path: isLoggedIn ? "/calculator" : "/guest-calculator" },
    { name: "FAQs", path: "/faqs" },
  ];

  // Add this effect to handle outside clicks
useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setAccountMenuOpen(false);
    }
  };

  // Add when mounted
  document.addEventListener("mousedown", handleClickOutside);
  // Clean up on unmount
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-xl font-bold text-primary">GreenGauge</Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-gray-700 hover:text-primary font-medium ${
                location.pathname === item.path ? "border-b-2 border-primary" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Account Dropdown Menu (Only if logged in) */}
        {isLoggedIn ? (
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setAccountMenuOpen(!accountMenuOpen);
              }} 
              className="flex items-center gap-2"
            >
              <UserCircleIcon className="h-6 w-6 text-gray-900" />
              <span className="text-sm font-semibold text-gray-900">Account</span>
            </button>
            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md z-50">
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setAccountMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }} 
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/sign-in" className="text-sm font-semibold text-gray-900">
            Sign In
          </Link>
        )}

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2 bg-gray-100 rounded-lg p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block text-gray-700 hover:text-primary font-medium ${
                location.pathname === item.path ? "text-primary" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {/* Mobile Account Dropdown (Only if logged in) */}
          {isLoggedIn ? (
            <div className="border-t border-gray-300 pt-2">
              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </Link>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/sign-in" className="block text-sm font-semibold text-gray-900">
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}