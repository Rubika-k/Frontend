import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser, FiEdit2, FiLogOut, FiList, FiMapPin,
  FiCalendar, FiClock, FiUserCheck, FiLoader,
  FiAlertCircle, FiDollarSign
} from 'react-icons/fi';
import axios from "@/config/axiosConfig";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingPaymentModal from './BookingPaymentModal';
import { toast } from 'react-toastify';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ fullName: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        const userRes = await axios.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data);

        const bookingsRes = await axios.get(`/bookings/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setBookings(bookingsRes.data);
      } catch (err) {
        setError('Failed to load data. Please refresh the page.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleEditSave = () => {
    if (isEditing) {
      localStorage.setItem('fullName', user.fullName);
      localStorage.setItem('email', user.email);
    }
    setIsEditing(!isEditing);
  };

  const handlePayment = async (selectedBooking) => {
    try {
      const token = localStorage.getItem('token');

      if (!selectedBooking || selectedBooking.paymentStatus === 'Paid') {
        toast.success('You already paid for this booking.');
        return;
      }

      const bookingData = {
        bookingId: selectedBooking._id,
        userId: selectedBooking.userId?._id || selectedBooking.userId,
        workerId: selectedBooking.workerId?._id || selectedBooking.workerId,
        amount: Number(selectedBooking.amount ?? 0.5),
        currency: 'usd',
        paymentDetails: {
          cardHolderName: "Card on File",
          method: "Stripe Checkout"
        },
        workTitle: selectedBooking.workTitle || 'Service Booking',
        description: selectedBooking.description || '',
        serviceLocation: selectedBooking.serviceLocation || '',
        preferredDate: selectedBooking.preferredDate || '',
        preferredTime: selectedBooking.preferredTime || '',
        estimatedHours: selectedBooking.estimatedHours || 1
      };

      const res = await axios.post('/bookings/createBookingWithCheckout', bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error("Missing redirect URL from server.");
      }

    } catch (err) {
      console.error('❌ Payment error:', err);
      alert(err.response?.data?.message || err.message || 'Payment failed.');
    } finally {
      setShowPaymentModal(false);
      setSelectedBooking(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 py-8">
        <section className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
              <FiUser className="text-blue-600 text-4xl" />
            </div>
            <div className="flex-grow">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    className="block w-full px-4 py-2 border border-gray-200 rounded-lg"
                    value={user.fullName}
                    onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                    placeholder="Full Name"
                  />
                  <input
                    className="block w-full px-4 py-2 border border-gray-200 rounded-lg"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    placeholder="Email"
                    type="email"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
                  <p className="text-gray-600 mt-1">{user.email}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleEditSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition w-full sm:w-auto justify-center"
            >
              <FiEdit2 />
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition w-full sm:w-auto justify-center"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </section>

        {error && (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center mb-6">
            <FiAlertCircle className="text-4xl mx-auto text-red-400 mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Refresh
            </button>
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FiList /> My Bookings
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <FiLoader className="animate-spin text-4xl text-blue-600" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <FiList className="text-4xl mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
            <button
              onClick={() => navigate('/categories')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking._id} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{booking.workTitle}</h3>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${booking.status === 'Accepted' ? 'bg-green-100 text-green-800' : booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {booking.status}
                      </span>
                    </div>
                    {booking.workerId && (
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900">
                          Worker: {booking.workerId.fullName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Category: {booking.workerId.category?.name || 'N/A'}
                        </p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiMapPin /> {booking.serviceLocation}
                      </div>
                      <div className="flex items-center gap-2">
                        <FiCalendar /> {new Date(booking.preferredDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock /> {booking.preferredTime}
                      </div>
                    </div>
                    {booking.description && (
                      <p className="mt-3 text-sm text-gray-700">{booking.description}</p>
                    )}
                  </div>
                  {booking.status === 'Accepted' && (
                    <div className="flex flex-col items-start gap-3 mt-4">
                      <button
                        onClick={() => handlePayment(booking)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        {booking.paymentStatus === "Paid" ? "Paid" : "💳 Pay Now"}
                      </button>

                      {booking.paymentStatus === "Paid" && booking.workerId && (
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm text-green-800 w-full">
                          <p className="font-semibold mb-1">Worker Contact Info:</p>
                          <p><span className="font-medium">Phone:</span> {booking.workerId.phone || 'N/A'}</p>
                          <p><span className="font-medium">Email:</span> {booking.workerId.email || 'N/A'}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showPaymentModal && (
        <BookingPaymentModal
          amount={1}
          onClose={() => setShowPaymentModal(false)}
          onPay={handlePayment}
        />
      )}

      <footer className="bg-white text-center py-4 border-t border-gray-200 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} BreezeHome. All rights reserved.
      </footer>
    </div>
  );
}
