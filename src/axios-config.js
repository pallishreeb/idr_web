import axios from 'axios';
import { API_BASE_URL } from "./config";
// Set the base URL for your API
axios.defaults.baseURL = API_BASE_URL;

// Add an Axios interceptor to set the authorization token for every request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_idr_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
});

export default axios;
