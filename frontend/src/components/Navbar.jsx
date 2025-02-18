import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const location = useLocation(); // Get current route

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/Dashboard" },
    { name: "Calculator", path: "/calculator" },
    { name: "FAQs", path: "/faqs" },
  ];

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

        {/* Account Dropdown Menu */}
        <div className="relative hidden md:block">
          <button onClick={() => setAccountMenuOpen(!accountMenuOpen)} className="flex items-center gap-2">
            <UserCircleIcon className="h-6 w-6 text-gray-900" />
            <span className="text-sm font-semibold text-gray-900">Account</span>
          </button>
          {accountMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md">
              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </Link>
              <button onClick={() => alert("Logout clicked")} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                Logout
              </button>
            </div>
          )}
        </div>

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
          {/* Mobile Account Dropdown */}
          <div className="border-t border-gray-300 pt-2">
            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Profile
            </Link>
            <button onClick={() => alert("Logout clicked")} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
