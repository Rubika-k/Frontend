import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUserPlus, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow duration-300 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="text-3xl font-bold flex items-center gap-1">
              <span className="text-red-500 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Home
              </span>
              <span className="text-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Breeze
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              {[
                { label: "Services", href: "#services" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Professionals", href: "#professionals" },
                { label: "Testimonials", href: "#testimonials" },
                { label: "Contact", href: "#contact" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="relative group text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-4 ml-6">
              {token ? (
                <>
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-green-600 border border-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <FaUserCircle className="text-sm" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <FaSignOutAlt className="text-sm" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <FaUser className="text-sm" />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <FaUserPlus className="text-sm" />
                    <span>Sign Up</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
              aria-label="Main menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (if you want this dynamic, use a state toggle) */}
      <div className="hidden md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {[
            { label: "Services", href: "#services" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Professionals", href: "#professionals" },
            { label: "Testimonials", href: "#testimonials" },
            { label: "Contact", href: "#contact" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition duration-150 ease-in-out"
            >
              {item.label}
            </a>
          ))}

          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5 space-x-3">
              {token ? (
                <>
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full px-4 py-2 rounded-md text-center text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition duration-150 ease-in-out"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 rounded-md text-center text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition duration-150 ease-in-out"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full px-4 py-2 rounded-md text-center text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition duration-150 ease-in-out"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="w-full px-4 py-2 rounded-md text-center text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition duration-150 ease-in-out"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
