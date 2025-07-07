import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import electricianImg from "../assets/electrician.jpg";
import plumberImg from "../assets/Plumber.jpg";
import hvacImg from "../assets/HVAC.jpg";
import carpenterImg from "../assets/carpenter.jpeg";
import painterImg from "../assets/painter.jpeg";
import cleanerImg from "../assets/cleaner.jpeg";
import bgImg from "../assets/backpic.jpg";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar, FaMapMarkerAlt, FaCheckCircle, FaArrowRight, FaQuoteLeft, FaChevronDown } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "../config/axiosConfig";
import React, { useState, useEffect } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);  
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
   const [showAllServices, setShowAllServices] = useState(false);
  const [contactMsg, setContactMsg] = useState("");
  
  
 
  // Services data with actual worker counts
  const services = [
    {
      title: 'Electrical Services',
      description: 'Fixing wiring, fans, lighting and more.',
      image: electricianImg,
      key: 'electrical',
      workers: 42
    },
    {
      title: 'Plumbing Services',
      description: 'Leaks, pipelines, and drainage solutions.',
      image: plumberImg,
      key: 'plumbing',
      workers: 38
    },
    {
      title: 'HVAC Services',
      description: 'AC installation, repairs, and maintenance.',
      image: hvacImg,
      key: 'hvac',
      workers: 25
    },
    {
      title: 'Carpentry Services',
      description: 'Furniture repair and custom woodwork.',
      image: carpenterImg,
      key: 'carpentry',
      workers: 31
    },
    {
      title: 'Painting Services',
      description: 'Interior and exterior painting solutions.',
      image: painterImg,
      key: 'painting',
      workers: 29
    },
    {
      title: 'Cleaning Services',
      description: 'Deep cleaning and maintenance services.',
      image: cleanerImg,
      key: 'cleaning',
      workers: 47
    }
  ];

useEffect(() => {
  axios.get("/categories").then(res => {
    const updated = services.map(service => ({
      ...service,
      workers: res.data.find(c => c.key === service.key)?.workers || 0
    }));
    setServices(updated);
  });
}, []);



  const handleNavigation = (path) => {
    const token = localStorage.getItem('token');
    if (!token && path === '/categories') {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  const handleBookNow = (worker) => {
    navigate(`/booking?workerId=${worker.id}&category=${worker.category}`, {
      state: {
        workerName: worker.name,
        workerCategory: worker.category
      }
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Message sent successfully! Our team will get back to you soon.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      setContactForm({ name: '', email: '', message: '' });
      setContactMsg("Message sent successfully!");
    } catch (error) {
      toast.error('Failed to send message. Please try again later.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    // Fetch categories from backend
    axios.get("/categories").then(res => setCategories(res.data || []));
  }, []);

  const toggleCategoryExpand = (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  const handleViewWorkers = (categoryId, categoryName) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate(`/categories/${categoryId}?category=${encodeURIComponent(categoryName)}`);
    }
  };

  return (
    <div className="font-sans bg-white">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative text-white py-32 min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.1)), url(${bgImg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Trusted Home Service <span className="text-blue-400">Professionals</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Connecting homeowners with local workers for all your home service needs
          </p>
          <button
            onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Explore Services
          </button>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
          <button
            onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-blue-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <FaChevronDown className="text-xl" />
          </button>
        </div>
      </section>
{ /* Services Section */}
       <section id="services" className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl font-bold mb-10 text-center">Our <span className="text-blue-600">Services</span></h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {(showAllServices ? services : services.slice(0, 6)).map((s, i) => (
        <div key={i} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border">
          <img src={s.image} alt={s.title} className="w-full h-40 object-cover" />
          <div className="p-4">
            <h3 className="font-bold text-lg mb-1">{s.title}</h3>
            <p className="text-gray-600 mb-2">{s.description}</p>
            <p className="text-sm text-gray-500 mb-4">{s.workers} available workers</p>
            <button
              onClick={() => navigate(`/workers?category=${encodeURIComponent(s.title)}`)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              View Workers
            </button>
          </div>
        </div>
      ))}
    </div>

    {services.length > 6 && (
      <div className="text-center mt-6">
        <button
          onClick={() => setShowAllServices(!showAllServices)}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {showAllServices ? "Show Less" : "View All"}
        </button>
      </div>
    )}
  </div>
</section>
      {/* How It Works Section */}
      <section className="py-20 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">How It <span className="text-blue-600">Works</span></h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to get your home services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { 
                title: 'Choose Service', 
                text: 'Select from our wide range of home services',
                icon: <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              },
              { 
                title: 'Book Professional', 
                text: 'Select your preferred professional and time slot',
                icon: <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              },
              { 
                title: 'Enjoy Service', 
                text: 'Relax while our professionals handle your needs',
                icon: <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              }
            ].map((step, idx) => (
              <div 
                key={idx} 
                className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h4 className="font-bold text-xl mb-3 text-gray-800">{step.title}</h4>
                <p className="text-gray-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Contact <span className="text-blue-600">Us</span></h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions? We're here to help
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Send us a message</h3>
              <form className="space-y-4" onSubmit={handleContactSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    rows="4"
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your message"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 rounded-lg transition-colors flex items-center justify-center`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Phone</h4>
                    <p className="text-gray-600">+94 755430857</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Email</h4>
                    <p className="text-gray-600">support@breezehome.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Address</h4>
                    <p className="text-gray-600">Kanapathiyappulam,Kopay Center, Kopay.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="font-semibold text-gray-800 mb-3">Working Hours</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 8:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span>Emergency Only</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied homeowners today
          </p>
          <button
            onClick={() => handleNavigation('/categories')}
            className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-md"
          >
            Browse Services
          </button>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes bounce { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-10px); } 
        }
        @keyframes slidein { 
          from { transform: translateY(10px); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
        
        .animate-bounce { animation: bounce 2s infinite; }
        .animate-slidein { animation: slidein 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default HomePage;