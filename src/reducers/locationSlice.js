// src/reducers/locationSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  location:null,
  locations: [],
  loading: false,
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    addLocationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addLocationSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.locations.push(action.payload);
    },
    addLocationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteLocationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteLocationSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.locations = state.locations.filter(location => location.location_id !== action.payload);
    },
    deleteLocationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getLocationByClientStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getLocationByClientSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.locations = action.payload;
    },
    getLocationByClientFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getLocationByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getLocationByIdSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.location = action.payload;
    },
    getLocationByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateLocationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateLocationSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.location = action.payload;
    },
    updateLocationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  addLocationStart,
  addLocationSuccess,
  addLocationFailure,
  deleteLocationStart,
  deleteLocationSuccess,
  deleteLocationFailure,
  getLocationByClientStart,
  getLocationByClientSuccess,
  getLocationByClientFailure,
  getLocationByIdStart,
  getLocationByIdSuccess,
  getLocationByIdFailure,
  updateLocationSuccess,
  updateLocationStart,
  updateLocationFailure

} = locationSlice.actions;

export default locationSlice.reducer;
