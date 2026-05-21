/** @format */

import { API_BASE_URL } from "./config";
import store from "./store";
import { logout } from "./reducers/userSlice";
import { decryptResponse } from "./utils/crypto";

const fetchJson = async (url, options = {}) => {
  const token = localStorage.getItem("user_idr_token");

  const headers = {
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  let fetchOptions = {
    ...options,
    headers,
  };

  // HANDLE BODY
  if (options.body) {
    if (options.body instanceof FormData) {
      fetchOptions = {
        ...fetchOptions,
        headers,
      };
    } else {
      fetchOptions = {
        ...fetchOptions,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options.body),
      };
    }
  }

  const response = await fetch(`${API_BASE_URL}${url}`, fetchOptions);

  const responseData = await response.json();

  // HANDLE ERRORS
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("user_idr_token");
      localStorage.removeItem("user");

      store.dispatch(logout());

      window.location.href = "/";

      throw new Error("Session expired. Please login again.");
    }

    const errorMessage = responseData.message || "Network response was not ok";

    throw new Error(errorMessage);
  }

  // DECRYPT RESPONSE
  if (responseData?.data && typeof responseData.data === "string") {
    const decryptedData = decryptResponse(responseData.data);

    if (decryptedData) {
      return decryptedData;
    }
  }

  // NORMAL RESPONSE
  return responseData;
};

export { fetchJson };
