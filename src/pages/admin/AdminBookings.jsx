import React, { useEffect, useState } from 'react';
import axios from '../../config/axiosConfig';
import { toast } from 'react-toastify';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const BOOKINGS_PER_PAGE = 10;

  const adminToken = localStorage.getItem('token');

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/bookings/admin/bookings', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setBookings(res.data || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      await axios.put(
        `/bookings/${bookingId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      toast.success(`Booking status updated to ${status}`);
      fetchBookings();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await axios.delete(`/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      toast.success('Booking deleted successfully!');
      fetchBookings();
    } catch (err) {
      console.error('Failed to delete booking:', err);
    }
  };

  // ✅ Pagination logic
  const indexOfLastBooking = currentPage * BOOKINGS_PER_PAGE;
  const indexOfFirstBooking = indexOfLastBooking - BOOKINGS_PER_PAGE;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(bookings.length / BOOKINGS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4 sm:px-6">
      <div className="max-w-7.2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden animate-fadein">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">All Bookings</h2>
          <p className="text-blue-100 mt-1">Manage and update booking statuses</p>
        </div>

        <div className="p-6">
          {bookings.length === 0 ? (
            <div className="text-center p-12 bg-blue-50/50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2 text-gray-500 font-medium">No bookings found</p>
              <p className="text-sm text-gray-400">When bookings are made, they will appear here.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase">Worker</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase">Actions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase">payment Status</th>

                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentBookings.map((b) => (
                      <tr key={b._id} className="hover:bg-blue-50 transition-colors">
                        {/* User */}
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

                        {/* Service */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{b.workTitle}</div>
                          <div className="text-sm text-gray-500">{b.description || 'No description'}</div>
                        </td>

                        {/* Worker */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {b.workerId?.fullName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {b.workerId?.category?.name || 'N/A'}
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(b.preferredDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">{b.preferredTime}</div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${b.status === 'Accepted'
                            ? 'bg-green-100 text-green-800'
                            : b.status === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                            {b.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-wrap gap-2">
                            {b.status !== 'Accepted' && (
                              <button
                                onClick={() => updateStatus(b._id, 'Accepted')}
                                className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                              >
                                Accept
                              </button>
                            )}
                            {b.status !== 'Rejected' && (
                              <button
                                onClick={() => updateStatus(b._id, 'Rejected')}
                                className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteBooking(b._id)}
                              className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${b.paymentStatus === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : b.paymentStatus === 'unpaid'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                            {b.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ✅ Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 rounded border text-xs 
                        ${currentPage === index + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'} 
                        transition`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .animate-fadein { animation: fadein 0.4s ease-out; }
        @keyframes fadein { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
