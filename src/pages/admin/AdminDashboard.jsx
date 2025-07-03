import React from "react";
import { FaShieldAlt, FaCog, FaUsers, FaCalendarAlt, FaTools } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 animate-fadein">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-pop transform transition-all duration-300 hover:shadow-2xl">
          <div className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-6">
              <FaShieldAlt className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 animate-slidein">
              Welcome to the <span className="text-blue-600">Admin Dashboard</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Use the navigation above to manage users, workers, bookings, and services.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-50 px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FaUsers className="h-6 w-6 text-blue-600" />, label: "Total Users", value: "1,248" },
              { icon: <FaTools className="h-6 w-6 text-blue-600" />, label: "Active Workers", value: "342" },
              { icon: <FaCalendarAlt className="h-6 w-6 text-blue-600" />, label: "Today's Bookings", value: "28" },
              { icon: <FaCog className="h-6 w-6 text-blue-600" />, label: "Services Offered", value: "15" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center"
              >
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Section (Placeholder) */}
        <div className="mt-10 bg-white rounded-3xl shadow-xl overflow-hidden animate-pop delay-100">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-600" />
              Recent Activity
            </h3>
          </div>
          <div className="p-6 text-center text-gray-500">
            <p>Recent admin activities will appear here</p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadein { animation: fadein 0.6s ease-out; }
        @keyframes fadein { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slidein { animation: slidein 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes slidein { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-pop { animation: pop 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes pop { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
        .delay-100 { animation-delay: 0.1s; }
      `}</style>
    </div>
  );
}