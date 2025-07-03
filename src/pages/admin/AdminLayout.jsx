import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function AdminLayout() {
  const tabs = ['dashboard', 'users', 'workers', 'bookings', 'services'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 animate-fadein">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Glassmorphism container */}
        <div className="rounded-3xl shadow-2xl space-y-6 bg-white/80 backdrop-blur-lg border border-white/20 overflow-hidden animate-pop">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-8 py-6">
            <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg animate-slidein">
              Admin Dashboard
            </h1>
            <p className="text-blue-100 mt-1 font-medium">Manage your platform efficiently</p>
          </div>

          {/* Enhanced tab navigation */}
          <nav className="flex gap-1 px-6 mb-2">
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

          {/* Content area with subtle pattern */}
          <div className="px-8 pb-8 pt-6 bg-gradient-to-br from-white/90 to-white/70">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Enhanced Animations */}
      <style>{`
        .animate-fadein { animation: fadein 0.8s ease-out; }
        @keyframes fadein { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slidein { animation: slidein 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        @keyframes slidein { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-pop { animation: pop 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes pop { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-underline { animation: underline 0.3s cubic-bezier(0.65, 0, 0.35, 1); }
        @keyframes underline { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      `}</style>
    </div>
  )
};