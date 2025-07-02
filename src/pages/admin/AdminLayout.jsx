import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function AdminLayout() {
  const tabs = ['dashboard', 'users', 'workers', 'bookings', 'services'];

  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar />
        
      <div className="max-w-7xl mx-auto px-6 py-4 rounded-lg shadow-md  space-y-4 border-t-4 border-blue-500 bg-white bg-opacity-90">
        <h1 className="text-2xl font-bold mb-4 ">Admin</h1>
        <nav className="flex gap-4 mb-6">
          {tabs.map(tab => (
            <NavLink
              key={tab}
              to={tab}
              className={({ isActive }) =>
                `px-4 py-2 rounded ${
                  isActive
                    ? 'bg-blue text-blue-600 font-semibold'
                    : 'bg-white bg-opacity-80 text-gray-700'
                }`
              }
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </NavLink>
          ))}
        </nav>
        <Outlet />
      </div>
    </div>
  );
}