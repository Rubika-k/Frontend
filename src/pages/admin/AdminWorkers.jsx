import React, { useState, useEffect } from 'react';
import axios from "../../config/axiosConfig"; // ✅ Use your config with baseURL

export default function AdminWorkers() {
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


useEffect(() => {
  fetchWorkers();
}, [selectedCategory]);

const fetchWorkers = async () => {
  try {
    const query = selectedCategory ? `?category=${selectedCategory}` : "";
    const res = await axios.get(`/workers${query}`);
    setWorkers(res.data);
    console.log("✅ Workers fetched:", res.data);
  } catch (error) {
    console.error("❌ Failed to fetch workers:", error.response?.data || error.message);
  }
};



  const handleAddWorker = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/workers", {
        ...formData,
        role: "worker",
      });
      console.log("✅ Worker added:", res.data);
      setWorkers([...workers, res.data]);
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
    } catch (error) {
      console.error("❌ Error adding worker:", error.response?.data || error.message);
    }
  };

  const handleDeleteWorker = async (id) => {
    if (!window.confirm("Delete this worker?")) return;
    try {
      await axios.delete(`/workers/${id}`);
      setWorkers(workers.filter((worker) => worker._id !== id));
      console.log("✅ Worker deleted:", id);
    } catch (error) {
      console.error("❌ Failed to delete worker:", error.response?.data || error.message);
    }
  };

  const openEditModal = (worker) => {
    setEditingWorker({ ...worker });
    setEditModalOpen(true);
  };

  const saveUpdatedWorker = async () => {
    try {
      const res = await axios.put(`/workers/${editingWorker._id}`, editingWorker);
      const updatedWorkers = workers.map((worker) =>
        worker._id === editingWorker._id ? res.data : worker
      );
      setWorkers(updatedWorkers);
      setEditModalOpen(false);
      setEditingWorker(null);
      console.log("✅ Worker updated:", res.data);
    } catch (error) {
      console.error("❌ Failed to update worker:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Manage Workers</h2>

      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Search workers by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

<select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="mb-4 border border-blue-300 rounded-lg px-3 py-2"
>
  <option value="">All Categories</option>
  <option value="Electrician">Electrician</option>
  <option value="Plumber">Plumber</option>
  {/* Add more */}
</select>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <form onSubmit={handleAddWorker} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { name: "fullName", type: "text", placeholder: "Full Name" },
            { name: "email", type: "email", placeholder: "Email" },
            { name: "phone", type: "text", placeholder: "Phone" },
            { name: "category", type: "text", placeholder: "Category" },
            { name: "profilePicture", type: "text", placeholder: "Profile Picture URL" },
          ].map((input) => (
            <input
              key={input.name}
              type={input.type}
              name={input.name}
              value={formData[input.name]}
              onChange={(e) => setFormData({ ...formData, [input.name]: e.target.value })}
              placeholder={input.placeholder}
              className="p-2.5 border border-blue-200 rounded-lg"
              required
            />
          ))}

          <input
            type="datetime-local"
            name="nextAvailableTime"
            value={formData.nextAvailableTime}
            onChange={(e) => setFormData({ ...formData, nextAvailableTime: e.target.value })}
            className="p-2.5 border border-blue-200 rounded-lg"
          />

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
              />
              {checkbox.label}
            </label>
          ))}

          <div className="md:col-span-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300"
            >
              Add Worker
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto p-6 bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-blue-200">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Profile</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Verified</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Fee Paid</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Available</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-blue-100">
            {workers
              .filter((w) => w.fullName.toLowerCase().includes(search.toLowerCase()))
              .map((worker) => (
                <tr key={worker._id} className="hover:bg-blue-50 transition">
                  <td className="px-4 py-2">
                    <img
                      src={worker.profilePicture || "https://via.placeholder.com/40"}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">{worker.fullName}</td>
                  <td className="px-4 py-2">{worker.email}</td>
                  <td className="px-4 py-2">{worker.phone}</td>
                  <td className="px-4 py-2">{worker.category}</td>
                  <td className="px-4 py-2">{worker.isVerified ? "✅" : "❌"}</td>
                  <td className="px-4 py-2">{worker.registrationFeePaid ? "✅" : "❌"}</td>
                  <td className="px-4 py-2">{worker.isAvailable ? "✅" : "❌"}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => openEditModal(worker)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteWorker(worker._id)}
                      className="text-rose-600 hover:text-rose-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {editModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-blue-800">Edit Worker</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["fullName", "email", "phone", "category", "profilePicture"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  value={editingWorker[field] || ""}
                  onChange={(e) =>
                    setEditingWorker({ ...editingWorker, [field]: e.target.value })
                  }
                  placeholder={field}
                  className="p-2.5 border border-blue-200 rounded-lg"
                />
              ))}

              <input
                type="datetime-local"
                name="nextAvailableTime"
                value={editingWorker.nextAvailableTime || ""}
                onChange={(e) =>
                  setEditingWorker({ ...editingWorker, nextAvailableTime: e.target.value })
                }
                className="p-2.5 border border-blue-200 rounded-lg"
              />

              {[
                { name: "isVerified", label: "Verified" },
                { name: "registrationFeePaid", label: "Fee Paid" },
                { name: "isAvailable", label: "Available" },
              ].map((checkbox) => (
                <label key={checkbox.name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingWorker[checkbox.name] || false}
                    onChange={(e) =>
                      setEditingWorker({
                        ...editingWorker,
                        [checkbox.name]: e.target.checked,
                      })
                    }
                  />
                  {checkbox.label}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveUpdatedWorker}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
