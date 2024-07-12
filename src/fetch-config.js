import { API_BASE_URL } from "./config";
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
    const errorMessage = responseData.message || 'Network response was not ok';
    throw new Error(errorMessage);
  }

  return responseData; // Return response data on success
};

export { fetchJson };
