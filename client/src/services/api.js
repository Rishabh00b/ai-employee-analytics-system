import axios from 'axios';

let resolvedUrl = 'http://localhost:5000/api';
if (import.meta.env.VITE_API_URL) {
  let envUrl = import.meta.env.VITE_API_URL.trim();
  if (envUrl.endsWith('/')) envUrl = envUrl.slice(0, -1);
  if (!envUrl.endsWith('/api')) envUrl += '/api';
  resolvedUrl = envUrl;
}

const api = axios.create({
  baseURL: resolvedUrl,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      if (userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
