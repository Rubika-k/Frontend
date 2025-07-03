import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 px-6">
          {/* About Us */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg tracking-wider border-b border-blue-600 pb-2 inline-block">
              About Us
            </h4>
            <p className="text-gray-400 leading-relaxed">
              BreezeHome connects homeowners with trusted, local workers for all home service needs.
            </p>
            <div className="flex gap-4 mt-2">
              <a 
                href="#" 
                aria-label="Facebook" 
                className="text-gray-400 hover:text-blue-500 transition-colors duration-300 transform hover:scale-110"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                aria-label="Twitter" 
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                aria-label="Instagram" 
                className="text-gray-400 hover:text-pink-500 transition-colors duration-300 transform hover:scale-110"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg tracking-wider border-b border-blue-600 pb-2 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["How It Works", "Professionals", "Testimonials", "Contact"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg tracking-wider border-b border-blue-600 pb-2 inline-block">
              Services
            </h4>
            <ul className="space-y-3">
              {["Electrical", "Plumbing", "HVAC", "Carpentry", "Cleaning"].map((service) => (
                <li key={service}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-4">
            <h4 id="contact" className="text-white font-bold text-lg tracking-wider border-b border-blue-600 pb-2 inline-block">
              Contact Us
            </h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-start">
                <FaMapMarkerAlt className="flex-shrink-0 mt-1 mr-3 text-blue-400" />
                <p>Kanapathiyappulam,<br/>Kopay Center,<br />Kopay</p>
              </div>
              <div className="flex items-center">
                <FaPhoneAlt className="flex-shrink-0 mr-3 text-blue-400" />
                <p>Phone: 077-4583973</p>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="flex-shrink-0 mr-3 text-blue-400" />
                <p>Email: BreezeHome@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 text-sm text-gray-500">
            <span>© 2025 BreezeHome. All rights reserved.</span>
            <span className="hidden md:inline">|</span>
            <a 
              href="#" 
              className="hover:text-blue-400 transition-colors duration-200 hover:underline"
            >
              Privacy Policy
            </a>
            <span className="hidden md:inline">|</span>
            <a 
              href="#" 
              className="hover:text-blue-400 transition-colors duration-200 hover:underline"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;