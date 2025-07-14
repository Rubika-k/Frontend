

// // src/pages/Categories.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Categories = () => {
//   const [categories, setCategories] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get('/api/categories'); // GET all categories
//         setCategories(res.data);
//       } catch (err) {
//         console.error('Failed to fetch categories', err.message);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleCategoryClick = (categoryId) => {
//     navigate(`/categories/${categoryId}`);
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">All Categories</h2>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {categories.map((cat) => (
//           <div
//             key={cat._id}
//             className="border p-4 rounded shadow hover:bg-gray-100 cursor-pointer text-center"
//             onClick={() => handleCategoryClick(cat._id)}
//           >
//             <p className="font-semibold">{cat.name}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Categories;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const bgColors = [
  'bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400',
  'bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400',
  'bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400',
  'bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400',
  'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400',
  'bg-gradient-to-r from-green-300 via-lime-400 to-emerald-400',
  'bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400',
  'bg-gradient-to-r from-red-400 via-pink-400 to-purple-400',
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories'); // GET all categories
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
   
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50 py-10 px-6">
      <h2 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via drop-shadow-lg animate-fadein">
        Explore Our Service Categories
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categories.map((cat, idx) => (
          <div
            key={cat._id}
            className={`cursor-pointer rounded-3xl shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden flex flex-col justify-between ${bgColors[idx % bgColors.length]}`}
            onClick={() => handleCategoryClick(cat._id)}
          >
            <div className="p-8 text-white flex flex-col items-center justify-center space-y-4">
              <div className="text-6xl select-none">
                {cat.icon || '🛠️'}
              </div>
              <h3 className="text-2xl font-extrabold tracking-wide drop-shadow-lg">
                {cat.name}
              </h3>
              <p className="text-white/90 text-center text-sm font-medium max-w-xs line-clamp-3">
                {cat.description || "No description available"}
              </p>
            </div>

            <div className="bg-white bg-opacity-20 backdrop-blur-md px-6 py-4 text-center rounded-b-3xl">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryClick(cat._id);
                }}
                className="inline-block bg-white text-purple-700 font-semibold rounded-full px-6 py-2 shadow-md hover:bg-purple-700 hover:text-white transition"
              >
                View Workers
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .animate-fadein {
          animation: fadein 1.2s ease forwards;
        }
        @keyframes fadein {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* For multiline ellipsis if needed */
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>
    </div>
    
  );
};

export default Categories;
