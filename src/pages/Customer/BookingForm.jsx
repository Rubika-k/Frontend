import React, { useState } from 'react';
import axios from "@/config/axiosConfig";
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiUser, FiCalendar, FiClock, FiMapPin,
  FiAlertCircle, FiCheckCircle, FiInfo, FiArrowLeft
} from 'react-icons/fi';

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // From URL params or state fallback
  const params = new URLSearchParams(location.search);
  const workerName = params.get("worker");
  const workerId = params.get("workerId");
  const category = params.get("category");

  const { state } = location;
  const worker = state?.worker || null;

  const showWorkerName = worker?.name || workerName || "Selected Professional";
  const showWorkerId = worker?.id || workerId || null;
  const showCategory = worker?.profession || category || "Service Professional";

  // Form state
  const [form, setForm] = useState({
    workTitle: '',
    description: '',
    serviceLocation: '',
    preferredDate: '',
    preferredTime: '',
    estimatedHours: 1,
    urgency: 'Medium',
    paymentOption: 'PayLater',
    address: '',
    workerId: showWorkerId, 
    workerName: showWorkerName, // Add workerName to form state
    workerCategory: showCategory // Add workerCategory to form state
  });

  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    if (!userId || !token) {
      setMessage('Please log in to book a service.');
      setIsSubmitting(false);
      return;
    }

    try {
      const bookingData = {
        ...form,
        userId,
        workerId: showWorkerId,
        workerName: showWorkerName,
        workerCategory: showCategory
      };

      await axios.post('/bookings', bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowModal(true);
    } catch (err) {
      console.error('Booking error:', err);
      setMessage(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fadein">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Home
        </button>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Book a Service</h1>
            <div className="flex items-center gap-4 mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FiUser className="text-blue-600 text-xl" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-800 truncate">{showWorkerName}</h3>
                <p className="text-sm text-gray-600 truncate">{showCategory}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {message && (
              <div className="flex items-center gap-2 bg-red-100 text-red-700 p-3 rounded-lg border border-red-200">
                <FiAlertCircle className="flex-shrink-0" />
                <span className="text-sm">{message}</span>
              </div>
            )}

            {/* Hidden fields to store worker information */}
            <input type="hidden" name="workerId" value={showWorkerId || ''} />
            <input type="hidden" name="workerName" value={showWorkerName} />
            <input type="hidden" name="workerCategory" value={showCategory} />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Service Needed *</label>
              <input
                name="workTitle"
                placeholder="e.g., AC Repair, Plumbing, Electrical Work"
                required
                value={form.workTitle}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                placeholder="Describe the problem or service needed..."
                rows={4}
                value={form.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                <FiMapPin /> Service Address *
              </label>
              <input
                name="serviceLocation"
                placeholder="Where is the service needed?"
                required
                value={form.serviceLocation}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                  <FiCalendar /> Preferred Date *
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  required
                  value={form.preferredDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                  <FiClock /> Preferred Time *
                </label>
                <input
                  type="time"
                  name="preferredTime"
                  required
                  value={form.preferredTime}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Estimated Duration (hours)</label>
              <input
                type="number"
                name="estimatedHours"
                min="1"
                max="8"
                value={form.estimatedHours}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <FiInfo /> Most services take 1-3 hours
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Urgency Level</label>
              <select
                name="urgency"
                value={form.urgency}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="Low">Low (Can wait a few days)</option>
                <option value="Medium">Medium (Within 24-48 hours)</option>
                <option value="High">High (Need immediate service)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                name="paymentOption"
                value={form.paymentOption}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="PayLater">Pay after service completion</option>
                <option value="PayNow">Pay now (Online payment)</option>
              </select>
            </div>


            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-8">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadein">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md mx-4 animate-scalein">
            <FiCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your service request with {showWorkerName} ({showCategory}) has been received.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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

// Animations remain the same
<style>{`
  .animate-fadein { animation: fadein 0.3s ease-out; }
  .animate-scalein { animation: scalein 0.3s ease-out; }
  @keyframes fadein {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scalein {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`}</style>