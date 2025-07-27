import React, { useState, useEffect } from 'react';
import axios from "../../config/axiosConfig";
import {
  FiXCircle,
  FiCheckCircle,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminWorkers() {
  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    category: "",
    profilePicture: null,
    workExperience: "",
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
  const [loading, setLoading] = useState({ categories: false, workers: false, form: false });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [workersPerPage] = useState(10);
  const defaultPic = "/default-profile.png";

  const showMessage = (type, msg) => {
    if (type === 'error') setError(msg);
    if (type === 'success') setSuccess(msg);
    setTimeout(() => {
      if (type === 'error') setError(null);
      if (type === 'success') setSuccess(null);
    }, 3000);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(l => ({ ...l, categories: true }));
      try {
        const res = await axios.get('/categories');
        setCategories(res.data?.data || res.data || []);
      } catch {
        showMessage('error', "Failed to load categories");
      } finally {
        setLoading(l => ({ ...l, categories: false }));
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(l => ({ ...l, workers: true }));
      try {
        let url = 'workers/admin';
        if (selectedCategory) url = `workers?category=${selectedCategory}`;
        const res = await axios.get(url);
        setWorkers(res.data?.data || res.data || []);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching workers:", err);
        showMessage('error', "Failed to load workers");
      } finally {
        setLoading(l => ({ ...l, workers: false }));
      }
    };
    fetchWorkers();
  }, [selectedCategory]);

  const getCatName = id => {
    const cat = categories.find(c => c._id === id);
    return cat ? cat.name : '-';
  };

  const handleAdd = async e => {
    e.preventDefault();
    setLoading(l => ({ ...l, form: true }));
    setPreviewImage(null);

    try {
      if (!formData.category) throw new Error("Please select a category");

      // Construct FormData object
      const form = new FormData();
      form.append("fullName", formData.fullName);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("category", formData.category);
      form.append("workExperience", formData.workExperience);
      form.append("isVerified", formData.isVerified);
      form.append("registrationFeePaid", formData.registrationFeePaid);
      form.append("isAvailable", formData.isAvailable);
      form.append("nextAvailableTime", formData.nextAvailableTime);

      if (formData.profilePicture) {
        form.append("profilePicture", formData.profilePicture);
      }

      const res = await axios.post('/workers', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setWorkers(w => [res.data?.data || res.data, ...w]);
      toast.success("Worker added successfully");

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        category: "",
        profilePicture: null,
        workExperience: "",
        isVerified: false,
        registrationFeePaid: false,
        isAvailable: true,
        nextAvailableTime: ""
      });
      setPreviewImage(null);

    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to add worker");
    } finally {
      setLoading(l => ({ ...l, form: false }));
    }
  };


  const openEdit = w => {
    setEditingWorker({
      ...w,
      category: w.category?._id || w.category || "",
      nextAvailableTime: w.nextAvailableTime?.slice(0, 16) || "",
      profilePicture: null
    });
    setPreviewImage(w.profilePicture || null);
    setEditModalOpen(true);
  };

 const saveEdit = async () => {
  setLoading(l => ({ ...l, form: true }));

  try {
    const form = new FormData();

    // Always include these fields
    form.append("fullName", editingWorker.fullName);
    form.append("email", editingWorker.email);
    form.append("phone", editingWorker.phone);
    form.append("category", editingWorker.category);
    form.append("workExperience", editingWorker.workExperience);
    form.append("isVerified", editingWorker.isVerified ? "true" : "false");
    form.append("registrationFeePaid", editingWorker.registrationFeePaid ? "true" : "false");
    form.append("isAvailable", editingWorker.isAvailable ? "true" : "false");
    form.append("nextAvailableTime", editingWorker.nextAvailableTime);

    // Only append file if it's a new file
    if (editingWorker.profilePicture instanceof File) {
      form.append("profilePicture", editingWorker.profilePicture);
    }

    const res = await axios.put(`/workers/${editingWorker._id}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    setWorkers(w =>
      w.map(x => x._id === editingWorker._id ? (res.data?.data || res.data) : x)
    );
    toast.success("Worker updated successfully");
    setEditModalOpen(false);
    setEditingWorker(null);
    setPreviewImage(null);

  } catch (err) {
    toast.error(err.response?.data?.message || err.message || "Failed to update worker");
  } finally {
    setLoading(l => ({ ...l, form: false }));
  }
};


  const confirmDelete = w => {
    setDeleteWorker(w);
    setDeleteModalOpen(true);
  };

  const doDelete = async () => {
    setLoading(l => ({ ...l, form: true }));
    try {
      await axios.delete(`/workers/${deleteWorker._id}`);
      setWorkers(w => w.filter(x => x._id !== deleteWorker._id));
      toast.success("Worker deleted successfully");
      setDeleteModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to delete worker");
    } finally {
      setLoading(l => ({ ...l, form: false }));
    }
  };

  const filteredWorkers = workers
    .filter(w => w.fullName?.toLowerCase().includes(search.toLowerCase()))
    .filter(w => !selectedCategory || String(w.category) === String(selectedCategory));

  const indexOfLastWorker = currentPage * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = filteredWorkers.slice(indexOfFirstWorker, indexOfLastWorker);
  const totalPages = Math.ceil(filteredWorkers.length / workersPerPage);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="p-6 space-y-6 max-w-8xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Manage Workers</h1>
      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded-lg border border-red-200 transition-opacity duration-1000">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-100 text-green-800 rounded-lg border border-green-200 transition-opacity duration-1000">
          {success}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 p-2 pl-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <FiXCircle />
            </button>
          )}
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading.categories}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 border border-gray-100">
        <h2 className="font-semibold text-lg text-gray-700">Add New Worker</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              required
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={e => setFormData(fd => ({ ...fd, fullName: e.target.value }))}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading.form}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              required
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={e => setFormData(fd => ({ ...fd, email: e.target.value }))}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading.form}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={e => setFormData(fd => ({ ...fd, phone: e.target.value }))}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading.form}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              required
              name="category"
              value={formData.category}
              onChange={e => setFormData(fd => ({ ...fd, category: e.target.value }))}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading.form || loading.categories}
            >
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  setFormData(fd => ({ ...fd, profilePicture: file }));
                  setPreviewImage(URL.createObjectURL(file));
                }
              }}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading.form}
            />
            {previewImage && (
              <div className="mt-2">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-full border border-gray-300"
                />
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Work Experience</label>
            <textarea
              name="workExperience"
              placeholder="Work Experience"
              value={formData.workExperience}
              onChange={e => setFormData(fd => ({ ...fd, workExperience: e.target.value }))}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading.form}
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Next Available Time</label>
            <input
              type="datetime-local"
              name="nextAvailableTime"
              value={formData.nextAvailableTime}
              onChange={e => setFormData(fd => ({ ...fd, nextAvailableTime: e.target.value }))}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading.form}
            />
          </div>
          <div className="flex items-center gap-4 md:col-span-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.isVerified}
                onChange={e => setFormData(fd => ({ ...fd, isVerified: e.target.checked }))}
                disabled={loading.form}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              /> Verified
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.registrationFeePaid}
                onChange={e => setFormData(fd => ({ ...fd, registrationFeePaid: e.target.checked }))}
                disabled={loading.form}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              /> Fee Paid
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={e => setFormData(fd => ({ ...fd, isAvailable: e.target.checked }))}
                disabled={loading.form}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              /> Available
            </label>
          </div>
          <div className="md:col-span-4 flex justify-end">
            <button
              type="submit"
              disabled={loading.form}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {loading.form ? 'Adding...' : 'Add Worker'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-auto border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Photo', 'Name', 'Email', 'Phone', 'Category', 'Experience', 'Verified', 'Fee Paid', 'Available', 'Next Available', 'Actions'].map(h => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading.workers ? (
                <tr>
                  <td colSpan="11" className="px-6 py-4 text-center">
                    <div className="animate-pulse flex justify-center">
                      <div className="h-8 w-8 bg-blue-200 rounded-full"></div>
                    </div>
                  </td>
                </tr>
              ) : currentWorkers.length === 0 ? (
                <tr>
                  <td colSpan="11" className="px-6 py-4 text-center text-gray-500">
                    No workers found
                  </td>
                </tr>
              ) : (
                currentWorkers.map(w => (
                  <tr key={w._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            src={
                              w.profilePicture &&
                                (w.profilePicture.startsWith('http') || w.profilePicture.startsWith('data:image/'))
                                ? w.profilePicture
                                : defaultPic
                            }
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                            onError={e => e.target.src = defaultPic}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {w.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {w.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {w.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getCatName(w.category)}
                    </td>                                      
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={w.work_experience}>
                      {w.work_experience || '-'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {w.isVerified
                        ? <FiCheckCircle className="text-green-500 inline" />
                        : <FiXCircle className="text-red-500 inline" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {w.registrationFeePaid
                        ? <FiCheckCircle className="text-green-500 inline" />
                        : <FiXCircle className="text-red-500 inline" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {w.isAvailable
                        ? <FiCheckCircle className="text-green-500 inline" />
                        : <FiXCircle className="text-red-500 inline" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {w.nextAvailableTime
                        ? new Date(w.nextAvailableTime).toLocaleString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEdit(w)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          disabled={loading.form}
                        >
                          <FiEdit2 className="h-4 w-4" /> Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(w)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          disabled={loading.form}
                        >
                          <FiTrash2 className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredWorkers.length > workersPerPage && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstWorker + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastWorker, filteredWorkers.length)}</span> of{' '}
                  <span className="font-medium">{filteredWorkers.length}</span> workers
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === number
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {editModalOpen && (
        // <div className=" inset-0 bg-blue-50 border-blue-500 h-200 w-200 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">Edit Worker</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                disabled={loading.form}
              >
                <span className="sr-only">Close</span>
                <FiXCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['fullName', 'email', 'phone'].map(f => (
                  <div key={f}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {f.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                      type={f === 'email' ? 'email' : f === 'phone' ? 'tel' : 'text'}
                      value={editingWorker[f] || ''}
                      onChange={e => setEditingWorker(w => ({ ...w, [f]: e.target.value }))}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading.form}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        setEditingWorker(w => ({ ...w, profilePicture: file }));
                        setPreviewImage(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading.form}
                  />
                  <div className="mt-2">
                    <img
                      src={
                        previewImage
                          ? previewImage
                          : (editingWorker.profilePicture && typeof editingWorker.profilePicture === 'string')
                            ? editingWorker.profilePicture
                            : defaultPic
                      }
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-full border border-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={editingWorker.category}
                    onChange={e => setEditingWorker(w => ({ ...w, category: e.target.value }))}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading.form || loading.categories}
                  >
                    <option value="">Select</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Available</label>
                  <input
                    type="datetime-local"
                    value={editingWorker.nextAvailableTime || ''}
                    onChange={e => setEditingWorker(w => ({ ...w, nextAvailableTime: e.target.value }))}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading.form}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Experience</label>
                  <textarea
                    value={editingWorker.workExperience || ''}
                    onChange={e => setEditingWorker(w => ({ ...w, workExperience: e.target.value }))}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading.form}
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  {['isVerified', 'registrationFeePaid', 'isAvailable'].map(cb => (
                    <label key={cb} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingWorker[cb] || false}
                        onChange={e => setEditingWorker(w => ({ ...w, [cb]: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={loading.form}
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {cb.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={loading.form}
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={loading.form}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading.form ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        // </div>
      )}

      {deleteModalOpen && (
        // <div className=" inset-0 bg-blue-50 border-blue-500 h-200 w-200 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold text-red-600">Confirm Delete</h3>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                disabled={loading.form}
              >
                <span className="sr-only">Close</span>
                <FiXCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete worker <strong className="font-semibold">{deleteWorker?.fullName}</strong>?
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={loading.form}
                >
                  Cancel
                </button>
                <button
                  onClick={doDelete}
                  disabled={loading.form}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {loading.form ? 'Deleting...' : 'Delete Worker'}
                </button>
              </div>
            </div>
          </div>
        // </div>
      )}
    </div>
  );
}