import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Customer from "./pages/Customer/Profile.jsx";
import BookingForm from './pages/Customer/BookingForm.jsx';
import AdminLayout from './pages/admin/AdminLayout';
import AdminUsers from './pages/admin/AdminUsers';
import AdminWorkers from './pages/admin/AdminWorkers';
import AdminBookings from './pages/admin/AdminBookings';
import AdminServices from './pages/admin/AdminServices';
import AdminMessage from './pages/admin/AdminMessage';
import Categories from './pages/Categories';
import CategoryWorkers from './pages/CategoryWorkers';
import React, { useState } from 'react';
import CustomerProfile from './pages/Customer/Profile.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentSuccess from './pages/Customer/PaymentSuccess.jsx'; // Import the PaymentSuccess component


function App() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <>
      <Router>
         <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" // or "dark"
      />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/payment-success" element={<PaymentSuccess />} /> {/* Add the PaymentSuccess route */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/customer" element={<Customer />} />
            <Route path="/profile" element={<CustomerProfile />} /> 
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<CategoryWorkers />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="users" element={<AdminUsers />} />
            <Route path="workers" element={<AdminWorkers />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="messages" element={<AdminMessage />} />
          </Route>
        </Routes>
      </Router>
      <div>
        {/* <button
          onClick={() => setIsSignupOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Open Signup
        </button> */}

        {/* {isSignupOpen && (
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
        )} */}
      </div>
    </>
  );
}

export default App;