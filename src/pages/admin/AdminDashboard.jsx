import React from "react";

export default function AdminDashboard() {
 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center animate-fadein">
    <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-xl w-full animate-pop text-center border-t-4 border-blue-500">
      <h2 className="text-3xl font-extrabold mb-4 text-blue-700 animate-slidein drop-shadow">
        Welcome to the Admin Dashboard
      </h2>
      <p className="text-gray-600 text-lg">
        Use the navigation above to manage users, workers, bookings, and services.
      </p>
    </div>
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