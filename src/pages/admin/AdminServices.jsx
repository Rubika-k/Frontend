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
    <section className="bg-white rounded shadow p-6 relative">
      {popup.show && (
        <div
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white ${
            popup.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {popup.message}
        </div>
      )}
      <h2 className="text-lg font-semibold mb-4">Service Categories</h2>
      <form
        onSubmit={handleAddCategory}
        className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={newCategory.name}
          onChange={handleCategoryChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="icon"
          placeholder="Icon (optional)"
          value={newCategory.icon}
          onChange={handleCategoryChange}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add
        </button>
      </form>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Icon</th>
            <th className="p-2">Name</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center p-4 text-gray-500">
                No categories found.
              </td>
            </tr>
          ) : (
            categories.map((cat) => (
              <tr key={cat._id} className="border-t">
                <td className="p-2">{cat.icon || '—'}</td>
                <td className="p-2">{cat.name}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700 transition"
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