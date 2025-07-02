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
  try {
    // Prepare the payload with all fields
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
    // Save to backend (correct endpoint and payload)
    await axios.post('/api/workers', payload, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    // Reset form
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

  const handleDeleteWorker = async (id) => {
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

      <form onSubmit={handleAddWorker} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isAvailable" checked={newWorker.isAvailable || false} onChange={handleWorkerChange} /> Available
        </label>
        <input type="datetime-local" name="nextAvailableTime" placeholder="Next Available Time" value={newWorker.nextAvailableTime || ''} onChange={handleWorkerChange} className="p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition col-span-full">+ Add Worker</button>
      </form>

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
              <th className="p-2">Available</th>
              <th className="p-2">Next Avail.</th>
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
                  {w.profilePicture && <img src={w.profilePicture} alt="profile" className="w-10 h-10 rounded-full object-cover" />}
                </td>
                <td className="p-2">{w.isVerified ? "✅" : "❌"}</td>
                <td className="p-2">{w.registrationFeePaid ? "✅" : "❌"}</td>
                <td className="p-2">{w.isAvailable ? "✅" : "❌"}</td>
                <td className="p-2">{w.nextAvailableTime ? new Date(w.nextAvailableTime).toLocaleString() : '-'}</td>
                <td className="p-2">{w.createdAt ? new Date(w.createdAt).toLocaleDateString() : ""}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => openEditModal(w)} className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700">Edit</button>
                  <button onClick={() => handleDeleteWorker(w._id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-90 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            {/* your edit modal content */}
          </div>
        </div>
      )}
    </section>
  );
}
 