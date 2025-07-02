import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function AdminLayout() {
  const tabs = ['dashboard', 'users', 'workers', 'bookings', 'services'];

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 animate-fadein">
    <Navbar />
    <div className="max-w-7xl mx-auto px-6 py-6 rounded-2xl shadow-2xl space-y-4 border-t-4 border-blue-500 bg-white bg-opacity-90 mt-8 animate-pop">
      <h1 className="text-3xl font-extrabold mb-4 text-blue-800 tracking-wide animate-slidein drop-shadow">
        Admin
      </h1>
      <nav className="flex gap-2 md:gap-6 mb-8 border-b-2 border-blue-100 pb-2">
        {tabs.map(tab => (
          <NavLink
            key={tab}
            to={tab}
            className={({ isActive }) =>
              `relative px-5 py-2 rounded-lg font-semibold transition-all duration-200
              ${isActive
                ? 'text-blue-700 bg-blue-100 shadow font-bold'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}`
            }
            style={{ letterSpacing: '0.5px' }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {/* Animated underline for active tab */}
            {window.location.pathname.includes(tab) && (
              <span className="absolute left-1/2 -bottom-1 w-2/3 h-1 bg-blue-500 rounded-full transform -translate-x-1/2 animate-pop"></span>
            )}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
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
)};