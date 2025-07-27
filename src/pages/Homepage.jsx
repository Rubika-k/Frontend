import bgImg from "../assets/hero.jpg";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { FaArrowUp, FaUsers, FaStar, FaHome, FaChevronRight, FaSearch, FaChevronDown, FaCheckCircle, FaUserClock, FaSmile } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  },
  hover: {
    y: -5,
    scale: 1.03,
    transition: { duration: 0.2 }
  }
};

// Service data
const servicesData = [
  { id: 1, name: "Carpenter", icon: "🔨" },
  { id: 2, name: "Painter", icon: "🎨" },
  { id: 3, name: "Welder", icon: "🔧" },
  { id: 4, name: "Cook", icon: "🍳" },
  { id: 5, name: "Gardener", icon: "🌿" },
  { id: 6, name: "Barber", icon: "💇" },
  { id: 7, name: "Electrician", icon: "⚡️" },
  { id: 8, name: "Driver", icon: "🚗" },
  { id: 9, name: "Mechanic", icon: "🛠️" },
  { id: 10, name: "Plumber", icon: "🚰" },
  { id: 11, name: "Mason", icon: "🧱" },
  { id: 12, name: "Roofer", icon: "🏠" },
  { id: 13, name: "Babysitter", icon: "👶" },
  { id: 14, name: "AC Mechanic", icon: "❄️" },
  { id: 15, name: "House Cleaner", icon: "🧹" }
];

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const controls = useAnimation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const scrollTopRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Initialize animations
  useEffect(() => {
    const sequence = async () => {
      await controls.start("visible");
      setTimeout(() => setShowExplore(true), 1500);
    };
    sequence();
  }, [controls]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Show/hide scroll button
  useEffect(() => {
    const checkScroll = () => {
      if (!showScrollTop && window.pageYOffset > 400) {
        setShowScrollTop(true);
      } else if (showScrollTop && window.pageYOffset <= 400) {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, [showScrollTop]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      message: "",
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    } else if (!/^[A-Za-z ]{3,}$/.test(formData.name)) {
      newErrors.name = "Name must be at least 3 letters";
      valid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
      newErrors.email = "Please enter a valid Gmail address";
      valid = false;
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      valid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("❌ Please fix the errors in the form");
      return;
    }

    const toastId = toast.loading("Sending your message...");

    try {
      const res = await fetch("/api/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.update(toastId, {
          render: "✅ Message sent successfully!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
        // Clear form after successful submission
        setFormData({
          name: "",
          email: "",
          message: "",
        });
        setFormErrors({
          name: "",
          email: "",
          message: "",
        });
      } else {
        toast.update(toastId, {
          render: `❌ ${data.message || "Failed to send message"}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
      }
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        render: "❌ Network error. Please try again later.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    }
  };

  return (
    <div className="font-sans bg-white relative">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <Navbar />

      {/* Hero Section */}
      <motion.section id="hero"
        className="relative text-white py-32 min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.1)), url(${bgImg})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-6xl mx-auto px-6 text-center relative z-10"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Your Trusted Home Service <span className="text-blue-400">Professionals</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Connecting homeowners with local workers for all your home service needs
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform shadow-lg hover:shadow-xl"
          >
            Explore Services
          </motion.button>
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-0 right-0 flex justify-center"
        >
          <button
            onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-blue-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <FaChevronDown className="text-xl" />
          </button>
        </motion.div>
      </motion.section>

      {/* About Us Section */}
      <section className="py-20 bg-gradient-to-b from-blue-100 to-white" id="about-us">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">About <span className="text-blue-600">Us</span></h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Trusted home service professionals since 2025</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Our team"
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Making Your House As Good As New</h3>

              <div className="space-y-6">
                {[
                  { icon: <FaUsers className="text-xl" />, title: "Our Team", text: "We carefully vet all professionals to ensure you get the best service." },
                  { icon: <FaStar className="text-xl" />, title: "Our Promise", text: "100% satisfaction guarantee on all services." },
                  { icon: <FaHome className="text-xl" />, title: "Our Mission", text: "To make home maintenance effortless with trusted professionals." }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 mt-1">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800 mb-2">{item.title}</h4>
                      <p className="text-gray-600">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-blue-100 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Our  <span className="text-blue-600">Services</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Choose from our wide range of professional services</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12"
          >
            {servicesData.map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover="hover"
                className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border border-gray-100 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/workers?category=${service.id}`)}
              >
                <span className="text-4xl mb-3">{service.icon}</span>
                <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
              </motion.div>
            ))}
          </motion.div>

          {showExplore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const token = localStorage.getItem('token');
                  if (token) {
                    navigate('/categories');
                  } else {
                    navigate('/login');
                  }
                }}
                className="group relative inline-flex items-center overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-3 text-white shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all"
              >
                <span className="absolute right-0 translate-x-full transition-transform group-hover:-translate-x-4">
                  <FaSearch className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium transition-all group-hover:mr-4">
                  Explore More
                </span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-blue-100 to-white" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">How It <span className="text-blue-600">Works</span></h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Simple steps to get your home services</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {[
              {
                title: 'Choose Service',
                text: 'Select from our wide range of home services',
                icon: <FaCheckCircle className="w-8 h-8" />,
                color: 'bg-blue-100 text-blue-600'
              },
              {
                title: 'Book Professional',
                text: 'Select your preferred professional and time slot',
                icon: <FaUserClock className="w-8 h-8" />,
                color: 'bg-purple-100 text-purple-600'
              },
              {
                title: 'Enjoy Service',
                text: 'Relax while our professionals handle your needs',
                icon: <FaSmile className="w-8 h-8" />,
                color: 'bg-green-100 text-green-600'
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className={`bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 text-center relative overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 w-full h-1 ${step.color.replace('bg-', 'bg-opacity-40 ')}`}></div>
                <div className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center mx-auto mb-6`}>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    {step.icon}
                  </motion.div>
                </div>
                <div className="relative">
                  <span className="absolute -top-8 -left-4 text-8xl font-bold text-gray-100 z-0">
                    {idx + 1}
                  </span>
                  <h4 className="font-bold text-xl mb-3 text-gray-800 relative z-10">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 relative z-10">
                    {step.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-b from-blue-100 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Get In <span className="text-blue-600">Touch</span></h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">We'd love to hear from you! Reach out anytime.</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto"
          >
            {/* Contact Form */}
            <motion.div
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Send us a message</h3>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="Enter your name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="Enter your Gmail address"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full px-4 py-3 border ${formErrors.message ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="Enter your message (minimum 10 characters)"
                  />
                  {formErrors.message && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3.5 rounded-xl transition-all font-medium shadow-md"
                  type="submit"
                >
                  Send Message
                  <svg
                    className="w-4 h-4 ml-2 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Contact Information</h3>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: 'phone',
                    text: '+94 755430857',
                    description: 'Available 9AM - 6PM, Monday to Friday'
                  },
                  {
                    icon: 'email',
                    text: 'support@breezehome.com',
                    description: 'We respond within 24 hours'
                  },
                  {
                    icon: 'address',
                    text: 'Kanapathiyappulam, Kopay Center, Kopay',
                    description: 'Visit our office anytime'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-5 group">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600 mt-1 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {item.icon === 'phone' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                      ) : item.icon === 'email' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-lg">
                        {item.icon === 'phone' ? 'Phone' : item.icon === 'email' ? 'Email' : 'Address'}
                      </h4>
                      <p className="text-gray-900 font-medium">{item.text}</p>
                      <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}

                {/* Social Media Links */}
                <div className="pt-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Follow Us</h4>
                  <div className="flex gap-4">
                    {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                      <a
                        key={social}
                        href="#"
                        className="bg-gray-100 hover:bg-blue-100 p-3 rounded-full text-gray-600 hover:text-blue-600 transition-colors"
                        aria-label={social}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d={social === 'facebook' ?
                            "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" :
                            social === 'twitter' ?
                              "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" :
                                social === 'instagram' ?
                                  "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" :
                                    "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"} />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Premium Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { type: "spring", stiffness: 300, damping: 15 }
            }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <motion.button
              whileHover="hover"
              whileTap="tap"
              onClick={scrollToTop}
              className="group relative bg-gradient-to-br from-blue-600 to-blue-400 text-white p-4 rounded-full shadow-2xl flex items-center justify-center"
              aria-label="Scroll to top"
              style={{
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
              }}
            >
              <motion.span
                className="relative z-10"
                variants={{
                  hover: { y: -5 },
                  tap: { scale: 0.9 }
                }}
              >
                <FaArrowUp className="text-xl" />
              </motion.span>

              <motion.span
                className="absolute inset-0 rounded-full border-2 border-white/30"
                variants={{
                  hover: {
                    scale: 1.2,
                    opacity: 0,
                    transition: { duration: 1.5, repeat: Infinity }
                  }
                }}
              />

              <motion.span
                className="absolute inset-0 rounded-full bg-white/10"
                variants={{
                  hover: {
                    scale: 1.5,
                    opacity: 0,
                    transition: {
                      duration: 1.5,
                      repeat: Infinity,
                      delay: 0.3
                    }
                  }
                }}
              />

              <motion.span
                className="absolute right-full mr-2 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded whitespace-nowrap"
                initial={{ opacity: 0, x: 10 }}
                variants={{
                  hover: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.3 }
                  }
                }}
              >
                Back to Top
              </motion.span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default HomePage;