import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import electricianImg from "../assets/electrician.jpg";
import plumberImg from "../assets/Plumber.jpg";
import hvacImg from "../assets/HVAC.jpg";
import bgImg from "../assets/backpic.jpg";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar, FaMapMarkerAlt, FaCheckCircle, FaArrowRight } from "react-icons/fa";

const HomePage = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: 'Electrical Services',
      description: 'Fixing wiring, fans, lighting and more.',
      rating: 4.5,
      image: electricianImg,
      key: 'electrical',
    },
    {
      title: 'Plumbing Services',
      description: 'Leaks, pipelines, and drainage solutions.',
      rating: 4.7,
      image: plumberImg,
      key: 'plumbing',
    },
    {
      title: 'HVAC Services',
      description: 'AC installation, repairs, and maintenance.',
      rating: 4.9,
      image: hvacImg,
      key: 'hvac',
    },
  ];

  const professionals = [
    {
      name: 'Michael Johnson',
      title: 'Master Electrician',
      location: 'New York, NY',
      rating: '4.9',
      jobs: '250+',
      years: '5',
      image: electricianImg,
    },
    {
      name: 'Sarah Williams',
      title: 'Licensed Plumber',
      location: 'Chicago, IL',
      rating: '4.8',
      jobs: '180+',
      years: '3',
      image: plumberImg,
    },
    {
      name: 'David Rodriguez',
      title: 'HVAC Technician',
      location: 'Houston, TX',
      rating: '5.0',
      jobs: '300+',
      years: '7',
      image: hvacImg,
    }
  ];

  const handleBookNow = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate('/booking');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 inline" />);
      }
    }
    
    return stars;
  };

  return (
    <div className="font-sans bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section
        className="relative text-white py-32 min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.1)), url(${bgImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadein drop-shadow-lg leading-tight">
            Your Trusted Home Service <span className="text-blue-400">Professionals</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fadein delay-100">
            Connecting homeowners with local workers for all your home service needs
          </p>
          <div className="flex gap-4 justify-center animate-fadein delay-200">
            <button 
              onClick={handleBookNow}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Book a Service
            </button>
            <button 
              onClick={() => navigate("/categories")}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Explore Services
            </button>
          </div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
          <button 
            onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-blue-600 p-2 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <FaArrowRight className="rotate-90" />
          </button>
        </div>
      </section>

      {/* Our Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Our <span className="text-blue-600">Services</span></h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our most popular home service categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="relative overflow-hidden h-60">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                </div>
                <div className="p-6 relative z-10 -mt-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-gray-800">{service.title}</h3>
                    <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {renderStars(service.rating)}
                      <span className="ml-1">{service.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3"
                    onClick={handleBookNow}
                  >
                    Book Now
                    <FaArrowRight className="transition-all duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <button
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
              onClick={() => navigate("/categories")}
            >
              Explore All Services
              <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">How It <span className="text-blue-600">Works</span></h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get your home service needs taken care of in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                number: '1', 
                title: 'Search Services', 
                text: 'Find the perfect professional for your specific home service need.',
                icon: <svg className="w-8 h-8 text-blue-600 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              },
              { 
                number: '2', 
                title: 'Book Appointment', 
                text: 'Schedule a time that works best for you with our easy online booking.',
                icon: <svg className="w-8 h-8 text-blue-600 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              },
              { 
                number: '3', 
                title: 'Get It Done', 
                text: 'Your professional arrives on time and completes the job to your satisfaction.',
                icon: <svg className="w-8 h-8 text-blue-600 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              }
            ].map((step, idx) => (
              <div 
                key={idx} 
                className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-xl flex items-center justify-center mx-auto mb-6 font-bold shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  {step.icon}
                </div>
                <h4 className="font-bold text-xl text-center mb-3 text-gray-800">{step.title}</h4>
                <p className="text-gray-600 text-center">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Professionals Section */}
      <section id="professionals" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Featured <span className="text-blue-600">Professionals</span></h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet some of our top-rated service providers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {professionals.map((pro, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={pro.image} 
                    alt={pro.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-semibold shadow-md flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    {pro.rating}
                  </div>
                </div>
                <div className="p-6 relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{pro.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{pro.title}</p>
                  <div className="flex items-center text-gray-500 mb-4">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{pro.location}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="font-bold text-gray-800">{pro.jobs}</div>
                      <div className="text-xs text-gray-500">Jobs</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="font-bold text-gray-800">{pro.years}+</div>
                      <div className="text-xs text-gray-500">Years Exp</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="font-bold text-gray-800">100%</div>
                      <div className="text-xs text-gray-500">Satisfaction</div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3">
                    View Profile
                    <FaArrowRight className="transition-all duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Customer <span className="text-blue-600">Testimonials</span></h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from homeowners who've used our service
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-2xl p-1">
            <div className="bg-white rounded-lg p-8">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-lg italic mb-6">
                "The HVAC technician was knowledgeable and honest. He could have sold me a new unit but instead fixed my existing one at a fraction of the cost."
              </p>
              <div className="flex items-center gap-4">
                <img 
                  src="https://randomuser.me/api/portraits/women/65.jpg" 
                  alt="Maria Garcia" 
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-500" 
                />
                <div>
                  <p className="font-bold text-gray-900">Rubika</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" />
                    Verified Homeowner, Kopay
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied homeowners who trust our platform for their home service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => navigate("/signup")}
            >
              Register Now
            </button>
            <button
              className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              onClick={handleBookNow}
            >
              Book a Service
            </button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Animations */}
      <style>{`
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slidein { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pop { 0% { transform: scale(0.7); opacity: 0; } 80% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        
        .animate-fadein { animation: fadein 1s ease-out; }
        .animate-slidein { animation: slidein 0.8s ease-out; }
        .animate-pop { animation: pop 0.5s ease-out; }
        .animate-bounce { animation: bounce 2s infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
};

export default HomePage;