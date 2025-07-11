import React, { useState, useEffect } from 'react';
import axios from "../../config/axiosConfig";
import { FiXCircle, FiCheckCircle, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function AdminWorkers() {
  const [categories, setCategories] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "",
    category: "", profilePicture: "",
    isVerified: false,
    registrationFeePaid: false,
    isAvailable: true,
    nextAvailableTime: ""
  });
  const [editingWorker, setEditingWorker] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteWorker, setDeleteWorker] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [loading, setLoading] = useState({
    categories: false,
    workers: false,
    form: false
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const defaultPic = "/default-profile.png";

  // Temporary message display
  const showMessage = (type, msg) => {
    if (type === 'error') setError(msg);
    if (type === 'success') setSuccess(msg);
    setTimeout(() => {
      if (type === 'error') setError(null);
      if (type === 'success') setSuccess(null);
    }, 3000);
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(l => ({ ...l, categories: true }));
      try {
        const res = await axios.get('/categories');
        setCategories(res.data?.data || res.data || []);
      } catch (err) {
        showMessage('error', "Failed to load categories");
      } finally {
        setLoading(l => ({ ...l, categories: false }));
      }
    };
    fetchCategories();
  }, []);

  // Fetch workers
  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(l => ({ ...l, workers: true }));
      setError(null);
      try {
        const res = await axios.get(
          selectedCategory
            ? `/workers/category?category=${selectedCategory}`
            : '/workers'
        );
        setWorkers(res.data?.data || res.data || []);
      } catch (err) {
        showMessage('error', "Failed to load workers");
      } finally {
        setLoading(l => ({ ...l, workers: false }));
      }
    };
    fetchWorkers();
  }, [selectedCategory]);

  // Helper to get category name
  const getCatName = id => {
    const cat = categories.find(c => c._id === id);
    return cat ? cat.name : '-';
  };

  // Add Worker
  const handleAdd = async e => {
    e.preventDefault();
    setLoading(l => ({ ...l, form: true }));
    try {
      if (!formData.category) throw new Error("Select a category");
      const payload = { 
        ...formData, 
        category: formData.category, 
        role: "worker" 
      };
      const res = await axios.post('/workers', payload);
      setWorkers(w => [res.data?.data || res.data, ...w]);
      showMessage('success', "Worker added successfully");
      setFormData({
        fullName: "", email: "", phone: "",
        category: "", profilePicture: "",
        isVerified: false,
        registrationFeePaid: false,
        isAvailable: true,
        nextAvailableTime: ""
      });
    } catch (err) {
      showMessage('error', err.response?.data?.message || err.message);
    } finally {
      setLoading(l => ({ ...l, form: false }));
    }
  };

  // Open Edit Modal
  const openEdit = w => {
    setEditingWorker({
      ...w,
      category: w.category?._id || w.category || "",
      nextAvailableTime: w.nextAvailableTime?.slice(0,16) || ""
    });
    setEditModalOpen(true);
  };

  // Save Edit
  const saveEdit = async () => {
    setLoading(l => ({ ...l, form: true }));
    try {
      const payload = { 
        ...editingWorker,
        category: editingWorker.category
      };
      const res = await axios.put(`/workers/${editingWorker._id}`, payload);
      setWorkers(w =>
        w.map(x => x._id === editingWorker._id ? (res.data?.data || res.data) : x)
      );
      showMessage('success', "Worker updated successfully");
      setEditModalOpen(false);
    } catch (err) {
      showMessage('error', err.response?.data?.message || err.message);
    } finally {
      setLoading(l => ({ ...l, form: false }));
    }
  };

  // Confirm Delete
  const confirmDelete = w => {
    setDeleteWorker(w);
    setDeleteModalOpen(true);
  };

  // Perform Delete
  const doDelete = async () => {
    setLoading(l => ({ ...l, form: true }));
    try {
      await axios.delete(`/workers/${deleteWorker._id}`);
      setWorkers(w => w.filter(x => x._id !== deleteWorker._id));
      showMessage('success', "Worker deleted successfully");
      setDeleteModalOpen(false);
    } catch (err) {
      showMessage('error', err.response?.data?.message || err.message);
    } finally {
      setLoading(l => ({ ...l, form: false }));
    }
  };

  // Filtered list
  const list = workers
    .filter(w => w.fullName?.toLowerCase()?.includes(search.toLowerCase()))
    .filter(w => !selectedCategory || w.category === selectedCategory);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Workers</h1>

      {/* Alerts */}
      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded animate-fade-in-out">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-100 text-green-800 rounded animate-fade-in-out">
          {success}
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="border p-2 rounded"
          disabled={loading.categories}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Add Form */}
      <div className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="font-semibold">Add New Worker</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            required name="fullName" placeholder="Full Name"
            value={formData.fullName}
            onChange={e => setFormData(fd => ({ ...fd, fullName: e.target.value }))}
            className="border p-2 rounded"
            disabled={loading.form}
          />
          <input
            required type="email" name="email" placeholder="Email"
            value={formData.email}
            onChange={e => setFormData(fd => ({ ...fd, email: e.target.value }))}
            className="border p-2 rounded"
            disabled={loading.form}
          />
          <input
            name="phone" placeholder="Phone"
            value={formData.phone}
            onChange={e => setFormData(fd => ({ ...fd, phone: e.target.value }))}
            className="border p-2 rounded"
            disabled={loading.form}
          />
          <select
            required name="category"
            value={formData.category}
            onChange={e => setFormData(fd => ({ ...fd, category: e.target.value }))}
            className="border p-2 rounded"
            disabled={loading.form || loading.categories}
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <input
            name="profilePicture" placeholder="Profile Picture URL"
            value={formData.profilePicture}
            onChange={e => setFormData(fd => ({ ...fd, profilePicture: e.target.value }))}
            className="border p-2 rounded col-span-1 md:col-span-2"
            disabled={loading.form}
          />
          <input
            type="datetime-local" name="nextAvailableTime"
            value={formData.nextAvailableTime}
            onChange={e => setFormData(fd => ({ ...fd, nextAvailableTime: e.target.value }))}
            className="border p-2 rounded"
            disabled={loading.form}
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.isVerified}
                onChange={e => setFormData(fd => ({ ...fd, isVerified: e.target.checked }))}
                disabled={loading.form}
              /> Verified
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.registrationFeePaid}
                onChange={e => setFormData(fd => ({ ...fd, registrationFeePaid: e.target.checked }))}
                disabled={loading.form}
              /> Fee Paid
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={e => setFormData(fd => ({ ...fd, isAvailable: e.target.checked }))}
                disabled={loading.form}
              /> Available
            </label>
          </div>
          <button
            type="submit"
            disabled={loading.form}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading.form ? 'Adding...' : 'Add Worker'}
          </button>
        </form>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              {['Photo','Name','Email','Phone','Category','Verified','FeePaid','Available','NextAvail','Actions'].map(h => (
                <th key={h} className="px-3 py-2 text-left text-sm font-medium text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading.workers ? (
              <tr>
                <td colSpan="10" className="text-center p-4">
                  Loading workers...
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center p-4 text-gray-500">
                  No workers found
                </td>
              </tr>
            ) : (
              list.map(w => (
                <tr key={w._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <img
                      src={
                        w.profilePicture &&
                        (w.profilePicture.startsWith('http') || w.profilePicture.startsWith('data:image/'))
                          ? w.profilePicture
                          : defaultPic
                      }
                      alt="" className="h-10 w-10 rounded-full object-cover"
                      onError={e => e.target.src = defaultPic}
                    />
                  </td>
                  <td className="px-3 py-2">{w.fullName}</td>
                  <td className="px-3 py-2">{w.email}</td>
                  <td className="px-3 py-2">{w.phone || '-'}</td>
                  <td className="px-3 py-2">{getCatName(w.category)}</td>
                  <td className="px-3 py-2">
                    {w.isVerified
                      ? <FiCheckCircle className="text-green-600 inline" />
                      : <FiXCircle className="text-red-600 inline" />}
                  </td>
                  <td className="px-3 py-2">
                    {w.registrationFeePaid
                      ? <FiCheckCircle className="text-green-600 inline" />
                      : <FiXCircle className="text-red-600 inline" />}
                  </td>
                  <td className="px-3 py-2">
                    {w.isAvailable
                      ? <FiCheckCircle className="text-green-600 inline" />
                      : <FiXCircle className="text-red-600 inline" />}
                  </td>
                  <td className="px-3 py-2">
                    {w.nextAvailableTime
                      ? new Date(w.nextAvailableTime).toLocaleString()
                      : '-'}
                  </td>
                  <td className="px-3 py-2 space-x-2">
                    <button
                      onClick={() => openEdit(w)}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                      disabled={loading.form}
                    >
                      <FiEdit2 /> Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(w)}
                      className="text-red-600 hover:underline flex items-center gap-1"
                      disabled={loading.form}
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Worker</h3>
              <button 
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                disabled={loading.form}
              >
                &times;
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              { ['fullName','email','phone','profilePicture'].map(f => (
                <div key={f}>
                  <label className="block text-sm mb-1 capitalize">{f}</label>
                  <input
                    type={f==='email'?'email':f==='phone'?'tel':'text'}
                    value={editingWorker[f]||''}
                    onChange={e => setEditingWorker(w => ({ ...w, [f]: e.target.value }))}
                    className="border p-2 rounded w-full"
                    disabled={loading.form}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm mb-1">Category</label>
                <select
                  value={editingWorker.category}
                  onChange={e => setEditingWorker(w => ({ ...w, category: e.target.value }))}
                  className="border p-2 rounded w-full"
                  disabled={loading.form || loading.categories}
                >
                  <option value="">Select</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Next Available</label>
                <input
                  type="datetime-local"
                  value={editingWorker.nextAvailableTime||''}
                  onChange={e => setEditingWorker(w => ({ ...w, nextAvailableTime: e.target.value }))}
                  className="border p-2 rounded w-full"
                  disabled={loading.form}
                />
              </div>
              { ['isVerified','registrationFeePaid','isAvailable'].map(cb => (
                <label key={cb} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingWorker[cb]||false}
                    onChange={e => setEditingWorker(w => ({ ...w, [cb]: e.target.checked }))}
                    className="h-4 w-4"
                    disabled={loading.form}
                  />
                  <span className="text-sm text-gray-700 capitalize">{cb.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              )) }
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
                disabled={loading.form}
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={loading.form}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading.form ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-red-600">Confirm Delete</h3>
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                disabled={loading.form}
              >
                &times;
              </button>
            </div>
            <p className="mb-4">
              Are you sure you want to delete worker <strong>{deleteWorker?.fullName}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
                disabled={loading.form}
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                disabled={loading.form}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {loading.form ? 'Deleting...' : 'Delete Worker'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}