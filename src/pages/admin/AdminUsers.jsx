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
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 animate-fadein py-10">
    <section className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto mt-8 animate-pop">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight animate-slidein drop-shadow">
          User Management
        </h2>
        <input
          type="text"
          placeholder="🔍 Search users by name..."
          className="p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-72 transition"
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
                <td colSpan={5} className="text-center p-6 text-gray-400 font-medium bg-gray-50 animate-fadein">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id} className="border-b hover:bg-blue-50 transition">
                  <td className="p-3 font-medium flex items-center gap-2">
                    <span className="inline-block w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold uppercase shadow">
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
                      className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 font-semibold transition shadow"
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
    {/* Animations */}
    <style>{`
      .animate-fadein { animation: fadein 1s; }
      @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
      .animate-slidein { animation: slidein 0.8s; }
      @keyframes slidein { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      .animate-pop { animation: pop 0.4s; }
      @keyframes pop { 0% { transform: scale(0.7); opacity: 0; } 80% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
    `}</style>
    {/* Responsive Design */}
    <style>{`
      @media (max-width: 768px) {
        .md\\:w-1\\/3 { width: 100%; }
        .md\\:flex-row { flex-direction: column; }
        .md\\:items-start { align-items: flex-start; }
      }
    `}</style>
  </div>
)};