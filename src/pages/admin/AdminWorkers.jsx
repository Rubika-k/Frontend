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
    isAvailable: false,
    nextAvailableTime: ''
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState({});
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });
  const adminToken = localStorage.getItem('token');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchWorkers();
    // eslint-disable-next-line
  }, []);

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: '' }), 3000);
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


  // Handler functions (ensure these are defined)
  const handleWorkerChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewWorker((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddWorker = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/workers', newWorker, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      showPopup('Worker added successfully!', 'success');
      setNewWorker({
        fullName: '',
        email: '',
        phone: '',
        profilePicture: '',
        address: '',
        experience: '',
        category: '',
        isVerified: false,
        registrationFeePaid: false,
        isAvailable: false,
        nextAvailableTime: ''
      });
      fetchWorkers();
    } catch (error) {
      showPopup(error?.response?.data?.message || 'Failed to add worker', 'error');
    }
  };

  const openEditModal = (worker) => {
    setEditingWorker(worker);
    setEditModalOpen(true);
  };

  const saveUpdatedWorker = async () => {
    try {
      const res = await axios.put(`/api/workers/${editingWorker._id}`, editingWorker, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      showPopup('Worker updated successfully!', 'success');
      setEditModalOpen(false);
      setEditingWorker({});
      fetchWorkers();
    } catch (error) {
      showPopup(error?.response?.data?.message || 'Failed to update worker', 'error');
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
    } catch (error) {
      showPopup(error?.response?.data?.message || 'Failed to delete worker', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 animate-fadein py-8 px-4 sm:px-6">
      {/* Notification Popup */}
      {popup.show && (
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-xl text-white font-medium flex items-center gap-2 ${
          popup.type === 'success' ? 'bg-emerald-500' : 
          popup.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
        } animate-pop`}>
          {popup.type === 'success' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : popup.type === 'error' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {popup.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden animate-pop">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Manage Workers</h2>
              <p className="text-blue-100 mt-1">Add, edit and manage all service workers</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search workers..."
                className="pl-10 pr-4 py-2.5 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 w-full md:w-64 bg-white/20 text-white placeholder-blue-100 transition-all duration-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="absolute left-3 top-3 h-4 w-4 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Add Worker Form */}
        <div className="border-b border-blue-100">
          <form onSubmit={handleAddWorker} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6 bg-blue-50/50">
            <div className="space-y-1">
              <label className="text-sm font-medium text-blue-800">Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                value={newWorker.fullName} 
                onChange={handleWorkerChange} 
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300" 
                required 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-blue-800">Email</label>
              <input 
                type="email" 
                name="email" 
                value={newWorker.email} 
                onChange={handleWorkerChange} 
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300" 
                required 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-blue-800">Phone</label>
              <input 
                type="text" 
                name="phone" 
                value={newWorker.phone} 
                onChange={handleWorkerChange} 
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300" 
                required 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-blue-800">Category</label>
              <input 
                type="text" 
                name="category" 
                value={newWorker.category} 
                onChange={handleWorkerChange} 
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300" 
                required 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-blue-800">Address</label>
              <input 
                type="text" 
                name="address" 
                value={newWorker.address} 
                onChange={handleWorkerChange} 
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300" 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-blue-800">Experience (years)</label>
              <input 
                type="number" 
                name="experience" 
                value={newWorker.experience} 
                onChange={handleWorkerChange} 
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300" 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-blue-800">Profile Picture URL</label>
              <input 
                type="text" 
                name="profilePicture" 
                value={newWorker.profilePicture} 
                onChange={handleWorkerChange} 
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300" 
              />
            </div>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  name="isVerified" 
                  checked={newWorker.isVerified} 
                  onChange={handleWorkerChange} 
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500" 
                />
                Verified
              </label>
              
              <label className="flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  name="registrationFeePaid" 
                  checked={newWorker.registrationFeePaid} 
                  onChange={handleWorkerChange} 
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500" 
                />
                Fee Paid
              </label>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  name="isAvailable" 
                  checked={newWorker.isAvailable || false} 
                  onChange={handleWorkerChange} 
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500" 
                />
                Available
              </label>
              
              <div className="flex-1">
                <label className="text-sm font-medium text-blue-800 block mb-1">Available From</label>
                <input 
                  type="datetime-local" 
                  name="nextAvailableTime" 
                  value={newWorker.nextAvailableTime || ''} 
                  onChange={handleWorkerChange} 
                  className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 text-sm" 
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="col-span-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Worker
            </button>
          </form>
        </div>

        {/* Workers Table */}
        <div className="overflow-x-auto p-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="p-4 font-semibold text-left">Worker</th>
                <th className="p-4 font-semibold text-left">Contact</th>
                <th className="p-4 font-semibold text-left">Details</th>
                <th className="p-4 font-semibold text-left">Status</th>
                <th className="p-4 font-semibold text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {workers
                .filter(w => w.fullName?.toLowerCase().includes(search.toLowerCase()))
                .map((w) => (
                  <tr key={w._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {w.profilePicture ? (
                          <img src={w.profilePicture} alt="profile" className="w-10 h-10 rounded-full object-cover border border-blue-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold uppercase">
                            {w.fullName?.[0] || '-'}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{w.fullName || '-'}</div>
                          <div className="text-xs text-gray-500">{w.category || 'No category'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-700">{w.email || '-'}</div>
                      <div className="text-sm text-gray-500">{w.phone || '-'}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-700">{w.address || '-'}</div>
                      <div className="text-sm text-gray-500">{w.experience ? `${w.experience} yrs exp` : '-'}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          w.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {w.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          w.registrationFeePaid ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {w.registrationFeePaid ? 'Fee Paid' : 'Fee Due'}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          w.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {w.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      {w.nextAvailableTime && (
                        <div className="text-xs text-gray-500 mt-1">
                          Next: {new Date(w.nextAvailableTime).toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openEditModal(w)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteWorker(w._id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {w.createdAt && new Date(w.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Worker Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm animate-fadein">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 animate-pop">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Edit Worker</h3>
              <button 
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
              {/* Keep all your existing edit form fields exactly as they are */}
              {/* ... */}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingWorker({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={saveUpdatedWorker}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        .animate-fadein { animation: fadein 0.3s ease-out; }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        .animate-pop { animation: pop 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes pop { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}