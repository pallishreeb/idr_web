// api.js

const API_BASE_URL = 'https://api.portal.idrtechnologysolutions.com'; // Replace with your API base URL

const fetchJson = async (url, options) => {
  const token = localStorage.getItem('user_idr_token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers // Allow custom headers to be merged
  };

  let fetchOptions = {
    ...options,
    headers: headers,
  };

  // Determine if the request body needs to be JSON or FormData
  if (options.body instanceof FormData) {
    fetchOptions = {
      ...fetchOptions,
      method: 'POST',
      headers: {
        ...headers,
        // 'Content-Type': 'multipart/form-data',
      },
      body: options.body
    };
  } else {
    fetchOptions = {
      ...fetchOptions,
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options.body)
    };
  }

  const response = await fetch(`${API_BASE_URL}${url}`, fetchOptions);
  const responseData = await response.json();

  if (!response.ok) {
    // Check if the response data contains an error message
    const errorMessage = responseData.message || 'Network response was not ok';
    throw new Error(errorMessage);
  }

  return responseData; // Return response data on success
};

export { fetchJson };
