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
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-6 text-blue-700">My Profile</h2>
        {user && (
          <div className="bg-white rounded shadow p-6 mb-8 flex items-center gap-6">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-500 border-4 border-blue-100 shadow">
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

        <h3 className="text-2xl font-semibold mb-4">My Bookings</h3>
        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          <table className="w-full text-sm border-collapse bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Service</th>
                <th className="p-2">Date</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
                <th className="p-2">Worker</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="p-2">{b.workTitle}</td>
                  <td className="p-2">{b.preferredDate}</td>
                  <td className="p-2">{b.preferredTime}</td>
                  <td className="p-2">{b.status}</td>
                  <td className="p-2">{b.workerId?.fullName || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </div>
  );
}