import React, { useEffect, useState } from 'react';
import axios from '../../config/axiosConfig';
import { toast } from 'react-toastify';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const adminToken = localStorage.getItem('token');

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings/admin/bookings', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setBookings(res.data || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  // ✅ Update booking status
  const updateStatus = async (bookingId, status) => {
  try {
    const token = localStorage.getItem("token");
    await axios.put(
      `/bookings/${bookingId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Are sure to update the status to " + status + "?");
    fetchBookings(); // refresh bookings
        toast.success(`Booking status updated to ${status}`)

  } catch (err) {
    console.error("❌ Failed to update status:", err.response?.data || err);
  }
};
    // ✅ Delete booking
  const handleDeleteBooking = async (bookingId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Booking deleted successfully!");
    fetchBookings(); // refresh bookings
  } catch (err) {
    console.error("❌ Failed to delete booking:", err.response?.data || err);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 animate-fadein py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden animate-pop">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">All Bookings</h2>
          <p className="text-blue-100 mt-1">Manage and update booking statuses</p>
        </div>

        {/* Bookings Content */}
        <div className="p-6">
          {bookings.length === 0 ? (
            <div className="text-center p-8 text-gray-500 bg-blue-50/50 rounded-lg animate-fadein">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2 font-medium">No bookings found</p>
              <p className="text-sm">When bookings are made, they will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                      Service
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                      Worker
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase">
                            {b.userId?.fullName?.[0] || '?'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{b.userId?.fullName || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{b.userId?.email || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{b.workTitle}</div>
                        <div className="text-sm text-gray-500">{b.category || 'General'}</div>
                      </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{b.workerName}</div>
                        <div className="text-sm text-gray-500">{b.workerCategory || 'General'}</div>
                     </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(b.preferredDate).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">{b.preferredTime}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          b.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          b.status === 'Accepted' ? 'bg-blue-100 text-blue-800' :
                          b.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-wrap gap-2">
                          {b.status !== 'Accepted' && (
                            <button
                             onClick={() => updateStatus(b._id, 'Accepted')}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Accept
                            </button>
                          )}
                          {b.status !== 'Rejected' && (
                            <button
                              onClick={() => updateStatus(b._id, 'Rejected')}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Reject
                            </button>
                          )}
                          {b.status !== 'Completed' && (
                            <button
                              onClick={() => updateStatus(b._id, 'Completed')}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteBooking(b._id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadein { animation: fadein 0.4s ease-out; }
        @keyframes fadein { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-pop { animation: pop 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes pop { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}