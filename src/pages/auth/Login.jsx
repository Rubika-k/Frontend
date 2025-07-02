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
    <div className="flex min-h-screen">
      {/* Left half: image */}
      <div
        className="w-1/2 hidden md:block bg-cover bg-center"
        style={{ backgroundImage: `url(${side1})` }}
      ></div>

      {/* Right half: form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-blue-500 p-8 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          {message && (
            <div className="text-red-600 mb-4 text-sm text-center">{message}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full p-2 border rounded" required />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Login
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Don’t have an account?{' '}
            <a href="/signup" className="text-white underline hover:opacity-80">
              Signup
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
