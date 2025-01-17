// src/reducers/serviceTicketSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  loadingDetails: false,
  licenses: [],
  licenseDetails: null,
  error: null,
};

const licenseSlice = createSlice({
  name: "license",
  initialState,
  reducers: {
    licenseStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    licenseSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    licenseFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getLicenseListsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getLicenseListsSuccess: (state, action) => {
      state.loading = false;
      state.licenses = action.payload;
      state.error = null;
    },
    getLicenseListsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteLicenseStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteLicenseSuccess: (state, action) => {
      state.loading = false;
      state.licenseDetails = state.licenses?.filter(
        (ticket) => ticket.license_id !== action.payload
      );
      state.error = null;
    },
    deleteLicenseFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getLicenseDetailsStart: (state) => {
      state.loadingDetails = true;
      state.error = null;
    },
    getLicenseDetailsSuccess: (state, action) => {
      state.loadingDetails = false;
      state.serviceTicketDetails = action.payload;
      state.error = null;
    },
    getLicenseDetailsFailure: (state, action) => {
      state.loadingDetails = false;
      state.error = action.payload;
    },

    updateLicenseStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateLicenseSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    updateLicenseFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearLicense: (state, action) => {
      state.loading = false;
      state.error = null;
      state.licenses = [];
    },
  },
});

export const {
  licenseStart,
  licenseSuccess,
  licenseFailure,
  getLicenseDetailsStart,
  getLicenseDetailsSuccess,
  getLicenseDetailsFailure,
  getLicenseListsStart,
  getLicenseListsSuccess,
  getLicenseListsFailure,
  deleteLicenseStart,
  deleteLicenseSuccess,
  deleteLicenseFailure,
  updateLicenseStart,
  updateLicenseSuccess,
  updateLicenseFailure,
  clearLicense

} = licenseSlice.actions;

export default licenseSlice.reducer;
