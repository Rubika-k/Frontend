import React from "react";
import { useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <div className="text-3xl font-bold text-gray-800">
        {/* <img src={logo} alt="Logo" className="h-20 w-auto inline-block mr-2" /> */}
        <span className="text-red-500">Home</span>
        <span className="text-blue-500">Breeze</span>
      </div>
      <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
        <li><a href="#services" className="hover:text-blue-500">Services</a></li>
        <li><a href="#how-it-works" className="hover:text-blue-500">How It Works</a></li>
        <li><a href="#professionals" className="hover:text-blue-500">Professionals</a></li>
        <li><a href="#testimonials" className="hover:text-blue-500">Testimonials</a></li>
        <li><a href="#contact" className="hover:text-blue-500">Contact</a></li>
      </ul>
      <div className="flex gap-3">
        <button onClick={() => navigate("/login")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Login</button>
        <button onClick={() => navigate("/signup")} className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 transition">SignUp</button>
      </div>
    </nav>
  );
}

export default Navbar;
