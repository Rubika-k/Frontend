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
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 py-10 animate-fadein">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-extrabold mb-10 text-blue-700 text-center drop-shadow animate-slidein">
        Service Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {categories.map((cat, idx) => (
          <div
            key={cat._id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center cursor-pointer border-t-4 border-blue-500 hover:bg-blue-50 animate-pop"
            style={{ animationDelay: `${idx * 0.08}s` }}
            onClick={() =>
              navigate(
                `/categories/${cat._id}?category=${encodeURIComponent(cat.name)}`
              )
            }
          >
            <div className="mb-4 w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 shadow-inner overflow-hidden animate-pop">
              {cat.icon && cat.icon.startsWith("http") ? (
                <img
                  src={cat.icon}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl">{cat.icon || "🔧"}</span>
              )}
            </div>
            <div className="font-bold text-lg text-blue-700 mb-2 text-center">
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
    {/* Animations */}
    <style>{`
      .animate-fadein { animation: fadein 1s; }
      @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
      .animate-slidein { animation: slidein 0.8s; }
      @keyframes slidein { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      .animate-pop { animation: pop 0.5s; }
      @keyframes pop { 0% { transform: scale(0.7); opacity: 0; } 80% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
    `}</style>
  </div>
)};