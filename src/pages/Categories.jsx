import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';   // 
import Footer from '@/components/Footer';   // 

const bgColors = [
  'bg-gradient-to-br from-blue-100 to-blue-50',
  'bg-gradient-to-br from-blue-50 to-white',
  'bg-gradient-to-br from-sky-50 to-blue-100',
  'bg-gradient-to-br from-white to-blue-50',
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories'); //
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories', err.message);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tr from-blue-50 to-blue-100">
     
      <Navbar />

      {/* ✅ Main content */}
      <main className="flex-grow py-12 px-6">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-b from-blue-600 to-blue-800 drop-shadow-lg animate-fadein">
          Explore Our Service Categories
        </h2>

        {categories.length === 0 ? (
          <p className="text-center text-gray-500">No categories found.</p>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.map((cat, idx) => (
              <div
                key={cat._id}
                className={`cursor-pointer rounded-3xl shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden flex flex-col justify-between ${bgColors[idx % bgColors.length]}`}
                onClick={() => handleCategoryClick(cat._id)}
              >
                <div className="p-8 text-blue-600 flex flex-col items-center justify-center space-y-4">
                  <div className="text-6xl select-none">
                    {cat.icon || '🛠️'}
                  </div>
                  <h3 className="text-2xl font-extrabold tracking-wide drop-shadow-lg">
                    {cat.name}
                  </h3>
                  <p className="text-blue-700 text-center text-sm font-medium max-w-xs line-clamp-3">
                    {cat.description || "No description available"}
                  </p>
                </div>

                <div className="bg-white bg-opacity-20 backdrop-blur-md px-6 py-4 text-center rounded-b-3xl">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(cat._id);
                    }}
                    className="inline-block bg-white text-blue-700 font-semibold rounded-full px-6 py-2 shadow-md hover:bg-blue-700 hover:text-white transition"
                  >
                    View Workers
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ✅ Footer (inline or use your <Footer /> component) */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} BreezeHome. All rights reserved.
      </footer>

      <style>{`
        .animate-fadein {
          animation: fadein 1.2s ease forwards;
        }
        @keyframes fadein {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
