import React, { useState } from 'react';
import axios from "@/config/axiosConfig";
import { useNavigate } from 'react-router-dom';
import side1 from '../../assets/side1.png';
import { FaUserShield, FaLock, FaArrowRight, FaHome } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      setMessage(res.data.message);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);  
      if (res.data.role === 'admin') {
        toast.success('Login successful! Redirecting to admin dashboard...');
        navigate('/admin');
      
      } else {
        toast.success('Login successful! Redirecting to customer dashboard...');
        navigate('/customer');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 animate-fadein">
      {/* Left half: image */}
      <div
        className="w-1/2 hidden md:flex items-center justify-center bg-cover bg-center animate-slidein relative overflow-hidden"
        style={{ backgroundImage: `url(${side1})` }}
      >
        <div className="absolute inset-0 bg-blue-900/30 backdrop-blur-sm"></div>
        <div className="relative z-10 p-10 text-white text-center">
          <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Welcome Back!</h1>
          <p className="text-xl opacity-90">Login to access your personalized dashboard</p>
        </div>
      </div>

      {/* Right half: form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl animate-pop border-t-8 border-blue-600 transform transition-all duration-500 hover:shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <FaUserShield className="text-blue-600 text-4xl" />
            </div>
          </div>
          
          <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800 animate-slidein">
            Login to <span className="text-blue-600">BreezeHome</span>
          </h2>

          {message && (
            <div
              className={`mb-6 p-3 rounded-lg text-center font-medium animate-bounce ${
                message.toLowerCase().includes('success')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdEmail className="text-gray-400" />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                required
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-300/50 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Login
                  <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between mt-4">
              <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="font-semibold text-blue-600 hover:underline">
                  Sign up
                </a>
              </p>
            </div>
          </form>

          {/* ✅ Back to Home Link */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-all"
            >
              <FaHome />
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadein { animation: fadein 0.6s ease-out; }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        .animate-slidein { animation: slidein 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes slidein { from { transform: translateX(-30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-pop { animation: pop 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes pop { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-bounce { animation: bounce 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 30% { transform: translateY(-10px); } 60% { transform: translateY(5px); } }
      `}</style>
    </div>
  );
};

export default Login;
