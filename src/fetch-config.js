import { API_BASE_URL } from "./config";
import store from './store';
import { logout } from './reducers/userSlice';

const fetchJson = async (url, options = {}) => {
  const token = localStorage.getItem('user_idr_token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers // Allow custom headers to be merged
  };

  // Default fetch options
  let fetchOptions = {
    ...options,
    headers: headers,
  };

  // If there is a body, determine its type and set headers accordingly
  if (options.body) {
    if (options.body instanceof FormData) {
      fetchOptions = {
        ...fetchOptions,
        headers: headers, // FormData automatically sets the correct content type
      };
    } else {
      fetchOptions = {
        ...fetchOptions,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options.body),
      };
    }
  }

  const response = await fetch(`${API_BASE_URL}${url}`, fetchOptions);
  const responseData = await response.json();

  if (!response.ok) {
    // Handle 401 Unauthorized - Session expired or invalid token
    if (response.status === 401) {
      // Clear local storage
      localStorage.removeItem('user_idr_token');
      localStorage.removeItem('user');

      // Dispatch logout action
      store.dispatch(logout());

      // Redirect to login page
      window.location.href = '/';

      throw new Error('Session expired. Please login again.');
    }

    const errorMessage = responseData.message || 'Network response was not ok';
    throw new Error(errorMessage);
  }

  return responseData; // Return response data on success
};

export { fetchJson };
