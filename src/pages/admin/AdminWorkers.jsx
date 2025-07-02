import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';

export default function AdminWorkers() {
  const [workers, setWorkers] = useState([]);
  const [newWorker, setNewWorker] = useState({
    fullName: '',
    email: '',
    phone: '',
    profilePicture: '',
    address: '',
    experience: '',
    category: '',
    isVerified: false,
    registrationFeePaid: false
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState({});
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  const adminToken = localStorage.getItem('token');

  useEffect(() => {
    fetchWorkers();
    // eslint-disable-next-line
  }, []);

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: '' }), 2000);
  };

  const fetchWorkers = async () => {
    const res = await axios.get('/api/workers', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    // Accepts both array and object response
    setWorkers(Array.isArray(res.data) ? res.data : res.data.workers || []);
  };

  const handleWorkerChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewWorker({
      ...newWorker,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddWorker = async (e) => {
    e.preventDefault();
    await axios.post('/api/workers', newWorker, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    setNewWorker({
      fullName: '', email: '', phone: '', profilePicture: '', address: '', experience: '', category: '', isVerified: false, registrationFeePaid: false
    });
    fetchWorkers();
    showPopup('Worker added successfully!', 'success');
  };

  const handleDeleteWorker = async (id) => {
    if (!window.confirm('Delete this worker?')) return;
    await axios.delete(`/api/workers/${id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    fetchWorkers();
    showPopup('Worker deleted successfully!', 'success');
  };

  const openEditModal = (worker) => {
    setEditingWorker(worker);
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingWorker({
      ...editingWorker,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const saveUpdatedWorker = async () => {
    await axios.put(`/api/workers/${editingWorker._id}`, editingWorker, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    setEditModalOpen(false);
    fetchWorkers();
    showPopup('Worker updated successfully!', 'success');
  };

  return (
    <section className="bg-white rounded shadow p-6 relative">
      {popup.show && (
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white ${popup.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {popup.message}
        </div>
      )}
      <h2 className="text-lg font-semibold mb-4">Manage Workers</h2>
      {/* ➕ Add Worker Form */}
      <form
        onSubmit={handleAddWorker}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <input type="text" name="fullName" placeholder="Full Name" value={newWorker.fullName} onChange={handleWorkerChange} className="p-2 border rounded" required />
        <input type="email" name="email" placeholder="Email" value={newWorker.email} onChange={handleWorkerChange} className="p-2 border rounded" required />
        <input type="text" name="phone" placeholder="Phone" value={newWorker.phone} onChange={handleWorkerChange} className="p-2 border rounded" required />
        <input type="text" name="category" placeholder="Category" value={newWorker.category} onChange={handleWorkerChange} className="p-2 border rounded" required />
        <input type="text" name="address" placeholder="Address" value={newWorker.address} onChange={handleWorkerChange} className="p-2 border rounded" />
        <input type="number" name="experience" placeholder="Experience (years)" value={newWorker.experience} onChange={handleWorkerChange} className="p-2 border rounded" />
        <input type="text" name="profilePicture" placeholder="Profile Picture URL" value={newWorker.profilePicture} onChange={handleWorkerChange} className="p-2 border rounded" />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isVerified" checked={newWorker.isVerified} onChange={handleWorkerChange} /> Verified
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="registrationFeePaid" checked={newWorker.registrationFeePaid} onChange={handleWorkerChange} /> Reg. Fee Paid
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition col-span-full">+ Add Worker</button>
      </form>
      {/* 📋 Worker List */}
      <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Category</th>
            <th className="p-2">Experience</th>
            <th className="p-2">Address</th>
            <th className="p-2">Profile</th>
            <th className="p-2">Verified</th>
            <th className="p-2">Reg. Fee</th>
            <th className="p-2">Created</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((w) => (
            <tr key={w._id} className="border-t">
              <td className="p-2">{w.fullName || '-'}</td>
              <td className="p-2">{w.email || '-'}</td>
              <td className="p-2">{w.phone || '-'}</td>
              <td className="p-2">{w.category || '-'}</td>
              <td className="p-2">{w.experience ? `${w.experience} yrs` : '-'}</td>
              <td className="p-2">{w.address || '-'}</td>
              <td className="p-2">
                {w.profilePicture ? (
                  w.profilePicture.startsWith('data:image') ? (
                    <img src={w.profilePicture} alt="profile" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <img src={w.profilePicture} alt="profile" className="w-10 h-10 rounded-full object-cover" />
                  )
                ) : null}
              </td>
              <td className="p-2">{w.isVerified ? "✅" : "❌"}</td>
              <td className="p-2">{w.registrationFeePaid ? "✅" : "❌"}</td>
              <td className="p-2">{w.createdAt ? new Date(w.createdAt).toLocaleDateString() : ""}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => openEditModal(w)}
                  className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteWorker(w._id)}
                  className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {/* ✏️ Edit Worker Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray rounded-lg shadow-md  space-y-4 border-t-4 border-blue-500  bg-opacity-90 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Worker</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="fullName" value={editingWorker.fullName || ''} onChange={handleEditChange} placeholder="Full Name" className="p-2 border rounded mb-2 w-full" />
              <input type="email" name="email" value={editingWorker.email || ''} onChange={handleEditChange} placeholder="Email" className="p-2 border rounded mb-2 w-full" />
              <input type="text" name="phone" value={editingWorker.phone || ''} onChange={handleEditChange} placeholder="Phone" className="p-2 border rounded mb-2 w-full" />
              <input type="text" name="category" value={editingWorker.category || ''} onChange={handleEditChange} placeholder="Category" className="p-2 border rounded mb-2 w-full" />
              <input type="text" name="address" value={editingWorker.address || ''} onChange={handleEditChange} placeholder="Address" className="p-2 border rounded mb-2 w-full" />
              <input type="number" name="experience" value={editingWorker.experience || ''} onChange={handleEditChange} placeholder="Experience (years)" className="p-2 border rounded mb-2 w-full" />
              <input type="text" name="profilePicture" value={editingWorker.profilePicture || ''} onChange={handleEditChange} placeholder="Profile Picture URL" className="p-2 border rounded mb-2 w-full" />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isVerified" checked={!!editingWorker.isVerified} onChange={handleEditChange} /> Verified
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="registrationFeePaid" checked={!!editingWorker.registrationFeePaid} onChange={handleEditChange} /> Reg. Fee Paid
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={saveUpdatedWorker}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}