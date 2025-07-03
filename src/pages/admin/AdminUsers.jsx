import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const adminToken = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get('/api/users', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    setUsers(res.data || []); // Accepts array directly from backend
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await axios.delete(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    fetchUsers();
  };

  const filteredUsers = users.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 animate-fadein py-8 px-4 sm:px-6">
      <section className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-6xl mx-auto animate-pop">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-md animate-slidein">
                User Management
              </h2>
              <p className="text-blue-100 mt-1 font-medium">Manage all registered users</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 w-full md:w-72 transition-all duration-300 shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-blue-300"
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

        {/* Table container */}
        <div className="overflow-x-auto p-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="p-4 font-semibold text-left rounded-tl-lg">User</th>
                <th className="p-4 font-semibold text-left">Email</th>
                <th className="p-4 font-semibold text-left">Phone</th>
                <th className="p-4 font-semibold text-left">Role</th>
                <th className="p-4 font-semibold text-left rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-gray-500 font-medium bg-blue-50/50 animate-fadein">
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
                      No users found matching your search
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-blue-50/50 transition-colors duration-150">
                    <td className="p-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold uppercase shadow-inner">
                          {u.fullName?.[0] || '?'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{u.fullName}</div>
                          <div className="text-xs text-gray-500">ID: {u._id?.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">{u.email}</td>
                    <td className="p-4 text-gray-700">{u.phone || '-'}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          u.role === 'admin'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
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
      </section>

      {/* Enhanced Animations */}
      <style>{`
        .animate-fadein { animation: fadein 0.6s ease-out; }
        @keyframes fadein { 
          from { opacity: 0; transform: translateY(8px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-slidein { 
          animation: slidein 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes slidein { 
          from { transform: translateY(-15px); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
        .animate-pop { 
          animation: pop 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes pop { 
          0% { transform: scale(0.95); opacity: 0; } 
          100% { transform: scale(1); opacity: 1; } 
        }
      `}</style>
    </div>
  );
}