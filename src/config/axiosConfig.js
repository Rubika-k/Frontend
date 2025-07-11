import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000000000000000000000000000000000000000000000000000000000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

//  Attach token if it exists
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

//  Optional: log or handle responses globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.error('API error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;