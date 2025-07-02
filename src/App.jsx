import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
// import Customer from "./pages/Customer/Dashboard.jsx";
import BookingForm from './pages/Customer/BookingForm';
import AdminLayout from './pages/admin/AdminLayout';
import AdminUsers from './pages/admin/AdminUsers';
import AdminWorkers from './pages/admin/AdminWorkers';
import AdminBookings from './pages/admin/AdminBookings';
import AdminServices from './pages/admin/AdminServices';
import Categories from './pages/Categories';
import CategoryWorkers from './pages/CategoryWorkers';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import React, { useState } from 'react';

function App() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/customer/dashboard" element={<Customer />} /> */}
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<CategoryWorkers />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="users" element={<AdminUsers />} />
            <Route path="workers" element={<AdminWorkers />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="services" element={<AdminServices />} />
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>
      <div>
        <button
          onClick={() => setIsSignupOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Open Signup
        </button>

        {isSignupOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="relative w-full max-w-md bg-white rounded shadow-lg">
              <button
                onClick={() => setIsSignupOpen(false)}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
              <Signup closeModal={() => setIsSignupOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
