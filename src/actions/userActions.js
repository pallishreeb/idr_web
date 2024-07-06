// src/actions/userActions.js

import axios from "axios";
import {
  createUserStart,
  createUserSuccess,
  createUserFailure,
  userLoginStart,
  userLoginSuccess,
  userLoginFailure,
  setPasswordStart,
  setPasswordSuccess,
  setPasswordFailure,
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  deleteUserRequest,
  deleteUserFailure,
  deleteUserSuccess,
} from "../reducers/userSlice";
import { API_BASE_URL, apiConfig } from "../config";
import { toast } from "react-toastify";
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const createUser = (userData, navigate) => {
  return async (dispatch) => {
    dispatch(createUserStart());
    try {
      // Perform API call to create user
      const response = await axios.post(apiConfig.createUser, userData);
      if (response.data.user) {
        toast.success("Account created successfully!");
        navigate("/users");
      }
      dispatch(createUserSuccess(response.data.user));
    } catch (error) {
      console.log(error, "Error in account creation");
      dispatch(createUserFailure(error.message));
      toast.error("Error In  Account Creation!");
      navigate("/users/create");
    }
  };
};

export const userLogin = (userData, navigate) => {
  return async (dispatch) => {
    dispatch(userLoginStart());
    try {
      const response = await axios.post(apiConfig.loginUser, userData);
      dispatch(userLoginSuccess(response.data));
      toast.success(`Logged in successfully`);
      navigate("/admin/dashboard");
    } catch (error) {
      dispatch(userLoginFailure(error.message));
      toast.error("Invalid Credentials");
      navigate("/");
    }
  };
};

export const setPassword = (passwordData, navigate) => {
  return async (dispatch) => {
    dispatch(setPasswordStart());
    try {
      const response = await axios.patch(apiConfig.setPassword, passwordData);
      dispatch(setPasswordSuccess(response.data.message));
      toast.success(`Password updated  successfully`);
      navigate("/");
    } catch (error) {
      dispatch(setPasswordFailure(error.message));
      toast.error("Failed to update Password");
      navigate("/set-password");
    }
  };
};
export const setUserPasswordByAdmin = (passwordData, navigate) => {
  return async (dispatch) => {
    dispatch(setPasswordStart());
    try {
      const response = await axios.patch(apiConfig.setPassword, passwordData);
      dispatch(setPasswordSuccess(response.data.message));
      toast.success(`Password Updated  successfully`);
      navigate(-1);
    } catch (error) {
      dispatch(setPasswordFailure(error.message));
      toast.error("Failed to Update User's Password");
      navigate(-1);
    }
  };
};
export const fetchUsers = () => {
  return async (dispatch) => {
    dispatch(fetchUsersStart());
    try {
      const response = await axios.get(apiConfig.allUsers);
      dispatch(fetchUsersSuccess(response.data));
    } catch (error) {
      dispatch(fetchUsersFailure(error.message));
    }
  };
};

export const updateUser = (userData, navigate) => {
  return async (dispatch) => {
    dispatch(updateUserStart());
    try {
      // Make an API request to update the user
      const response = await axios.patch(apiConfig.updateUser, userData);
      // Dispatch success action with updated user data
      dispatch(updateUserSuccess(response.data));
      toast.success(`Updated user successfully`);
      // Redirect to a new page (optional)
      navigate("/users");
    } catch (error) {
      // Dispatch failure action with error message
      dispatch(updateUserFailure(error.message));
      toast.error("Error updating user");
      navigate("/users");
    }
  };
};

export const forgotPassword = (email) => {
  return async (dispatch) => {
    dispatch(forgotPasswordRequest());
    try {
      // Perform API call to send forgot password request
      const response = await axios.post(apiConfig.forgotPassword, email);
      dispatch(forgotPasswordSuccess());
      // Optionally, you can return a success message or handle it in the component
      toast.success(
        response.data.message || "Forgot password request sent successfully!"
      );
      return response.data.message;
    } catch (error) {
      dispatch(forgotPasswordFailure(error.message));
      // Handle error or display error message
      toast.error(
        error?.response?.data.code == "AU400"
          ? "User Not Found"
          : error?.response?.data.message
      );
      return error.message;
    }
  };
};

export const deleteUser = (userId) => async (dispatch) => {
  dispatch(deleteUserRequest());
  try {
    await axios.delete(`${apiConfig.deleteUser}/${userId}`).then((res) => {
      dispatch(deleteUserSuccess(userId));
      toast.success("User deleted successfully");
    });
  } catch (error) {
    dispatch(deleteUserFailure(error.message));
    toast.error(error.response?.data?.message || "Failed to delete User");
  }
};
