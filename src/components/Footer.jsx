import React from "react";

const Footer = () => {
  return (
    <footer  className="bg-gray-900 text-gray-300 py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        <div>
          <h4 className="text-white font-semibold mb-3">About Us</h4>
          <p className="text-gray-400 mb-4">
            BreezeHome connects homeowners with trusted, local workers for all home service needs.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">How It Works</a></li>
            <li><a href="#" className="hover:underline">Professionals</a></li>
            <li><a href="#" className="hover:underline">Testimonials</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Services</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Electrical</a></li>
            <li><a href="#" className="hover:underline">Plumbing</a></li>
            <li><a href="#" className="hover:underline">HVAC</a></li>
            <li><a href="#" className="hover:underline">Carpentry</a></li>
            <li><a href="#" className="hover:underline">Cleaning</a></li>
          </ul>
        </div>
        <div>
          <h4 id="contact" className="text-white font-semibold mb-3">Contact Us</h4>
          <p className="text-gray-400">Kanapathiyappulam,<br/>Kopay Center,<br />Kopay</p>
          <p className="text-gray-400 mt-2">Phone:077-4583973</p>
          <p className="text-gray-400">Email: BreezeHome@gmail.com</p>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs mt-10">
        © 2025 BreezeHome. All rights reserved. | <a href="#" className="underline">Privacy Policy</a> | <a href="#" className="underline">Terms of Service</a>
      </div>
    </footer>
  );
};

export default Footer;
