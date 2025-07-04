import React, { useState } from 'react';
import axios from "@/config/axiosConfig";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import bgImg from '../../assets/back4.jpg';

const BookingForm = () => {
  const [form, setForm] = useState({
    workTitle: '',
    description: '',
    serviceLocation: '',
    preferredDate: '',
    preferredTime: '',
    estimatedHours: 1,
    urgency: 'Medium',
    paymentOption: 'PayLater'
  });

  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // ✅ Only use userId now
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'estimatedHours' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!userId || !token) {
      setMessage('⚠️ Please log in before booking.');
      return;
    }

    try {
      await axios.post('/bookings', {
        ...form,
        userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowModal(true);
    } catch (err) {
      console.error('Booking error:', err);
      setMessage(err.response?.data?.message || 'Booking failed. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/customer/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{
      backgroundImage: `url(${bgImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <Navbar />
      <main className="flex-grow container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-6">Book a Service</h1>

        {message && (
          <p className="text-center text-red-600 mb-4">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-4">
          <input
            name="workTitle"
            placeholder="Work Title"
            required
            value={form.workTitle}
            onChange={handleChange}
            className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="serviceLocation"
            placeholder="Service Location"
            required
            value={form.serviceLocation}
            onChange={handleChange}
            className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            name="preferredDate"
            required
            value={form.preferredDate}
            onChange={handleChange}
            className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="time"
            name="preferredTime"
            required
            value={form.preferredTime}
            onChange={handleChange}
            className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            name="estimatedHours"
            min="1"
            value={form.estimatedHours}
            onChange={handleChange}
            className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="urgency"
            value={form.urgency}
            onChange={handleChange}
            className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select
            name="paymentOption"
            value={form.paymentOption}
            onChange={handleChange}
            className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PayLater">Pay Later</option>
            <option value="PayNow">Pay Now</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition"
          >
            Confirm Booking
          </button>
        </form>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
              <h2 className="text-xl font-bold text-green-600 mb-2">✅ Booking Successful</h2>
              <p>Your booking has been placed. Please wait for confirmation.</p>
              <button
                onClick={handleCloseModal}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
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