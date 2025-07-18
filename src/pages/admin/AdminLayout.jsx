import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FaUsers, FaTools, FaCalendarAlt, FaCog } from 'react-icons/fa';
import axios from '../../config/axiosConfig';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar'; // ✅ Use your existing Navbar

export default function AdminLayout() {
  const tabs = ['users', 'workers', 'bookings', 'services', 'messages', 'payments'];
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeWorkers: 0,
    todaysBookings: 0,
    servicesOffered: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, workersRes, bookingsRes, servicesRes] = await Promise.all([
          axios.get('admin/users/count'),
          axios.get('admin/workers/count'),
          axios.get('admin/bookings/count?date=today'),
          axios.get('admin/services/count')
        ]);

        setStats({
          totalUsers: usersRes.data.count || 0,
          activeWorkers: workersRes.data.count || 0,
          todaysBookings: bookingsRes.data.count || 0,
          servicesOffered: servicesRes.data.count || 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* ✅ Your existing Navbar */}
      <Navbar />

      <main className="flex-grow max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-white/20 overflow-hidden animate-pop mt-8">
          {/* ✅ Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg animate-slidein">
                Admin Dashboard
              </h1>
              <p className="text-blue-100 mt-1 font-medium">Manage your platform efficiently</p>
            </div>
            {/* ✅ Logout button */}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>

          {/* ✅ Stats Cards */}
          <div className="px-8 pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FaUsers className="h-6 w-6 text-blue-600" />, label: "Total Users", value: stats.totalUsers, color: "bg-blue-100" },
              { icon: <FaTools className="h-6 w-6 text-blue-600" />, label: "Workers", value: stats.activeWorkers, color: "bg-green-100" },
              { icon: <FaCalendarAlt className="h-6 w-6 text-blue-600" />, label: "Today's Bookings", value: stats.todaysBookings, color: "bg-purple-100" },
              { icon: <FaCog className="h-6 w-6 text-blue-600" />, label: "Services Offered", value: stats.servicesOffered, color: "bg-yellow-100" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${stat.color} p-3 rounded-full`}>
                    {stat.icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    {loading ? (
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Tabs */}
          <nav className="flex gap-1 px-6 mt-4">
            {tabs.map(tab => (
              <NavLink
                key={tab}
                to={tab}
                className={({ isActive }) =>
                  `relative px-6 py-3 rounded-t-lg font-medium transition-all duration-300 transform hover:scale-105
                  ${isActive
                    ? 'text-blue-700 bg-white shadow-lg font-semibold'
                    : 'text-gray-600 hover:bg-white/50 hover:text-blue-600'}`
                }
                style={{ letterSpacing: '0.5px' }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {window.location.pathname.includes(tab) && (
                  <span className="absolute left-0 bottom-0 w-full h-1 bg-blue-500 rounded-full animate-underline"></span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ✅ Content Outlet */}
          <div className="px-8 pb-8 pt-6 bg-gradient-to-br from-white/90 to-white/70">
            <Outlet />
          </div>
        </div>
      </main>

      {/* ✅ Simple Copyright Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} BreezeHome Admin. All rights reserved.
      </footer>

      {/* ✅ Animations */}
      <style>{`
        .animate-slidein { animation: slidein 0.6s ease forwards; }
        @keyframes slidein { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-pop { animation: pop 0.5s ease; }
        @keyframes pop { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-underline { animation: underline 0.3s ease; }
        @keyframes underline { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      `}</style>
    </div>
  );
}
