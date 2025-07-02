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
    <section className="bg-white rounded shadow p-6">
      <h2 className="text-lg font-semibold mb-4">All Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">User</th>
                <th className="p-2">Title</th>
                <th className="p-2">Date</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="p-2">{b.userId?.fullName || 'N/A'}</td>
                  <td className="p-2">{b.workTitle}</td>
                  <td className="p-2">{b.preferredDate}</td>
                  <td className="p-2">{b.preferredTime}</td>
                  <td className="p-2 font-semibold">{b.status}</td>
                  <td className="p-2 space-x-2">
                    {b.status !== 'Accepted' && (
                      <button
                        onClick={() => updateStatus(b._id, 'Accepted')}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                      >
                        Accept
                      </button>
                    )}
                    {b.status !== 'Rejected' && (
                      <button
                        onClick={() => updateStatus(b._id, 'Rejected')}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      >
                        Reject
                      </button>
                    )}
                    {b.status !== 'Completed' && (
                      <button
                        onClick={() => updateStatus(b._id, 'Completed')}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteBooking(b._id)}
                      className="text-gray-500 underline text-xs"
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
  )};