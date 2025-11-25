import axios from 'axios';
import { API_BASE_URL } from "./config";
import store from './store';
import { logout } from './reducers/userSlice';

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

// Add response interceptor to handle 401 errors globally
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const res = error?.response;

    // Handle 401 Unauthorized - Session expired or invalid token
    if (res?.status === 401 && !res?.config?.__isRetryRequest) {
      // Clear local storage
      localStorage.removeItem('user_idr_token');
      localStorage.removeItem('user');

      // Dispatch logout action
      store.dispatch(logout());

      // Redirect to login page
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default axios;
