import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    // Fetch user info
    axios
      .get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));

    // Fetch user bookings
    axios
      .get("/api/bookings/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookings(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (!user && !loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-xl mx-auto py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your profile.</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 animate-fadein">
    <Navbar />
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-700 text-center drop-shadow animate-slidein">
        My Profile
      </h2>
      {user && (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-10 flex items-center gap-6 animate-pop">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl text-blue-600 border-4 border-blue-100 shadow">
              <span>{user.fullName ? user.fullName[0] : '?'}</span>
            </div>
          )}
          <div>
            <p><span className="font-semibold">Name:</span> {user.fullName}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Phone:</span> {user.phone}</p>
            <p><span className="font-semibold">Address:</span> {user.address?.city}, {user.address?.street}</p>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-semibold mb-4 animate-slidein">My Bookings</h3>
      {loading ? (
        <p className="text-center text-blue-600 animate-pulse">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500 text-center animate-fadein">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow animate-pop">
          <table className="w-full text-sm border-collapse bg-white rounded-lg">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="p-3">Service</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
                <th className="p-3">Worker</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, idx) => (
                <tr key={b._id} className="border-t hover:bg-blue-50 transition-all duration-200">
                  <td className="p-3">{b.workTitle}</td>
                  <td className="p-3">{b.preferredDate}</td>
                  <td className="p-3">{b.preferredTime}</td>
                  <td className="p-3 font-semibold">
                    <span className={
                      b.status === "Accepted"
                        ? "text-green-600"
                        : b.status === "Rejected"
                        ? "text-red-600"
                        : b.status === "Completed"
                        ? "text-blue-600"
                        : "text-gray-700"
                    }>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3">{b.workerId?.fullName || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    <Footer />
    {/* Animations */}
    <style>{`
      .animate-fadein { animation: fadein 1s; }
      @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
      .animate-slidein { animation: slidein 0.8s; }
      @keyframes slidein { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      .animate-pop { animation: pop 0.5s; }
      @keyframes pop { 0% { transform: scale(0.7); opacity: 0; } 80% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
    `}</style>
  </div>
)};