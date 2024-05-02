// src/reducers/clientSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clients: [],
  client: null,
  industries: [],
  loading: false,
  error: null,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    createClientStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createClientSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.client = action.payload;
    },
    createClientFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getClientsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getClientsSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.clients = action.payload;
    },
    getClientsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getClientByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getClientByIdSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.client = action.payload;
    },
    getClientByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteClientStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteClientSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      // Remove the deleted employee from the clientEmployees array
      // console.log(state.clients.data,"state.clients?.data")
      state.clients = state.clients?.data.filter(client => client.client_id !== action.payload);
    },
    deleteClientFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getIndustriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getIndustriesSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.industries = action.payload;
    },
    getIndustriesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateClientStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateClientSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.client = action.payload;
    },
    updateClientFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  createClientStart,
  createClientSuccess,
  createClientFailure,
  getClientsStart,
  getClientsSuccess,
  getClientsFailure,
  getClientByIdStart,
  getClientByIdSuccess,
  getClientByIdFailure,
  deleteClientStart,
  deleteClientSuccess,
  deleteClientFailure,
  getIndustriesStart,
  getIndustriesSuccess,
  getIndustriesFailure,
  updateClientStart,
  updateClientSuccess,
  updateClientFailure,
} = clientSlice.actions;

export default clientSlice.reducer;
