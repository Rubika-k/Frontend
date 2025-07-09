import React, { useEffect, useState } from "react";
import axios from "../config/axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiAlertCircle, FiClock, FiUser, FiCheckCircle ,FiCalendar  } from "react-icons/fi";

export default function CategoryWorkers() {
  const location = useLocation();
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Extract category from URL query parameters
  useEffect(() => {
  const params = new URLSearchParams(location.search);
  setCategory(params.get("category") || "");
}, [location.search]);


  // Fetch workers based on category
  const fetchWorkers = async () => {
  try {
    if (!category) {
      setWorkers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
// const response = await axios.get(`/workers?category=${encodeURIComponent(category)}`);

    const response = await axios.get(`/workers/category?category=${encodeURIComponent(category)}`);

    if (!Array.isArray(response.data)) {
      throw new Error("Invalid data format received");
    }

    setWorkers(response.data);
  } catch (err) {
    console.error("Failed to fetch workers:", err);
    setError(err.response?.data?.message || "Failed to load workers. Please try again.");
    setWorkers([]);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchWorkers();
}, [category]);

  

  // Filter workers based on search term
  const filteredWorkers = workers.filter(worker =>
  worker.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  worker.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading workers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <div className="text-red-500 mb-4 flex justify-center">
            <FiAlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Workers</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 text-center sm:text-left">
            {category ? `${category} Professionals` : "All Professionals"}
          </h1>
          
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search workers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Workers Grid */}
        {filteredWorkers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <WorkerCard 
                key={worker._id} 
                worker={worker} 
                onBook={() => navigate(`/booking?workerId=${worker._id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FiUser size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {searchTerm 
                ? "No workers match your search"
                : category
                  ? `No ${category} workers available`
                  : "No workers found"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "Try a different search term"
                : "Please check back later or try another category"}
            </p>
            <button
              onClick={() => navigate("/")}
              className="text-blue-600 hover:underline"
            >
              Browse other services
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Worker Card Component
function WorkerCard({ worker, onBook }) {
  const isAvailable = worker.isAvailable; 

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative h-48 bg-gray-100">
        {worker.profilePicture ? (
          <img
            src={worker.profilePicture}
            alt={worker.fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-100">
            <span className="text-4xl text-blue-600 font-bold">
              {worker.fullName?.[0] || "?"}
            </span>
          </div>
        )}

        {isAvailable && (
          <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
            <FiCheckCircle className="mr-1" /> Available
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Name & Category */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900">{worker.fullName}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {worker.category?.name || worker.category || "No Category"}
          </span>
        </div>

        {/* Experience */}
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <FiClock className="mr-1" />
          {worker.experience || "0"} years experience
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {worker.bio || "No description available"}
        </p>

        {/* Next Available Time if NOT available */}
        {!isAvailable && worker.nextAvailableTime && (
          <div className="flex items-center text-gray-500 text-xs mb-2">
            <FiCalendar className="mr-1" />
            Next available:{" "}
            {new Date(worker.nextAvailableTime).toLocaleString()}
          </div>
        )}

        {/* Skills */}
        {worker.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {worker.skills.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Book button */}
        <button
          onClick={onBook}
          disabled={!isAvailable}
          className={`w-full py-2 rounded-lg font-medium transition ${
            isAvailable
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isAvailable ? "Book Now" : "Not Available"}
        </button>
      </div>
    </div>
  );
}

