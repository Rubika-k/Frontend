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
    const res = await axios.get('/api/customers', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    setUsers(res.data || []); // Accepts array directly from backend
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await axios.delete(`/api/customers/${id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    fetchUsers();
  };

  const filteredUsers = users.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="bg-white rounded shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Users</h2>
      <input
        type="text"
        placeholder="Search users..."
        className="p-2 border rounded mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No users found.
              </td>
            </tr>
          ) : (
            filteredUsers.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.fullName}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.phone}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="text-red-600 underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}