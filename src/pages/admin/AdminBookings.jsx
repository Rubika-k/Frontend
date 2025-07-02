import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const adminToken = localStorage.getItem('token');

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = async () => {
    const res = await axios.get('/api/admin/bookings', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    setBookings(res.data || []);
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    await axios.delete(`/api/bookings/${id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    fetchBookings();
  };

  const updateStatus = async (id, status) => {
    await axios.put(`/api/bookings/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    fetchBookings();
  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 animate-fadein py-10">
    <section className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto mt-8 animate-pop">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-8 tracking-tight animate-slidein drop-shadow">
        All Bookings
      </h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center py-8 animate-fadein">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full text-sm border-collapse bg-white">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="p-3">User</th>
                <th className="p-3">Title</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t hover:bg-blue-50 transition">
                  <td className="p-3">{b.userId?.fullName || 'N/A'}</td>
                  <td className="p-3">{b.workTitle}</td>
                  <td className="p-3">{b.preferredDate}</td>
                  <td className="p-3">{b.preferredTime}</td>
                  <td className="p-3 font-semibold">{b.status}</td>
                  <td className="p-3 flex flex-wrap gap-2">
                    {b.status !== 'Accepted' && (
                      <button
                        onClick={() => updateStatus(b._id, 'Accepted')}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-600 transition shadow"
                      >
                        Accept
                      </button>
                    )}
                    {b.status !== 'Rejected' && (
                      <button
                        onClick={() => updateStatus(b._id, 'Rejected')}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600 transition shadow"
                      >
                        Reject
                      </button>
                    )}
                    {b.status !== 'Completed' && (
                      <button
                        onClick={() => updateStatus(b._id, 'Completed')}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-600 transition shadow"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteBooking(b._id)}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-200 transition shadow"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
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