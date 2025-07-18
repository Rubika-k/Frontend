import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const bookingId = queryParams.get("bookingId");

  useEffect(() => {
    // Optionally update booking status here using axios if status === 'success'
  }, [status, bookingId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 p-4">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full mx-4">
        {status === "success" ? (
          <>
            <div className="animate-bounce">
              <FiCheckCircle className="text-green-500 text-7xl mx-auto mb-6" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Payment Successful!</h2>
            <p className="text-gray-600 mb-8 text-lg">Thank you! Your booking is confirmed.</p>
            <div className="mb-4">
              <p className="text-sm text-gray-500">Booking ID: {bookingId}</p>
            </div>
          </>
        ) : (
          <>
            <FiXCircle className="text-red-500 text-7xl mx-auto mb-6 transform hover:scale-110 transition-transform" />
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Payment Failed</h2>
            <p className="text-gray-600 mb-8 text-lg">Something went wrong. Please try again.</p>
          </>
        )}
        <button
          onClick={() => navigate("/profile")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}