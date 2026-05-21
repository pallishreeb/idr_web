/** @format */

import axios from "axios";
import CryptoJS from "crypto-js";

import { API_BASE_URL } from "./config";
import store from "./store";
import { logout } from "./reducers/userSlice";

axios.defaults.baseURL = API_BASE_URL;

const SECRET_KEY =
  "AOdgJMOzJS+H9hH63/GHwMeKSx7dOXKLTAQq0g452n+Re2XtOVxM0t7/+FvB+5KN";

// REQUEST INTERCEPTOR
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("user_idr_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR
axios.interceptors.response.use(
  (response) => {
    try {
      // only decrypt if encrypted string exists
      if (response?.data?.data && typeof response.data.data === "string") {
        const bytes = CryptoJS.AES.decrypt(response.data.data, SECRET_KEY);

        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

        // avoid parsing empty string
        if (decryptedText) {
          const decryptedData = JSON.parse(decryptedText);

          response.data = decryptedData;
        }
      }

      return response;
    } catch (decryptError) {
      console.error("Response decryption failed:", decryptError);

      return response;
    }
  },
  (error) => {
    const res = error?.response;

    if (res?.status === 401 && !res?.config?.__isRetryRequest) {
      localStorage.removeItem("user_idr_token");
      localStorage.removeItem("user");

      store.dispatch(logout());

      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

export default axios;
