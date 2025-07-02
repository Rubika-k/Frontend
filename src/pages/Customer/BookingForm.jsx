import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axios from '../../axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';

const BookingForm = () => {
  const [form, setForm] = useState({
    workTitle: '',
    description: '',
    serviceLocation: '',
    preferredDate: '',
    preferredTime: '',
    estimatedHours: '',
    urgency: 'Medium',
    paymentOption: 'PayLater',
  });
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get workerId from query params if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const workerId = params.get('workerId');
    const categoryParam = params.get('category');
    if (workerId) setSelectedWorker(workerId);
    if (categoryParam) setCategory(categoryParam);

    axios.get('/api/workers').then(res => setWorkers(res.data || []));
  }, [location.search]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleWorkerChange = (e) => {
    setSelectedWorker(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId) {
      setMessage('⚠️ Please log in before booking.');
      return;
    }
    if (!selectedWorker) {
      setMessage('Please select a worker.');
      return;
    }

    try {
      await axios.post(
        '/api/bookings',
        { ...form, userId, workerId: selectedWorker },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/profile');
  };

  // Filter workers by category if category is set
  const filteredWorkers = category
    ? workers.filter(w => w.category && w.category.toLowerCase() === category.toLowerCase())
    : workers;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 animate-fadein">
      <Navbar />
      <main className="flex-grow container mx-auto py-12 px-4">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-6 tracking-tight drop-shadow animate-slidein">
          Book a Service
        </h1>

        {message && (
          <p className="text-center text-red-600 mb-4 animate-pulse">{message}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-8 space-y-5 border-t-8 border-blue-500 transition-all duration-300 hover:shadow-blue-200"
        >
          <input
            name="workTitle"
            placeholder="Work Title"
            className="w-full border-2 border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            className="w-full border-2 border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            rows="4"
            required
            onChange={handleChange}
          />
          <input
            name="serviceLocation"
            placeholder="Service Location"
            className="w-full border-2 border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
            onChange={handleChange}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              name="preferredDate"
              className="w-full border-2 border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
              onChange={handleChange}
            />
            <input
              type="time"
              name="preferredTime"
              className="w-full border-2 border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
              onChange={handleChange}
            />
          </div>
          <input
            type="number"
            name="estimatedHours"
            placeholder="Estimated Hours"
            className="w-full border-2 border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
            onChange={handleChange}
          />
          <select
            name="urgency"
            className="w-full border-2 border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={form.urgency}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select
            name="paymentOption"
            className="w-full border-2 border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={form.paymentOption}
            onChange={handleChange}
          >
            <option value="PayLater">Cash on Completion</option>
            <option value="PayNow">Pay Now</option>
          </select>
          {/* Worker selection */}
          {!selectedWorker && (
            <select
              className="w-full border-2 border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={selectedWorker}
              onChange={handleWorkerChange}
              required
            >
              <option value="">Select Worker</option>
              {filteredWorkers.map(w => (
                <option key={w._id} value={w._id}>
                  {w.fullName} ({w.category})
                </option>
              ))}
            </select>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg font-bold text-lg shadow-md hover:scale-105 hover:shadow-blue-300 transition-transform duration-200"
          >
            Confirm Booking
          </button>
        </form>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadein">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm animate-pop">
              <h2 className="text-2xl mb-2 font-bold text-green-600 animate-bounce">✅ Booking Successful</h2>
              <p className="mb-4">Your request has been sent. Please wait for admin approval.</p>
              <button
                onClick={handleCloseModal}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Go to Profile
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />

      {/* Animations */}
      <style>{`
        .animate-fadein { animation: fadein 1s; }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        .animate-slidein { animation: slidein 0.8s; }
        @keyframes slidein { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-pop { animation: pop 0.4s; }
        @keyframes pop { 0% { transform: scale(0.7); opacity: 0; } 80% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default BookingForm;