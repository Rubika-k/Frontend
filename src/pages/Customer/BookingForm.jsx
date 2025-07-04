import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axios from "@/config/axiosConfig";
import { useNavigate, useLocation } from 'react-router-dom';
import bgImg from '../../assets/back4.jpg';

const BookingForm = () => {
  const [form, setForm] = useState({
    workTitle: '',
    description: '',
    serviceLocation: '',
    preferredDate: '',
    preferredTime: '',
    estimatedHours: 1, // Changed to number default
    urgency: 'Medium',
    paymentOption: 'PayLater'
  });
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const workerId = params.get('workerId');
    const categoryParam = params.get('category');
    if (workerId) setSelectedWorker(workerId);
    if (categoryParam) setCategory(categoryParam);

    axios.get('/api/workers')
      .then(res => setWorkers(res.data || []))
      .catch(err => console.error("Error fetching workers:", err));
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'estimatedHours' ? parseInt(value) || 1 : value
    }));
  };

  const handleWorkerChange = (e) => {
    setSelectedWorker(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      setMessage('⚠️ Please log in before booking.');
      return;
    }
    if (!selectedWorker) {
      setMessage('Please select a worker.');
      return;
    }

    try {
      const bookingData = {
        ...form,
        userId,
        workerId: selectedWorker
      };

      await axios.post('/api/bookings', bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowModal(true);
    } catch (err) {
      console.error("Booking error:", err.response?.data);
      setMessage(err.response?.data?.message || 'Booking failed. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/customer/dashboard');
  };

  const filteredWorkers = category
    ? workers.filter(w => w.category?.toLowerCase() === category.toLowerCase())
    : workers;

  return (
    <div className="min-h-screen flex flex-col" style={{
      backgroundImage: `url(${bgImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <Navbar />
      <main className="flex-grow container mx-auto py-12 px-4">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-6 tracking-tight drop-shadow">
          Book a Service
        </h1>

        {message && (
          <p className="text-center text-red-600 mb-4 animate-pulse">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-8 space-y-5 border-t-8 border-blue-500">
          {/* Form fields remain exactly the same as your original */}
          <input
            name="workTitle"
            placeholder="Work Title"
            className="w-full border-2 border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
            onChange={handleChange}
            value={form.workTitle}
          />
          
          {/* Keep all other form fields exactly as you had them */}
          {/* ... */}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg font-bold text-lg shadow-md hover:scale-105 hover:shadow-blue-300 transition-transform duration-200"
          >
            Confirm Booking
          </button>
        </form>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm">
              <h2 className="text-2xl mb-2 font-bold text-green-600">✅ Booking Successful</h2>
              <p className="mb-4">Your request has been sent. Please wait for admin approval.</p>
              <button
                onClick={handleCloseModal}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BookingForm;