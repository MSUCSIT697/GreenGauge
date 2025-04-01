import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [calcMenuOpen, setCalcMenuOpen] = useState(false);
  const { isLoggedIn, handleLogout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const accountDropdownRef = useRef(null);
  const calcDropdownRef = useRef(null);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "FAQs", path: "/faqs" },
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)
      ) {
        setAccountMenuOpen(false);
      }
      if (
        calcDropdownRef.current && !calcDropdownRef.current.contains(event.target)
      ) {
        setCalcMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToManualCalc = () => {
    if (isLoggedIn) {
      navigate("/calculator");
    } else {
      navigate("/guest-calculator");
    }
    setCalcMenuOpen(false);
  };

  const goToUpload = () => {
    navigate("/dashboard", { state: { openUpload: true } });
    setCalcMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-xl font-bold text-primary">GreenGauge</Link>
  
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center justify-center space-x-6 flex-1">
          {/* Home */}
          <Link
            to="/"
            className={`text-gray-700 hover:text-primary font-medium ${
              location.pathname === "/" ? "border-b-2 border-primary" : ""
            }`}
          >
            Home
          </Link>
  
          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={`text-gray-700 hover:text-primary font-medium ${
              location.pathname === "/dashboard" ? "border-b-2 border-primary" : ""
            }`}
          >
            Dashboard
          </Link>
  
          {/* New Calculation Dropdown */}
          <div className="relative" ref={calcDropdownRef}>
            <button
              onClick={() => setCalcMenuOpen((prev) => !prev)}
              className="text-gray-700 hover:text-primary font-medium"
            >
              New Calculation ▾
            </button>
            {calcMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md z-50">
                {isLoggedIn && (
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={goToUpload}
                  >
                    Upload PDF
                  </button>
                )}
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={goToManualCalc}
                >
                  Manual Calculator
                </button>
              </div>
            )}
          </div>
  
          {/* FAQs */}
          <Link
            to="/faqs"
            className={`text-gray-700 hover:text-primary font-medium ${
              location.pathname === "/faqs" ? "border-b-2 border-primary" : ""
            }`}
          >
            FAQs
          </Link>
        </div>
  
        {/* Account Dropdown */}
        {isLoggedIn ? (
          <div className="relative" ref={accountDropdownRef}>
            <button
              onClick={() => setAccountMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 text-gray-900"
            >
              <UserCircleIcon className="h-6 w-6" />
              <span className="text-sm font-semibold">Account ▾</span>
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
                  onClick={handleLogout}
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
          {/* New Calculation Buttons */}
          <div className="pt-2 border-t border-gray-300">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={goToUpload}
            >
              Upload PDF
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={goToManualCalc}
            >
              Manual Calculator
            </button>
          </div>
  
          {/* Mobile Account Dropdown */}
          {isLoggedIn ? (
            <div className="border-t border-gray-300 pt-2">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
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
