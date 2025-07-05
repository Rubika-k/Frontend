import React, { useState } from 'react';
import axios from "@/config/axiosConfig";
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiUser, FiCalendar, FiClock, FiMapPin, 
  FiAlertCircle, FiCheckCircle, FiInfo, FiX 
} from 'react-icons/fi';

const BookingForm = () => {
  const { state } = useLocation();
  const worker = state?.worker || null;
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    workTitle: '',
    description: '',
    serviceLocation: '',
    preferredDate: '',
    preferredTime: '',
    estimatedHours: 1,
    urgency: 'Medium',
    paymentOption: 'PayLater',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!userId || !token) {
      setMessage('Please log in to book a service');
      return;
    }

    try {
      await axios.post('/bookings', {
        ...form,
        userId,
        workerId: worker?.id || null,
        workerName: worker?.name || null,
        workerProfession: worker?.profession || null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowModal(true);
    } catch (err) {
      console.error('Booking error:', err);
      setMessage(err.response?.data?.message || 'Booking failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Book a Service</h1>
          {worker && (
            <div className="flex items-center gap-4 mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FiUser className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold">{worker.name}</h3>
                <p className="text-sm text-gray-600">{worker.profession}</p>
                {worker.rating && (
                  <div className="flex items-center gap-1 text-sm text-yellow-600 mt-1">
                    <FiStar className="fill-current" />
                    <span>{worker.rating}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {message && (
            <div className="flex items-center gap-2 bg-red-100 text-red-700 p-3 rounded-lg">
              <FiAlertCircle />
              <span>{message}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Service Needed</label>
            <input
              name="workTitle"
              placeholder="e.g., AC Repair, Plumbing, Electrical Work"
              required
              value={form.workTitle}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              placeholder="Describe the problem or service needed..."
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
              <FiMapPin /> Service Address
            </label>
            <input
              name="serviceLocation"
              placeholder="Where is the service needed?"
              required
              value={form.serviceLocation}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                <FiCalendar /> Preferred Date
              </label>
              <input
                type="date"
                name="preferredDate"
                required
                value={form.preferredDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                <FiClock /> Preferred Time
              </label>
              <input
                type="time"
                name="preferredTime"
                required
                value={form.preferredTime}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Estimated Duration (hours)</label>
            <input
              type="number"
              name="estimatedHours"
              min="1"
              max="8"
              value={form.estimatedHours}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <FiInfo /> Most services take 1-3 hours
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Urgency Level</label>
            <select
              name="urgency"
              value={form.urgency}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Low">Low (Can wait a few days)</option>
              <option value="Medium">Medium (Within 24-48 hours)</option>
              <option value="High">High (Need immediate service)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              name="paymentOption"
              value={form.paymentOption}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="PayLater">Pay after service completion</option>
              <option value="PayNow">Pay now (Online payment)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md mx-4">
            <FiCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">Your service request has been received. We'll contact you shortly.</p>
            <button
              onClick={() => navigate('/customer/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              View Bookings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;