import React, { useState } from 'react';
import axios from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import side1 from '../../assets/side1.png';


const Signup = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: {
      city: '',
      street: '',
    },
    role: 'user', //  default to user
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city' || name === 'street') {
      setForm({
        ...form,
        address: {
          ...form.address,
          [name]: value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const payload = { ...form };
      delete payload.confirmPassword;

      const res = await axios.post('http://localhost:5000/api/auth/signup', payload);
      setMessage(res.data.message || 'Signup successful!');

      //  Auto redirect to login after 1 sec
      setTimeout(() => {
        navigate('/login');
      }, 1000);

    } catch (err) {
      setMessage(err.response?.data?.message || 'Signup failed');
    }
  };

 return (
  <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 animate-fadein">
    {/* Left side */}
    <div className="w-2/3 hidden md:flex items-center justify-center animate-slidein">
      <img src={side1} alt="Worker Illustration" className="max-w-[80%] h-auto rounded-2xl shadow-2xl" />
    </div>

    {/* Right side */}
    <div className="w-full md:w-1/3 flex items-center justify-center bg-white bg-opacity-90 px-6">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl animate-pop border-t-4 border-blue-500">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700 animate-slidein drop-shadow">
          Sign Up
        </h2>
        {message && (
          <div className="text-red-600 mb-4 text-sm text-center animate-bounce">{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            type="text"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            name="city"
            type="text"
            placeholder="City"
            value={form.address.city}
            onChange={handleChange}
            className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            name="street"
            type="text"
            placeholder="Street Address"
            value={form.address.street}
            onChange={handleChange}
            className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-2"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg font-bold text-lg shadow-md hover:scale-105 hover:shadow-blue-300 transition-transform duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-blue-700 underline hover:opacity-80 font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
    {/* Animations */}
    <style>{`
      .animate-fadein { animation: fadein 1s; }
      @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
      .animate-slidein { animation: slidein 0.8s; }
      @keyframes slidein { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      .animate-pop { animation: pop 0.4s; }
      @keyframes pop { 0% { transform: scale(0.7); opacity: 0; } 80% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
      .animate-bounce { animation: bounce 0.7s; }
      @keyframes bounce { 0% { transform: translateY(-30px); } 50% { transform: translateY(10px); } 100% { transform: translateY(0); } }
      @media (max-width: 768px) {
        .md\\:w-1\\/3 { width: 100%; }
        .md\\:flex { display: none; }
      }
    `}</style>
  </div>
)};
export default Signup;
