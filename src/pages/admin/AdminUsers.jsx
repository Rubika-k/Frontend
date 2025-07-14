import React, { useEffect, useState } from 'react';
import axios from '../../config/axiosConfig';
import { toast } from 'react-toastify';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Adjust the API endpoint to match your backend routing
      const response = await axios.get('/admin/users', {
        params: {
          page: pagination.page,
          limit: pagination.limit
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // ✅ The shape depends on your backend: adapt if needed
      const usersData = response.data?.users || response.data?.data || [];
      const totalCount = response.data?.total || response.data?.count || usersData.length;

      setUsers(usersData);
      setPagination(prev => ({
        ...prev,
        total: totalCount
      }));

    } catch (err) {
      console.error('API Error:', {
        url: err.config?.url,
        status: err.response?.status,
        message: err.message,
        responseData: err.response?.data
      });

      let errorMessage = 'Failed to load users. Please check your connection.';
      if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to view users.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Users endpoint not found. Check your backend route.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/users/${id}`);
      fetchUsers();
            toast.success("User deleted successfully!")

    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(user =>
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error("Error updating role:", error);
      setError("Failed to update user role.");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <strong>Error:</strong> {error}
          </div>
          <button
            onClick={fetchUsers}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <section className="bg-white rounded-xl shadow-md overflow-hidden max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              <p className="text-blue-100 mt-1 text-sm">Manage all registered users</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 w-full md:w-64 shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 font-semibold text-left">User</th>
                <th className="p-3 font-semibold text-left">Email</th>
                <th className="p-3 font-semibold text-left">Phone</th>
                <th className="p-3 font-semibold text-left">Role</th>
                <th className="p-3 font-semibold text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-gray-500">
                    <div className="flex flex-col items-center justify-center py-8">
                      <svg
                        className="h-12 w-12 text-gray-400 mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {users.length === 0 ? 'No users found' : 'No users match your search'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold uppercase">
                          {user.fullName?.[0] || '?'}
                        </div>
                        <div>
                          <div className="font-medium">{user.fullName}</div>
                          <div className="text-xs text-gray-500">ID: {user._id?.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.phone || '-'}</td>
                    <td className="p-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="font-medium">{pagination.total}</span> users
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page * pagination.limit >= pagination.total}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
