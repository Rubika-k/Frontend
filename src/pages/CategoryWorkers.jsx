import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CategoryWorkers = () => {
  const { id } = useParams();
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

        if (res.data && res.data.length > 0) {
          setWorkers(res.data);
          setCategoryName(res.data[0].category?.name || '');
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

  const handleBooking = (worker) => {
    navigate('/booking', {
      state: {
        workerId: worker._id,
        worker: worker
      }
    });
  };

  if (loading) return <p className="p-6 text-center text-lg text-indigo-600 animate-pulse">Loading...</p>;
  if (notFound) return <p className="p-6 text-center text-red-500 text-lg font-semibold">No workers found for this category.</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-blue-50 to-blue-100">
      <Navbar />

      <main className="flex-grow py-10 px-6">
        <h2 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-b from-blue-600 to-blue-800 drop-shadow-lg animate-fadein">
          Workers in: <span className="text-blue-700">{categoryName}</span>
        </h2>

        <div className="text-center mb-6">
          <Link
            to="/categories"
            className="inline-block text-base font-semibold text-blue-500 underline hover:text-blue-800 transition-colors"
          >
            ← Back to Categories
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {workers.map((worker) => (
            <div
              key={worker._id}
              className="bg-white rounded-2xl shadow border border-blue-300 hover:shadow-lg transition-transform duration-300 transform hover:scale-105 hover:border-blue-400 flex flex-col"
            >
              <div className="p-4 flex flex-col items-center flex-grow">
                <div className="w-20 h-20 mb-3 rounded-full overflow-hidden border-2 border-blue-200 shadow-sm">
                  <img
                    src={worker.profilePicture || 'https://via.placeholder.com/96?text=Worker'}
                    alt={worker.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-lg font-semibold mb-1 text-blue-700">{worker.fullName}</h3>
                <p className="text-xs text-blue-600 mb-2 italic">Category: {worker.category?.name}</p>

                <div className="text-gray-700 w-full space-y-1 mb-4 text-sm">
                  <p className="flex items-start">
                    <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <strong>Location:</strong>&nbsp;{worker.address || "Not provided"}
                  </p>

                  <p className="flex items-start">
                    <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <strong>Available:</strong>&nbsp;{worker.nextAvailableTime ?
                      new Date(worker.nextAvailableTime).toLocaleString() : 'Not specified'}
                  </p>
                </div>

                <button
                  onClick={() => handleBooking(worker)}
                  className="w-full text-sm bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-800 text-white py-2 rounded-lg font-semibold shadow transition transform hover:scale-105"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} BreezeHome. All rights reserved.
      </footer>

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
  );
};

export default CategoryWorkers;
