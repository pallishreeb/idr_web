// src/reducers/clientEmployeeSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employee: null,
  clientEmployees:[],
  loading: false,
  error: null,
};

const clientEmployeeSlice = createSlice({
  name: "clientEmployee",
  initialState,
  reducers: {
    addClientEmployeeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addClientEmployeeSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.employee = action.payload;
    },
    addClientEmployeeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteClientEmployeeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteClientEmployeeSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
       // Remove the deleted employee from the clientEmployees array
       state.clientEmployees = state.clientEmployees.filter(employee => employee.client_emp_id !== action.payload);
      },
    deleteClientEmployeeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getClientEmployeeByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getClientEmployeeByIdSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.clientEmployees = action.payload;
    },
    getClientEmployeeByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getEmployeeByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getEmployeeByIdSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.employee = action.payload;
    },
    getEmployeeByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateClientEmployeeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateClientEmployeeSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.employee = action.payload;
    },
    updateClientEmployeeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  addClientEmployeeStart,
  addClientEmployeeSuccess,
  addClientEmployeeFailure,
  deleteClientEmployeeStart,
  deleteClientEmployeeSuccess,
  deleteClientEmployeeFailure,
  getClientEmployeeByIdStart,
  getClientEmployeeByIdSuccess,
  getClientEmployeeByIdFailure,
  getEmployeeByIdStart,
  getEmployeeByIdSuccess,
  getEmployeeByIdFailure,
  updateClientEmployeeStart,
  updateClientEmployeeFailure,
  updateClientEmployeeSuccess

} = clientEmployeeSlice.actions;

export default clientEmployeeSlice.reducer;
