import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/categories").then(res => setCategories(res.data || []));
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-blue-500 text-center drop-shadow">
          Service Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map(cat => (
            <div
              key={cat._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-8 flex flex-col items-center cursor-pointer border-t-4 border-blue-500 hover:bg-blue-50"
              onClick={() =>
                navigate(
                  `/categories/${cat._id}?category=${encodeURIComponent(cat.name)}`
                )
              }
            >
              <div className="text-5xl mb-4">{cat.icon || "🔧"}</div>
              <div className="font-bold text-lg text-blue-700 mb-2">
                {cat.name}
              </div>
              <button
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow"
                onClick={e => {
                  e.stopPropagation();
                  navigate(
                    `/categories/${cat._id}?category=${encodeURIComponent(cat.name)}`
                  );
                }}
              >
                View Workers
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}