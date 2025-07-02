import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import electricianImg from "../assets/electrician.jpg";
import plumberImg from "../assets/Plumber.jpg";
import hvacImg from "../assets/HVAC.jpg";
import bgImg from "../assets/backpic.jpg";
import { useNavigate } from "react-router-dom";

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

  // Book Now button logic
  const handleBookNow = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate('/booking');
    }
  };

  return (
  <div className="font-sans">
    <Navbar />
    {/* Hero Section */}
    <section
      className="text-white py-20 animate-fadein"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slidein drop-shadow">
          Your Trusted Home Service Professionals
        </h1>
        <p className="text-lg md:text-xl mb-6 animate-slidein delay-100">
          Connecting homeowners with local workers for all your home service needs
        </p>
      </div>
    </section>

    {/* Our Services Section */}
    <section id="services" className="py-16 bg-gray-100 text-center animate-fadein">
      <h2 className="text-3xl font-bold mb-2 animate-slidein">Our Services</h2>
      <p className="mb-10 text-gray-600 animate-slidein delay-100">Browse our most popular home service categories</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300 animate-pop"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 text-left">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">{service.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{service.description}</p>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm transition-transform duration-200 hover:scale-105 shadow"
                  onClick={handleBookNow}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <button
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition animate-pop"
          onClick={() => navigate("/categories")}
        >
          Explore More Services
        </button>
      </div>
    </section>

    {/* How It Works Section */}
    <section id="how-it-works" className="bg-blue-50 py-16 text-center animate-fadein">
      <h2 className="text-3xl font-bold mb-4 animate-slidein">How It Works</h2>
      <p className="text-gray-600 mb-10 animate-slidein delay-100">
        Get your home service needs taken care of in just a few simple steps
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto px-6">
        {[
          { number: '1', title: 'Search Services', text: 'Find the perfect professional for your specific home service need.' },
          { number: '2', title: 'Book Appointment', text: 'Schedule a time that works best for you with our easy online booking.' },
          { number: '3', title: 'Get It Done', text: 'Your professional arrives on time and completes the job to your satisfaction.' }
        ].map((step, idx) => (
          <div key={idx} className="text-center animate-pop" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white text-lg flex items-center justify-center mx-auto mb-4 font-bold shadow">
              {step.number}
            </div>
            <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
            <p className="text-gray-600 text-sm">{step.text}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Featured Professionals Section */}
    <section id="professionals" className="py-16 bg-white text-center animate-fadein">
      <h2 className="text-3xl font-bold mb-2 animate-slidein">Featured Professionals</h2>
      <p className="text-gray-600 mb-10 animate-slidein delay-100">Meet some of our top-rated service providers</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {professionals.map((pro, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden text-left animate-pop"
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            <img src={pro.image} alt={pro.name} className="w-full h-56 object-cover" />
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900">{pro.name}</h3>
              <p className="text-blue-600 text-sm mb-1">{pro.title}</p>
              <p className="text-gray-500 text-sm mb-3">{pro.location}</p>
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <div><span className="font-semibold">{pro.rating}</span><br /><span className="text-xs text-gray-400">Rating</span></div>
                <div><span className="font-semibold">{pro.jobs}</span><br /><span className="text-xs text-gray-400">Jobs</span></div>
                <div><span className="font-semibold">{pro.years}</span><br /><span className="text-xs text-gray-400">Years</span></div>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded transition-transform duration-200 hover:scale-105 shadow">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Testimonials Section */}
    <section id="testimonials" className="bg-blue-50 py-16 text-center animate-fadein">
      <h2 className="text-3xl font-bold mb-4 animate-slidein">What Our Customers Say</h2>
      <p className="text-gray-600 mb-10 animate-slidein delay-100">
        Hear from homeowners who’ve used our service
      </p>
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-md p-6 animate-pop">
        <p className="text-gray-700 italic mb-4">
          “The HVAC technician was knowledgeable and honest. He could have sold me a new unit but instead fixed my existing one at a fraction of the cost.”
        </p>
        <div className="flex items-center gap-4 justify-center">
          <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Maria Garcia" className="w-10 h-10 rounded-full" />
          <div className="text-left">
            <p className="font-semibold text-sm text-gray-900">Maria Garcia</p>
            <p className="text-xs text-gray-500">Homeowner, Miami</p>
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="bg-blue-600 py-16 text-center text-white animate-fadein">
      <h2 className="text-3xl font-bold mb-2 animate-slidein">Ready to Get Started?</h2>
      <p className="mb-6 animate-slidein delay-100">
        Join thousands of satisfied homeowners who trust HomeService Pro for their home service needs.
      </p>
      <button
        className="bg-white text-blue-500 font-medium px-6 py-3 rounded hover:bg-blue-500 hover:text-white transition animate-pop"
        onClick={() => navigate("/signup")}
      >
        Register Now
      </button>
    </section>

    <Footer />

    {/* Animations */}
    <style>{`
      .animate-fadein { animation: fadein 1s; }
      @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
      .animate-slidein { animation: slidein 0.8s; }
      @keyframes slidein { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      .animate-pop { animation: pop 0.5s; }
      @keyframes pop { 0% { transform: scale(0.7); opacity: 0; } 80% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
      .delay-100 { animation-delay: 0.1s; }
    `}</style>
  </div>
)};
export default HomePage;