import React, { useEffect, useState } from 'react';
import axios from '../../config/axiosConfig';

export default function AdminServices() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '',
    description: '',
    image: ''
  });
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });
  const adminToken = localStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: '' }), 3000);
  };

  const fetchCategories = async () => {
    const res = await axios.get('/categories');
    setCategories(res.data || []);
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: name === 'workers' ? Number(value) : value });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    await axios.post('/categories', newCategory, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    setNewCategory({
      name: '',
      icon: '',
      description: '',
      image: ''
    });
    fetchCategories();
    showPopup('Service category added successfully!', 'success');
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await axios.delete(`/categories/${id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    fetchCategories();
    showPopup('Service category deleted successfully!', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4 sm:px-6">
      {/* Toast */}
      {popup.show && (
        <div className={`
          fixed top-6 left-1/2 transform -translate-x-1/2 z-50
          max-w-md w-full px-4 py-3 rounded-lg shadow-lg
          backdrop-blur-sm bg-white/90 border
          flex items-start space-x-3
          transition-all duration-300 ease-out
          ${popup.type === 'success' ? 'border-emerald-200 text-emerald-800' : 'border-rose-200 text-rose-800'}
        `}>
          <div className={`
            flex-shrink-0 h-6 w-6 mt-0.5
            ${popup.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}
          `}>
            {popup.type === 'success' ? (
              <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium">{popup.type === 'success' ? 'Success' : 'Error'}</p>
            <p className="text-sm opacity-90">{popup.message}</p>
          </div>
          <button 
            onClick={() => setPopup({...popup, show: false})}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden animate-pop">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Service Categories</h2>
          <p className="text-blue-100 mt-1">Manage all service categories</p>
        </div>

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="p-6 border-b border-blue-100">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Add New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Category Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Plumbing"
                value={newCategory.name}
                onChange={handleCategoryChange}
                className="w-full p-3 border border-blue-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Icon (emoji or URL)</label>
              <input
                type="text"
                name="icon"
                placeholder="🔧 or image URL"
                value={newCategory.icon}
                onChange={handleCategoryChange}
                className="w-full p-3 border border-blue-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Description</label>
              <textarea
                name="description"
                placeholder="Brief description"
                value={newCategory.description}
                onChange={handleCategoryChange}
                className="w-full p-3 border border-blue-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Image URL</label>
              <input
                type="text"
                name="image"
                placeholder="https://..."
                value={newCategory.image}
                onChange={handleCategoryChange}
                className="w-full p-3 border border-blue-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Workers Count</label>
              <input
                type="number"
                name="workers"
                min="0"
                placeholder="0"
                value={newCategory.workers}
                onChange={handleCategoryChange}
                className="w-full p-3 border border-blue-200 rounded-lg"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg shadow-md"
              >
                Add Category
              </button>
            </div>
          </div>
        </form>

        {/* Category List */}
        <div className="p-6">
          {categories.length === 0 ? (
            <div className="text-center p-8 text-gray-500 bg-blue-50/50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2 font-medium">No categories found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div key={cat._id} className="bg-white border border-blue-100 rounded-lg shadow-sm p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                      {cat.icon ? (
                        cat.icon.startsWith('http') ? (
                          <img src={cat.icon} alt="icon" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <span>{cat.icon}</span>
                        )
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{cat.name}</h3>
                      <p className="text-xs text-gray-500">ID: {cat._id?.slice(-6)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-50"
                    title="Delete category"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .animate-pop { animation: pop 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes pop { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1); } }
      `}</style>
    </div>
  );
}
