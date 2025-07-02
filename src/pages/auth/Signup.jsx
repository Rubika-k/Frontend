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
  <div className="flex min-h-screen">
    {/* Left side */}
    <div className="w-2/3 bg-blue-500 flex items-left justify-center">
      <img src={side1} alt="Worker Illustration" className="max-w-[80%] h-auto" />
    </div>

    {/* Right side */}
    <div className="w-1/3 flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {message && (
          <div className="text-red-600 mb-4 text-sm text-center">{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            type="text"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="city"
            type="text"
            placeholder="City"
            value={form.address.city}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="street"
            type="text"
            placeholder="Street Address"
            value={form.address.street}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
          />
          <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Sign Up
          </button>     
        </form>
        {/* form goes here */}
      </div>
    </div>
  </div>
);
};

export default Signup;
