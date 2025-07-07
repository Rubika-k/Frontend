import React, { useState, useEffect } from 'react';
import axios from "../../config/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function AdminWorkers() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    category: "",
    isVerified: false,
    registrationFeePaid: false,
    isAvailable: true,
    nextAvailableTime: "",
    profilePicture: "",
  });
  const [editingWorker, setEditingWorker] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState({
    categories: false,
    workers: false,
    form: false
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState(null);

  const defaultProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(prev => ({...prev, categories: true}));
        setError(null);
        const res = await axios.get('/categories');
        setCategories(res.data?.data || res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load categories");
        console.error("Categories Error:", err);
      } finally {
        setLoading(prev => ({...prev, categories: false}));
      }
    };
    fetchCategories();
  }, []);

  // Fetch workers with enhanced error handling
  // useEffect(() => {
  //   const fetchWorkers = async () => {
  //     try {
  //       setLoading(prev => ({...prev, workers: true}));
  //       setError(null);
        
  //       const endpoint = selectedCategory 
  //         // ? `/workers/category/${encodeURIComponent(selectedCategory)}`
  //         // : '/workers';

  //           ? `/workers/category?category=${encodeURIComponent(selectedCategory)}`
  // : '/workers/admin'; // 
        
  //       const res = await axios.get(endpoint);
        
  //       // Handle different API response structures
  //       const receivedData = res.data?.data || res.data?.workers || res.data;
  //       if (Array.isArray(receivedData)) {
  //         setWorkers(receivedData);
  //       } else {
  //         console.warn("Unexpected workers data format:", receivedData);
  //         setWorkers([]);
  //       }
  //     } catch (err) {
  //       const errorMsg = err.response?.data?.message || 
  //                      err.message || 
  //                      "Failed to load workers";
  //       setError(errorMsg);
  //       console.error("Fetch Workers Error:", err);
  //       setWorkers([]);
  //     } finally {
  //       setLoading(prev => ({...prev, workers: false}));
  //     }
  //   };
  //   fetchWorkers();
  // }, [selectedCategory]);

useEffect(() => {
  const fetchWorkers = async () => {
    try {
      setLoading(prev => ({ ...prev, workers: true }));
      setError(null);

      const endpoint = selectedCategory
  ? `/workers/category?category=${encodeURIComponent(selectedCategory)}`
  : '/workers/admin';

      const res = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const receivedData = res.data?.data || res.data?.workers || res.data;
      if (Array.isArray(receivedData)) {
        setWorkers(receivedData);
      } else {
        console.warn("Unexpected workers data format:", receivedData);
        setWorkers([]);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to load workers";
      setError(errorMsg);
      console.error("Fetch Workers Error:", err);
      setWorkers([]);
    } finally {
      setLoading(prev => ({ ...prev, workers: false }));
    }
  };

  fetchWorkers();
}, [selectedCategory]);



  const handleAddWorker = async (e) => {
    e.preventDefault();
    try {
      setLoading(prev => ({...prev, form: true}));
      setError(null);
      setSuccess(null);
      
      const res = await axios.post("/workers", {
        ...formData,
        role: "worker",
      });
      
      setWorkers([res.data?.data || res.data, ...workers]);
      setSuccess("Worker added successfully!");
      resetForm();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      "Failed to add worker";
      setError(errorMsg);
      console.error("Add Worker Error:", error);
    } finally {
      setLoading(prev => ({...prev, form: false}));
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      category: "",
      isVerified: false,
      registrationFeePaid: false,
      isAvailable: true,
      nextAvailableTime: "",
      profilePicture: "",
    });
  };

  const handleDeleteWorker = async (id) => {
    try {
      setLoading(prev => ({...prev, workers: true}));
      await axios.delete(`/workers/${id}`);
      setWorkers(workers.filter(worker => worker._id !== id));
      setSuccess("Worker deleted successfully!");
      setDeleteConfirmOpen(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      "Failed to delete worker";
      setError(errorMsg);
      console.error("Delete Worker Error:", error);
    } finally {
      setLoading(prev => ({...prev, workers: false}));
    }
  };

  const openDeleteConfirm = (worker) => {
    setWorkerToDelete(worker);
    setDeleteConfirmOpen(true);
  };

  const openEditModal = (worker) => {
    setEditingWorker({ 
      ...worker,
      nextAvailableTime: worker.nextAvailableTime ? worker.nextAvailableTime.split('.')[0] : ""
    });
    setEditModalOpen(true);
  };

  const saveUpdatedWorker = async () => {
    try {
      setLoading(prev => ({...prev, form: true}));
      setError(null);
      
      const res = await axios.put(`/workers/${editingWorker._id}`, editingWorker);
      
      setWorkers(workers.map(worker => 
        worker._id === editingWorker._id ? (res.data?.data || res.data) : worker
      ));
      setSuccess("Worker updated successfully!");
      setEditModalOpen(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      "Failed to update worker";
      setError(errorMsg);
      console.error("Update Worker Error:", error);
    } finally {
      setLoading(prev => ({...prev, form: false}));
    }
  };

  const filteredWorkers = workers.filter(worker => 
    worker?.fullName?.toLowerCase()?.includes(search?.toLowerCase() || "")
  );

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-8">
      {/* Notification Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
          <p>{success}</p>
        </div>
      )}

      <h2 className="text-2xl font-bold text-blue-800 mb-6">Manage Workers</h2>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search workers by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={loading.workers}
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={loading.categories}
          >
            <option value="">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat._id || cat}>
                {cat.name || cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Worker Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-700 mb-4">Add New Worker</h3>
        <form onSubmit={handleAddWorker} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { name: "fullName", type: "text", placeholder: "Full Name" },
            { name: "email", type: "email", placeholder: "Email" },
            { name: "phone", type: "tel", placeholder: "Phone" },
          ].map((input) => (
            <input
              key={input.name}
              type={input.type}
              name={input.name}
              value={formData[input.name]}
              onChange={(e) => setFormData({ ...formData, [input.name]: e.target.value })}
              placeholder={input.placeholder}
              className="p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              disabled={loading.form}
            />
          ))}

          <select
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            disabled={loading.form || loading.categories}
          >
            <option value="">Select Category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat._id || cat}>
                {cat.name || cat}
              </option>
            ))}
          </select>

          <input
            type="url"
            name="profilePicture"
            value={formData.profilePicture}
            onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
            placeholder="Profile Picture URL"
            className="p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={loading.form}
          />

          <input
            type="datetime-local"
            name="nextAvailableTime"
            value={formData.nextAvailableTime}
            onChange={(e) => setFormData({ ...formData, nextAvailableTime: e.target.value })}
            className="p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={loading.form}
          />

          <div className="flex flex-wrap gap-4 items-center">
            {[
              { name: "isVerified", label: "Verified" },
              { name: "registrationFeePaid", label: "Fee Paid" },
              { name: "isAvailable", label: "Available" },
            ].map((checkbox) => (
              <label key={checkbox.name} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={checkbox.name}
                  checked={formData[checkbox.name]}
                  onChange={(e) => setFormData({ ...formData, [checkbox.name]: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={loading.form}
                />
                {checkbox.label}
              </label>
            ))}
          </div>

          <div className="md:col-span-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
              disabled={loading.form}
            >
              {loading.form ? 'Adding...' : 'Add Worker'}
            </button>
          </div>
        </form>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Profile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Verified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Fee Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Available</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Next Available</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading.workers ? (
                <tr>
                  <td colSpan="10" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                    {workers.length === 0 ? "No workers found" : "No matching workers found"}
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((worker) => (
                  <tr key={worker._id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          src={worker.profilePicture || defaultProfilePic}
                          alt="Profile"
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = defaultProfilePic;
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {worker.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {worker.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {worker.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {worker.category?.name || worker.category || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        worker.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {worker.isVerified ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        worker.registrationFeePaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {worker.registrationFeePaid ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        worker.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {worker.isAvailable ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {worker.nextAvailableTime ? 
                        new Date(worker.nextAvailableTime).toLocaleString() : 
                        '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(worker)}
                          className="text-blue-600 hover:text-blue-900 disabled:text-gray-400"
                          disabled={loading.form}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(worker)}
                          className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                          disabled={loading.workers}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Worker Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-blue-800">Edit Worker</h3>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={loading.form}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "fullName", type: "text", label: "Full Name" },
                  { name: "email", type: "email", label: "Email" },
                  { name: "phone", type: "tel", label: "Phone" },
                  { name: "profilePicture", type: "url", label: "Profile Picture URL" },
                ].map((field) => (
                  <div key={field.name} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                    <input
                      type={field.type}
                      value={editingWorker[field.name] || ""}
                      onChange={(e) =>
                        setEditingWorker({ ...editingWorker, [field.name]: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading.form}
                    />
                  </div>
                ))}

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={editingWorker.category?._id || editingWorker.category || ""}
                    onChange={(e) =>
                      setEditingWorker({ ...editingWorker, category: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading.form || loading.categories}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat._id || cat}>
                        {cat.name || cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Next Available Time</label>
                  <input
                    type="datetime-local"
                    value={editingWorker.nextAvailableTime || ""}
                    onChange={(e) =>
                      setEditingWorker({ ...editingWorker, nextAvailableTime: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading.form}
                  />
                </div>

                <div className="space-y-2">
                  {[
                    { name: "isVerified", label: "Verified" },
                    { name: "registrationFeePaid", label: "Registration Fee Paid" },
                    { name: "isAvailable", label: "Available" },
                  ].map((checkbox) => (
                    <label key={checkbox.name} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingWorker[checkbox.name] || false}
                        onChange={(e) =>
                          setEditingWorker({
                            ...editingWorker,
                            [checkbox.name]: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={loading.form}
                      />
                      <span className="text-sm text-gray-700">{checkbox.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading.form}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveUpdatedWorker}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={loading.form}
                >
                  {loading.form ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-red-700">Confirm Deletion</h3>
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="mb-6 text-gray-700">
                Are you sure you want to delete worker <span className="font-semibold">{workerToDelete?.fullName}</span>? This action cannot be undone.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteWorker(workerToDelete._id)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  disabled={loading.workers}
                >
                  {loading.workers ? 'Deleting...' : 'Delete Worker'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}