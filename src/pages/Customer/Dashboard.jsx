import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "@/config/axiosConfig";
import { 
  FiCalendar, 
  FiClock, 
  FiHeart, 
  FiDollarSign, 
  FiHome, 
  FiList, 
  FiMapPin, 
  FiUser,
  FiArrowRight 
} from 'react-icons/fi';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const servicesSample = [
    { name: 'Electrician', desc: 'Electrical repairs and installations', icon: '⚡' },
    { name: 'Plumber', desc: 'Plumbing services and repairs', icon: '🚰' },
    { name: 'House Cleaning', desc: 'Professional house cleaning services', icon: '🧹' },
  ];

  const stats = [
    { label: 'Total Bookings', value: bookings.length, sub: '', icon: <FiCalendar className="text-2xl" /> },
    { label: 'Active Bookings', value: bookings.filter(b => b.status !== 'Completed').length, sub: 'In progress or pending', icon: <FiClock className="text-2xl" /> },
    { label: 'Total Spent', value: 'Rs.0', sub: 'This year', icon: <FiDollarSign className="text-2xl" /> },
    { label: 'Favorite Workers', value: 0, sub: 'Saved for quick booking', icon: <FiHeart className="text-2xl" /> },
  ];

  useEffect(() => {
    setServices(servicesSample);

    const fetchMyBookings = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const res = await axios.get(`/bookings/user/${userId}`); 
        setBookings(res.data);
      } catch (err) {
        console.error("Full error details:", {
          url: err.config?.url,
          status: err.response?.status,
          headers: err.config?.headers
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMyBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-lg text-gray-600">Manage your bookings and discover new services</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((s, i) => (
            <div 
              key={i} 
              className="bg-white rounded-xl shadow-sm p-6 flex items-start border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                {s.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
                {s.sub && <p className="text-xs text-gray-400 mt-1">{s.sub}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['browse', 'bookings'].map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'browse' && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FiHome className="mr-2" /> Available Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <span className="text-3xl mr-4">{svc.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{svc.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{svc.desc}</p>
                      </div>
                    </div>
                    <button
                      className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center"
                      onClick={() => navigate('/booking')}
                    >
                      Book Now
                      <FiArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'bookings' && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FiList className="mr-2" /> My Bookings
            </h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                  <FiCalendar className="w-full h-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
                <p className="mt-2 text-gray-500">Get started by booking a service</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Browse Services
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map(booking => (
                  <div 
                    key={booking._id} 
                    className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{booking.workTitle}</h3>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'Completed' 
                              ? 'bg-green-100 text-green-800' 
                              : booking.status === 'Cancelled' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-blue-100 text-blue-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                      {booking.workerId && (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FiUser className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{booking.workerId.fullName}</p>
                            <p className="text-xs text-gray-500">Assigned Worker</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <FiMapPin className="mr-2 flex-shrink-0" />
                        <span>{booking.serviceLocation}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiCalendar className="mr-2 flex-shrink-0" />
                        <span>{booking.preferredDate}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiClock className="mr-2 flex-shrink-0" />
                        <span>{booking.preferredTime}</span>
                      </div>
                    </div>
                    
                    {booking.description && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">{booking.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}