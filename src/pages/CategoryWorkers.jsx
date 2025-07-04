import React, { useEffect, useState } from "react";
import axios from "../config/axiosConfig";
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
 axios.get(`/api/workers?category=${encodeURIComponent(cat || "")}`)
      .then(res => setWorkers(Array.isArray(res.data) ? res.data : res.data.workers || []));
  }, [id, location.search]);

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 py-10 animate-fadein">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-700 text-center drop-shadow animate-slidein">
        {category ? `${category} Workers` : "Workers"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {workers.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 animate-fadein">
            No workers found for this category.
          </div>
        ) : (
          workers.map((w, idx) => (
            <div
              key={w._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center border-t-4 border-blue-500 hover:bg-blue-50 animate-pop"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <div className="mb-4 w-24 h-24 flex items-center justify-center rounded-full bg-blue-100 shadow-inner overflow-hidden animate-pop">
                {w.profilePicture ? (
                  <img
                    src={w.profilePicture}
                    alt={w.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-blue-700 font-bold">
                    {w.fullName?.[0] || "?"}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold mb-2 text-blue-600">{w.fullName}</div>
              <div className="text-gray-500 mb-2">{w.category}</div>
              <div className="mb-2">
                {w.available ? (
                  <span className="text-green-600 font-semibold">Available</span>
                ) : (
                  <span className="text-red-600 font-semibold">Not Available</span>
                )}
              </div>
              <div className="mb-4 text-sm text-gray-600">
                Next Available: {w.nextAvailableTime ? new Date(w.nextAvailableTime).toLocaleString() : "N/A"}
              </div>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow"
                onClick={() => navigate(`/booking?workerId=${w._id}&category=${encodeURIComponent(category)}`)}
              >
                Book
              </button>
            </div>
          ))
        )}
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