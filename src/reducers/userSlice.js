// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Function to save user data to local storage
const saveUserToLocalStorage = ({user,token}) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("user_idr_token", token);
};

// Function to get user data from local storage
const getUserFromLocalStorage = () => {
  const userJSON = localStorage.getItem("user");
  return userJSON ? JSON.parse(userJSON) : null;
};
const initialState = {
  loading: false,
  error: null,
  users: [],
  user: getUserFromLocalStorage(),
  isAuthenticated:false,
  successMessage: "",
  access : ['Admin', 'Subadmin'],
  technicianAccess : ['Admin', 'Subadmin','IDR Employee']
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    createUserStart(state) {
      state.loading = true;
      state.error = null;
    },
    createUserSuccess(state, action) {
      state.loading = false;
      // state.users = [...state.users, action.payload];
      state.error = null;
    },
    createUserFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    userLoginStart(state) {
      state.loading = true;
      state.error = null;
    },
    userLoginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.error = null;
      saveUserToLocalStorage(action.payload);
      state.isAuthenticated=true;
    },
    userLoginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setPasswordStart(state) {
      state.loading = true;
      state.error = null;
    },
    setPasswordSuccess(state, action) {
      state.loading = false;
      state.successMessage = action.payload;
    },
    setPasswordFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchUsersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload;
    },
    fetchUsersFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null; // Clear user data from Redux state
      localStorage.removeItem("user"); // Clear user data from local storage
      localStorage.removeItem("user_idr_token"); // Clear user data from local storage
      state.isAuthenticated = false;
    },
    updateUserStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess(state) {
      state.loading = false;

      // // Find the index of the user to be updated in the users array
      // const userIndex = state.users.findIndex(
      //   (user) => user.user_id === action.payload.user_id
      // );

      // // If the user is found in the array, update it
      // if (userIndex !== -1) {
      //   state.users[userIndex] = action.payload.updatedUser;
      // }

      // state.user = action.payload.updatedUser; // Update the user object if needed
    },
    updateUserFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    forgotPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.successMessage = "";
    },
    forgotPasswordSuccess(state) {
      state.loading = false;
      state.successMessage = "Forgot password request sent successfully!";
    },
    forgotPasswordFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      // state.users = state.users.filter(user => user.user_id !== action.payload);
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
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
  logout,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  deleteUserRequest,
  deleteUserFailure,
  deleteUserSuccess
} = userSlice.actions;
export default userSlice.reducer;
