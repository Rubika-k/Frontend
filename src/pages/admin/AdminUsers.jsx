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
    <section className="bg-white rounded-xl shadow-lg p-8 max-w-5xl mx-auto mt-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-blue-700 tracking-tight">User Management</h2>
        <input
          type="text"
          placeholder="🔍 Search users by name..."
          className="p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm border-collapse bg-white">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Email</th>
              <th className="p-3 font-semibold">Phone</th>
              <th className="p-3 font-semibold">Role</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-400 font-medium bg-gray-50">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id} className="border-b hover:bg-blue-50 transition">
                  <td className="p-3 font-medium flex items-center gap-2">
                    <span className="inline-block w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold uppercase">
                      {u.fullName?.[0] || '?'}
                    </span>
                    {u.fullName}
                  </td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.phone}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === 'admin' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 font-semibold transition"
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
  );
}