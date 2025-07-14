import React from "react";
import { motion } from "framer-motion";
import { 
  FaFacebook, FaTwitter, FaInstagram, 
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt,
  FaArrowRight
} from "react-icons/fa";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 pt-20 pb-12 px-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6"
        >
          {/* About Us */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-white font-bold text-xl tracking-wider pb-2 relative inline-block">
              <span className="relative">
                About Us
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
              </span>
            </h4>
            <p className="text-gray-400 leading-relaxed">
              BreezeHome connects homeowners with trusted, local workers for all home service needs.
            </p>
            <div className="flex gap-5">
              {[
                { icon: <FaFacebook className="w-5 h-5" />, color: "hover:text-blue-500" },
                { icon: <FaTwitter className="w-5 h-5" />, color: "hover:text-blue-400" },
                { icon: <FaInstagram className="w-5 h-5" />, color: "hover:text-pink-500" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -3 }}
                  className={`text-gray-400 ${social.color} transition-colors duration-300`}
                  aria-label={`Social media ${index}`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-white font-bold text-xl tracking-wider pb-2 relative inline-block">
              <span className="relative">
                Quick Links
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
              </span>
            </h4>
            <ul className="space-y-4">
              {["How It Works", "About", "Testimonials", "Contact"].map((item, index) => (
                <motion.li 
                  key={item}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <FaArrowRight className="w-3 h-3 mr-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-white font-bold text-xl tracking-wider pb-2 relative inline-block">
              <span className="relative">
                Our Services
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
              </span>
            </h4>
            <ul className="space-y-4">
              {["Electrical", "Plumbing", "HVAC", "Carpentry", "Cleaning"].map((service) => (
                <motion.li 
                  key={service}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 transform group-hover:scale-125 transition-transform"></span>
                    {service}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Us */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-white font-bold text-xl tracking-wider pb-2 relative inline-block">
              <span className="relative">
                Contact Us
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
              </span>
            </h4>
            <div className="space-y-4 text-gray-400">
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-start"
              >
                <FaMapMarkerAlt className="flex-shrink-0 mt-1 mr-4 text-blue-400" />
                <p>Kanapathiyappulam,<br/>Kopay Center,<br />Kopay</p>
              </motion.div>
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-center"
              >
                <FaPhoneAlt className="flex-shrink-0 mr-4 text-blue-400" />
                <p>Phone: 077-4583973</p>
              </motion.div>
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-center"
              >
                <FaEnvelope className="flex-shrink-0 mr-4 text-blue-400" />
                <p>Email: BreezeHome@gmail.com</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 mt-16 pt-8 text-center"
        >
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-gray-500">
            <span>© {new Date().getFullYear()} BreezeHome. All rights reserved.</span>
            <span className="hidden md:inline text-gray-600">|</span>
            <a 
              href="#" 
              className="hover:text-blue-400 transition-colors duration-200 hover:underline"
            >
              Privacy Policy
            </a>
            <span className="hidden md:inline text-gray-600">|</span>
            <a 
              href="#" 
              className="hover:text-blue-400 transition-colors duration-200 hover:underline"
            >
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;