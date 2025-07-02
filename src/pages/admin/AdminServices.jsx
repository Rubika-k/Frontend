import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';

export default function AdminServices() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', icon: '' });
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });
  const adminToken = localStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: '' }), 2000);
  };

  const fetchCategories = async () => {
    const res = await axios.get('/api/categories');
    setCategories(res.data || []);
  };

  const handleCategoryChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    await axios.post('/api/categories', newCategory, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    setNewCategory({ name: '', icon: '' });
    fetchCategories();
    showPopup('Service category added successfully!', 'success');
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await axios.delete(`/api/categories/${id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    fetchCategories();
    showPopup('Service category deleted successfully!', 'success');
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 animate-fadein py-10">
    <section className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl mx-auto mt-8 animate-pop relative">
      {popup.show && (
        <div
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-8 py-4 rounded-xl shadow-2xl text-white text-lg font-semibold ${popup.type === 'success' ? 'bg-green-600' : 'bg-red-600'} animate-pop`}
        >
          {popup.message}
        </div>
      )}
      <h2 className="text-3xl font-extrabold text-blue-700 mb-8 tracking-tight animate-slidein drop-shadow">
        Service Categories
      </h2>
      <form
        onSubmit={handleAddCategory}
        className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between bg-blue-50 p-6 rounded-lg shadow"
      >
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={newCategory.name}
          onChange={handleCategoryChange}
          className="p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-1/2 transition"
          required
        />
        <input
          type="text"
          name="icon"
          placeholder="Icon (emoji or url, optional)"
          value={newCategory.icon}
          onChange={handleCategoryChange}
          className="p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-1/3 transition"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition w-full md:w-40 shadow"
        >
          + Add
        </button>
      </form>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm border-collapse bg-white">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="p-3 font-semibold">Icon</th>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-6 text-gray-400 font-medium bg-gray-50 animate-fadein">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="border-b hover:bg-blue-50 transition">
                  <td className="p-3 text-2xl text-center">
                    {cat.icon ? (
                      cat.icon.startsWith('http') ? (
                        <img src={cat.icon} alt="icon" className="w-8 h-8 mx-auto rounded-full shadow" />
                      ) : (
                        <span>{cat.icon}</span>
                      )
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="p-3 font-medium">{cat.name}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
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
  </div>
)};