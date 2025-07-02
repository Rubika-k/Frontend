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
    registrationFeePaid: false,
    isAvailable: false, // <-- add this
    nextAvailableTime: '', // <-- add this
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
    try {
      const res = await axios.get('/api/workers/all', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.workers || [];
      setWorkers(data);
    } catch (error) {
      console.error('Failed to fetch workers:', error);
      setWorkers([]);
    }
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

    // Prevent duplicate email on frontend
    if (workers.some(w => w.email === newWorker.email)) {
      showPopup('A worker with this email already exists!', 'error');
      return;
    }

    try {
      const payload = {
        ...newWorker,
        experience: newWorker.experience ? Number(newWorker.experience) : 0,
        fullName: newWorker.fullName?.trim() || '',
        email: newWorker.email?.trim() || '',
        phone: newWorker.phone?.trim() || '',
        profilePicture: newWorker.profilePicture?.trim() || '',
        address: newWorker.address?.trim() || '',
        category: newWorker.category?.trim() || '',
        isVerified: !!newWorker.isVerified,
        registrationFeePaid: !!newWorker.registrationFeePaid,
        isAvailable: !!newWorker.isAvailable,
        nextAvailableTime: newWorker.nextAvailableTime || '',
      };
      await axios.post('/api/workers', payload, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setNewWorker({
        fullName: '',
        email: '',
        phone: '',
        profilePicture: '',
        address: '',
        experience: '',
        category: '',
        isVerified: false,
        isAvailable: false,
        nextAvailableTime: '',
        registrationFeePaid: false
      });
      showPopup('Worker added successfully!', 'success');
      fetchWorkers();
    } catch (err) {
      let errorMsg = 'Failed to add worker';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.error) {
          if (err.response.data.error.includes('E11000 duplicate key')) {
            errorMsg = 'A worker with this email already exists!';
          } else {
            errorMsg = err.response.data.error;
          }
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        } else if (err.response.data.errors) {
          errorMsg = Object.values(err.response.data.errors).map(e => e.message).join(', ');
        } else {
          errorMsg = JSON.stringify(err.response.data);
        }
      }
      showPopup(errorMsg, 'error');
      console.error('Add worker error:', err.response?.data || err.message);
    }
  };

  const fetchWorkerById = async (id) => {
    try {
      const res = await axios.get(`/api/workers/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setEditingWorker(res.data);
      setEditModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch worker by ID:', err);
      showPopup('Failed to fetch worker details', 'error');
    }
  };

  const handleDeleteWorker = async (id) => {
    if (!window.confirm('Are you sure you want to delete this worker?')) return;
    try {
      await axios.delete(`/api/workers/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      showPopup('Worker deleted successfully!', 'success');
      fetchWorkers();
    } catch (err) {
      console.error('Delete worker error:', err);
      showPopup('Failed to delete worker', 'error');
    }
  };

  const openEditModal = (Worker) => {
    setEditingWorker(Worker);
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
    try {
      await axios.put(`/api/workers/${editingWorker._id}`, editingWorker, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setEditModalOpen(false);
      fetchWorkers();
      showPopup('Worker updated successfully!', 'success');
    } catch (err) {
      let errorMsg = 'Failed to update worker';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.error) {
          errorMsg = err.response.data.error;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        } else if (err.response.data.errors) {
          errorMsg = Object.values(err.response.data.errors).map(e => e.message).join(', ');
        } else {
          errorMsg = JSON.stringify(err.response.data);
        }
      }
      showPopup(errorMsg, 'error');
      console.error('Update worker error:', err.response?.data || err.message);
    }
  };
  
 return (
  <section className="bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 min-h-screen py-8 animate-fadein">
    <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-8 relative animate-pop">
      {popup.show && (
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-8 py-4 rounded-xl shadow-2xl text-white text-lg font-semibold ${popup.type === 'success' ? 'bg-green-600' : 'bg-red-600'} animate-bounce`}>
          {popup.message}
        </div>
      )}

      <h2 className="text-3xl font-extrabold mb-8 text-blue-800 tracking-wide animate-slidein drop-shadow">
        Manage Workers
      </h2>

      <form onSubmit={handleAddWorker} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 bg-blue-50 p-6 rounded-lg shadow">
        <input type="text" name="fullName" placeholder="Full Name" value={newWorker.fullName} onChange={handleWorkerChange} className="p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
        <input type="email" name="email" placeholder="Email" value={newWorker.email} onChange={handleWorkerChange} className="p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
        <input type="text" name="phone" placeholder="Phone" value={newWorker.phone} onChange={handleWorkerChange} className="p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
        <input type="text" name="category" placeholder="Category" value={newWorker.category} onChange={handleWorkerChange} className="p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
        <input type="text" name="address" placeholder="Address" value={newWorker.address} onChange={handleWorkerChange} className="p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
        <input type="number" name="experience" placeholder="Experience (years)" value={newWorker.experience} onChange={handleWorkerChange} className="p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
        <input type="text" name="profilePicture" placeholder="Profile Picture URL" value={newWorker.profilePicture} onChange={handleWorkerChange} className="p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isVerified" checked={newWorker.isVerified} onChange={handleWorkerChange} /> Verified
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="registrationFeePaid" checked={newWorker.registrationFeePaid} onChange={handleWorkerChange} /> Reg. Fee Paid
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isAvailable" checked={newWorker.isAvailable || false} onChange={handleWorkerChange} /> Available
        </label>
        <input type="datetime-local" name="nextAvailableTime" placeholder="Next Available Time" value={newWorker.nextAvailableTime || ''} onChange={handleWorkerChange} className="p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition col-span-full font-semibold shadow">+ Add Worker</button>
      </form>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm border-collapse bg-white">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Category</th>
              <th className="p-3">Experience</th>
              <th className="p-3">Address</th>
              <th className="p-3">Profile</th>
              <th className="p-3">Verified</th>
              <th className="p-3">Reg. Fee</th>
              <th className="p-3">Available</th>
              <th className="p-3">Next Avail.</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w) => (
              <tr key={w._id} className="border-t hover:bg-blue-50 transition">
                <td className="p-3">{w.fullName || '-'}</td>
                <td className="p-3">{w.email || '-'}</td>
                <td className="p-3">{w.phone || '-'}</td>
                <td className="p-3">{w.category || '-'}</td>
                <td className="p-3">{w.experience ? `${w.experience} yrs` : '-'}</td>
                <td className="p-3">{w.address || '-'}</td>
                <td className="p-3">
                  {w.profilePicture
                    ? <img src={w.profilePicture} alt="profile" className="w-10 h-10 rounded-full object-cover border" />
                    : <span className="inline-block w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">{w.fullName?.[0] || '-'}</span>
                  }
                </td>
                <td className="p-3">{w.isVerified ? "✅" : "❌"}</td>
                <td className="p-3">{w.registrationFeePaid ? "✅" : "❌"}</td>
                <td className="p-3">{w.isAvailable ? "✅" : "❌"}</td>
                <td className="p-3">{w.nextAvailableTime ? new Date(w.nextAvailableTime).toLocaleString() : '-'}</td>
                <td className="p-3">{w.createdAt ? new Date(w.createdAt).toLocaleDateString() : ""}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => openEditModal(w)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 shadow text-xs">Edit</button>
                  <button onClick={() => handleDeleteWorker(w._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 shadow text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-90 z-50 animate-fadein">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full animate-pop">
            {/* your edit modal content */}
          </div>
        </div>
      )}
    </div>
    {/* Animations */}
    <style>{`
      .animate-fadein { animation: fadein 1s; }
      @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
      .animate-slidein { animation: slidein 0.8s; }
      @keyframes slidein { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      .animate-pop { animation: pop 0.4s; }
      @keyframes pop { 0% { transform: scale(0.7); opacity: 0; } 80% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
      .animate-bounce { animation: bounce 0.7s; }
      @keyframes bounce { 0% { transform: translateY(-30px); } 50% { transform: translateY(10px); } 100% { transform: translateY(0); } }
    `}</style>
  </section>
)};