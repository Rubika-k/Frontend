import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { useParams, useLocation, useNavigate } from "react-router-dom";

export default function CategoryWorkers() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    setCategory(cat || "");
axios.get(`/api/workers/public/by-category?category=${encodeURIComponent(cat || "")}`)
      .then(res => setWorkers(Array.isArray(res.data) ? res.data : res.data.workers || []));
  }, [id, location.search]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-blue-700 text-center drop-shadow">
          {category ? `${category} Workers` : "Workers"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {workers.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No workers found for this category.</div>
          ) : (
            workers.map(w => (
              <div key={w._id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                <div className="text-2xl font-bold mb-2 text-blue-600">{w.fullName}</div>
                <div className="text-gray-500 mb-2">{w.category}</div>
                <div className="mb-2">{w.available ? <span className="text-green-600">Available</span> : <span className="text-red-600">Not Available</span>}</div>
                <div className="mb-4 text-sm text-gray-600">Next Available: {w.nextAvailableTime || "N/A"}</div>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  onClick={() => navigate(`/booking?workerId=${w._id}&category=${encodeURIComponent(category)}`)}
                >
                  Book
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}