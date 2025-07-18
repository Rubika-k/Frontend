import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUserPlus, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const handleHomeClick = () => {
    if (window.location.pathname === "/") {
      // Already on home — smooth scroll
      document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#hero");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow duration-300 border-b border-gray-100 m-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={handleHomeClick}
          >
            <div className="text-3xl font-bold flex items-center gap-1">
              <span className="text-red-500 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Breeze
              </span>
              <span className="text-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Home
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              {[
                { label: "Home", onClick: handleHomeClick },
                { label: "Services", href: "#services" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "About Us", href: "#about-us" },
                { label: "Contact", href: "#contact" },
              ].map((item) =>
                item.onClick ? (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="relative group text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="relative group text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                )
              )}
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
