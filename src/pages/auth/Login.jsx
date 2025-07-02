import React, { useState } from 'react';
import axios from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import side1 from '../../assets/side1.png';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      setMessage(res.data.message);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userId', res.data.userId);  
      // Use returned role for redirect
      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

 return (
  <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 animate-fadein">
    {/* Left half: image */}
    <div
      className="w-1/2 hidden md:block bg-cover bg-center animate-slidein"
      style={{ backgroundImage: `url(${side1})` }}
    ></div>

    {/* Right half: form */}
    <div className="w-full md:w-1/2 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white bg-opacity-90 p-10 rounded-2xl shadow-2xl animate-pop border-t-4 border-blue-500">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700 animate-slidein drop-shadow">
          Login
        </h2>

        {message && (
          <div className="text-red-600 mb-4 text-sm text-center animate-bounce">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg font-bold text-lg shadow-md hover:scale-105 hover:shadow-blue-300 transition-transform duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-700 underline hover:opacity-80 font-semibold">
            Signup
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
    `}</style>
  </div>
)};
export default Login;