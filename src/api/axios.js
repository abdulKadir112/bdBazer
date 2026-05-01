import axios from 'axios';

const api = axios.create({
  // আপনার Render-এ হোস্ট করা ব্যাকএন্ড URL
  baseURL: 'https://bdbazerapi.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;