import axios from 'axios';

const api = axios.create({
  baseURL: '/api/mobile/wing-plus',
  headers: { 'Content-Type': 'application/json' },
});

export default api;
