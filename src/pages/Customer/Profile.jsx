import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, FiEdit2, FiLogOut, FiList, FiStar, FiMapPin, 
  FiCalendar, FiClock, FiUserCheck, FiPlus, FiLoader, 
  FiAlertCircle, FiX, FiPhone, FiMessageSquare 
} from 'react-icons/fi';
import axios from "@/config/axiosConfig";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [user, setUser] = useState({ fullName: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const userId = localStorage.getItem('userId');
        
        // Fetch user data from localStorage (original logic)
        const userData = {
          fullName: localStorage.getItem('fullName') || 'Your Name',
          email: localStorage.getItem('email') || 'your@email.com'
        };
        setUser(userData);

        // Fetch bookings (original logic)
        const bookingsRes = await axios.get(`/bookings/user/${userId}`);
        setBookings(bookingsRes.data);

        // Fetch favorites (original dummy data logic)
        const favs = [
          { id: 1, name: 'John Doe', profession: 'Electrician' },
          { id: 2, name: 'Jane Smith', profession: 'Plumber' },
        ];
        setFavorites(favs);

      } catch (err) {
        setError('Failed to load data. Please refresh the page.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Original logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Original edit/save function
  const handleEditSave = () => {
    if (isEditing) {
      localStorage.setItem('fullName', user.fullName);
      localStorage.setItem('email', user.email);
    }
    setIsEditing(!isEditing);
  };

  // Original add to favorites function (dummy implementation)
  const addToFavorites = (workerId, workerName, workerProfession) => {
    const newFavorite = { id: workerId, name: workerName, profession: workerProfession };
    setFavorites([...favorites, newFavorite]);
  };

  // Original remove favorite function (dummy implementation)
  const removeFavorite = (workerId) => {
    setFavorites(favorites.filter(fav => fav.id !== workerId));
  };

  // Original isFavorite check
  const isFavorite = (workerId) => {
    return favorites.some(fav => fav.id === workerId);
  };

  // Original date formatting
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Improved styling but same functionality */}
      <header className="sticky top-0 z-50 flex justify-between items-center bg-white shadow-sm px-6 py-4">
        <div 
          className="text-2xl font-bold cursor-pointer text-blue-600 hover:text-blue-700 transition" 
          onClick={() => navigate('/')}
        >
          Breeze<span className="text-orange-500">Home</span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
        >
          <FiLogOut /> Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Section - Same logic, better UI */}
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
          </div>
        </section>

        {/* Tabs - Same functionality */}
        <nav className="flex mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiList /> My Bookings
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'favorites'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiStar /> Favorite Workers
          </button>
        </nav>

        {/* Content - Same logic with improved display */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <FiLoader className="animate-spin text-4xl text-blue-600" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <FiAlertCircle className="text-4xl mx-auto text-red-400 mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Refresh
            </button>
          </div>
        ) : activeTab === 'bookings' ? (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <FiList className="text-4xl mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
                <button 
                  onClick={() => navigate('/services')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Browse Services
                </button>
              </div>
) : (
  bookings.map(booking => (
    <div key={booking._id} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition">
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="text-lg font-bold">{booking.workTitle}</h3>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              booking.status === 'Completed' ? 'bg-green-100 text-green-800'
              : booking.status === 'Cancelled' ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
            }`}>
              {booking.status}
            </span>
          </div>
          {/* Worker Info */}
          {booking.workerId && (
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FiUserCheck className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">{booking.workerId.fullName || 'Worker Name'}</h4>
                <p className="text-sm text-gray-500">{booking.workerId.category || 'Category'}</p>
              </div>
              {/* Add to Favorites */}
              {!isFavorite(booking.workerId._id) ? (
                <button 
                  onClick={() => addToFavorites(
                    booking.workerId._id,
                    booking.workerId.fullName,
                    booking.workerId.category
                  )}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 ml-4"
                >
                  <FiPlus /> Add to Favorites
                </button>
              ) : (
                <span className="text-sm text-gray-500 ml-4">In your favorites</span>
              )}
            </div>
          )}
          {/* Original booking details display */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FiMapPin /> {booking.serviceLocation}
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar /> {formatDate(booking.preferredDate)}
            </div>
            <div className="flex items-center gap-2">
              <FiClock /> {booking.preferredTime}
            </div>
          </div>
          
          {booking.description && (
            <p className="mt-3 text-sm text-gray-700">
              {booking.description}
            </p>
          )}
        </div>
        
        {/* Original action buttons
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => navigate(`/bookings/${booking._id}`)}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            View Details
          </button>
          {booking.workerId && (
            <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition flex items-center gap-2">
              <FiMessageSquare /> Message
            </button>
          )}
        </div> */}
      </div>
    </div>
  ))
)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center col-span-full">
                <FiStar className="text-4xl mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">You haven't added any workers to favorites yet.</p>
                <button 
                  onClick={() => navigate('/categories')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Browse Workers
                </button>
              </div>
            ) : (
              favorites.map(fav => (
                <div key={fav.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiUser className="text-blue-600 text-xl" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold">{fav.name}</h4>
                          <p className="text-sm text-gray-600">{fav.profession}</p>
                        </div>
                        <button 
                          onClick={() => removeFavorite(fav.id)}
                          className="text-gray-400 hover:text-red-500 transition"
                        >
                          <FiX />
                        </button>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button 
                          onClick={() => navigate('/booking', { state: { worker: fav } })}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}