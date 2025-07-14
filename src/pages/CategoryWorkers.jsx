// // src/pages/CategoryWorkers.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, Link, useNavigate } from 'react-router-dom';

// const CategoryWorkers = () => {
//   const { id } = useParams(); // category ID from URL
//   const navigate = useNavigate();
//   const [workers, setWorkers] = useState([]);
//   const [categoryName, setCategoryName] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [notFound, setNotFound] = useState(false);

//   useEffect(() => {
//     const fetchCategoryWorkers = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`http://localhost:5000/api/workers/category?category=${id}`);
//         setWorkers(res.data);
//         if (res.data.length > 0) {
//           setCategoryName(res.data[0].category.name);
//         } else {
//           setNotFound(true);
//         }
//       } catch (err) {
//         console.error('Error fetching workers:', err.message);
//         setNotFound(true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategoryWorkers();
//   }, [id]);

//   const handleBooking = (workerId) => {
// navigate('/booking', { state: { workerId } });
//   };

//   if (loading) return <p className="p-6 text-center text-lg">Loading...</p>;
//   if (notFound) return <p className="p-6 text-center text-red-500 text-lg">No workers found for this category.</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Workers in: {categoryName}</h2>
//       <div className="text-center mb-6">
//         <Link to="/categories" className="text-blue-600 underline hover:text-blue-800">
//           ← Back to Categories
//         </Link>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {workers.map((worker) => (
//           <div
//             key={worker._id}
//             className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-lg transition-transform duration-200 transform hover:scale-105"
//           >
//             <h3 className="text-xl font-semibold mb-2 text-gray-700">{worker.name}</h3>
//             <p className="text-gray-600"><strong>Email:</strong> {worker.email}</p>
//             <p className="text-gray-600"><strong>Phone:</strong> {worker.phone}</p>
//             <p className="text-gray-600"><strong>Location:</strong> {worker.address || "Not Provided"}</p>
//             <p className="text-gray-600 mb-4"><strong>Category:</strong> {worker.category.name}</p>
//             <button
//               onClick={() => handleBooking(worker._id)}
//               className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition"
//             >
//               Book Now
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CategoryWorkers;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CategoryWorkers = () => {
  const { id } = useParams(); // category ID from URL
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchCategoryWorkers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/workers/category?category=${id}`);
        setWorkers(res.data);
        if (res.data.length > 0) {
          setCategoryName(res.data[0].category.name);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error fetching workers:', err.message);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryWorkers();
  }, [id]);

  const handleBooking = (workerId) => {
    navigate('/booking', { state: { workerId } });
  };

  if (loading) return <p className="p-6 text-center text-lg text-indigo-600 animate-pulse">Loading...</p>;
  if (notFound) return <p className="p-6 text-center text-red-500 text-lg font-semibold">No workers found for this category.</p>;

  return (
    <Navbar>
    <div className="p-8 bg-gradient-to-tr from-indigo-50 via-purple-100 to-pink-100 min-h-screen">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-purple-800 drop-shadow-lg animate-fadein">
        Workers in: <span className="text-pink-600">{categoryName}</span>
      </h2>
      <div className="text-center mb-8">
        <Link
          to="/categories"
          className="inline-block text-lg font-semibold text-pink-700 underline hover:text-pink-900 transition-colors duration-300"
        >
          ← Back to Categories
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {workers.map((worker) => (
          <div
            key={worker._id}
            className="bg-white rounded-3xl shadow-lg border border-pink-200 hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 hover:border-pink-400"
          >
            <div className="p-6 flex flex-col items-center">
              <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-pink-300 shadow-md">
                {/* Worker image placeholder */}
                <img
                  src={worker.photo || 'https://via.placeholder.com/96?text=Worker'}
                  alt={worker.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-1 text-purple-700">{worker.name}</h3>
              <p className="text-sm text-purple-500 mb-2 italic">Category: {worker.category.name}</p>
              <div className="text-gray-700 w-full space-y-1 mb-6">
                <p><strong>Email:</strong> {worker.email}</p>
                <p><strong>Phone:</strong> {worker.phone}</p>
                <p><strong>Location:</strong> {worker.address || "Not Provided"}</p>
              </div>
              <button
                onClick={() => handleBooking(worker._id)}
                className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg transition transform hover:scale-105"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadein {
          animation: fadein 0.7s ease forwards;
        }
      `}</style>
    </div>
    </Navbar>
  );
};

export default CategoryWorkers;
