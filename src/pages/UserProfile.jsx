// import React, { useEffect, useState } from "react";
// import axios from "../axiosConfig";
// import { 
//   FaUserCircle, FaCalendarAlt, FaClock, FaCheckCircle, 
//   FaTimesCircle, FaSpinner, FaExclamationTriangle, FaSync 
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import ProfilePictureUpload from "../components/ProfilePictureUpload";

// export default function UserProfile() {
//   const [user, setUser] = useState(null);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const fetchUserData = async () => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     setLoading(false);
//     navigate('/login');
//     return;
//   }

//   try {
//     const [userResponse, bookingsResponse] = await Promise.all([
//       axios.get("/api/users/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       }),
//       axios.get(`/api/bookings/user`, {
//         headers: { Authorization: `Bearer ${token}` },
//       }).catch(err => {
//         console.log("Bookings not found, using empty array");
//         return { data: [] }; // Return empty array if bookings fail
//       })
//     ]);
    
//     setUser(userResponse.data);
//     setBookings(bookingsResponse.data || []);
//   } catch (err) {
//     console.error("Fetch error:", err);
//     setError(err.response?.data?.message || "Failed to load profile data");
    
//     if (err.response?.status === 401 || err.response?.status === 403) {
//       localStorage.removeItem("token");
//       // navigate('/login');
//     }
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     fetchUserData();
//     // eslint-disable-next-line
//   }, []);

//   const refreshBookings = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`/api/bookings/user`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBookings(response.data || []);
//     } catch (err) {
//       // Optionally handle error
//     }
//   };

//   const handleProfilePictureUpdate = (newUrl) => {
//     setUser(prev => ({ ...prev, profilePicture: newUrl }));
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
//         <p className="text-blue-700">Loading your profile...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="max-w-md mx-4 p-8 bg-white rounded-xl shadow-lg text-center">
//           <h2 className="text-2xl font-bold mb-4 text-blue-700">
//             {error || "Please log in to view your profile"}
//           </h2>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto">
//         {/* Profile Header */}
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-extrabold text-blue-800 mb-2">My Profile</h2>
//           <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
//         </div>

//         {/* User Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 flex flex-col md:flex-row items-center gap-8">
//           <div className="flex-shrink-0 relative">
//             {user.profilePicture ? (
//               <img 
//                 src={user.profilePicture} 
//                 alt="Profile" 
//                 className="w-32 h-32 rounded-full object-cover border-4 border-blue-200" 
//                 onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
//               />
//             ) : (
//               <FaUserCircle className="w-32 h-32 text-blue-200" />
//             )}
//             {/* Profile Picture Upload */}
//             <ProfilePictureUpload currentUser={user} onUpdate={handleProfilePictureUpdate} />
//           </div>
//           <div className="flex-1 text-center md:text-left">
//             <h3 className="text-2xl font-bold text-blue-800 mb-1">
//               {user.fullName || user.name || user.username || '-'}
//             </h3>
//             <div className="text-gray-500 mb-2">{user.email || '-'}</div>
//             <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-2">
//               <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
//                 <FaCheckCircle className="mr-1 text-green-500" />
//                 {user.isVerified ? 'Verified' : 'Unverified'}
//               </span>
//               {user.phone && (
//                 <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
//                   {user.phone}
//                 </span>
//               )}
//             </div>
//             <div className="text-gray-400 text-xs">
//               Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
//             </div>
//           </div>
//         </div>

//         {/* Bookings Section */}
//         <div className="bg-white rounded-2xl shadow-lg p-8">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
//               <FaCalendarAlt className="text-blue-500" /> My Bookings
//             </h3>
//             <button 
//               onClick={refreshBookings}
//               className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
//             >
//               <FaSync className="text-xs" /> Refresh
//             </button>
//           </div>
//           {error ? (
//             <div className="text-center py-8 text-rose-600 flex flex-col items-center">
//               <FaExclamationTriangle className="text-2xl mb-2" />
//               <p>{error}</p>
//               <button 
//                 onClick={() => window.location.reload()}
//                 className="mt-4 text-sm text-blue-600 hover:underline"
//               >
//                 Try again
//               </button>
//             </div>
//           ) : bookings.length === 0 ? (
//             <div className="text-gray-500 text-center py-8">No bookings found.</div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm border-collapse">
//                 <thead>
//                   <tr className="bg-blue-50 text-blue-900">
//                     <th className="p-4 font-semibold text-left">Service</th>
//                     <th className="p-4 font-semibold text-left">Date</th>
//                     <th className="p-4 font-semibold text-left">Time</th>
//                     <th className="p-4 font-semibold text-left">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-blue-100">
//                   {bookings.map((b) => (
//                     <tr key={b._id} className="hover:bg-blue-50/50 transition-colors">
//                       <td className="p-4">{b.service?.name || b.category || '-'}</td>
//                       <td className="p-4">{b.date ? new Date(b.date).toLocaleDateString() : '-'}</td>
//                       <td className="p-4">{b.time || (b.startTime ? `${b.startTime} - ${b.endTime}` : '-')}</td>
//                       <td className="p-4">
//                         <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
//                           b.status === 'completed'
//                             ? 'bg-green-100 text-green-800'
//                             : b.status === 'cancelled'
//                             ? 'bg-rose-100 text-rose-800'
//                             : 'bg-blue-100 text-blue-800'
//                         }`}>
//                           {b.status === 'completed' && <FaCheckCircle className="mr-1 text-green-500" />}
//                           {b.status === 'cancelled' && <FaTimesCircle className="mr-1 text-rose-500" />}
//                           {(!b.status || b.status === 'pending') && <FaClock className="mr-1 text-blue-500" />}
//                           {b.status?.charAt(0).toUpperCase() + b.status?.slice(1) || 'Pending'}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }