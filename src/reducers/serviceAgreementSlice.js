// src/reducers/serviceTicketSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  loadingDetails: false,
  serviceAgreements: [],
  serviceAgreementDetails: null,
  error: null,
};

const serviceAgreementSlice = createSlice({
  name: "serviceAgreements",
  initialState,
  reducers: {
    serviceAgreementStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    serviceAgreementSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    serviceAgreementFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getServiceAgreementListsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getServiceAgreementListsSuccess: (state, action) => {
      state.loading = false;
      state.serviceAgreements = action.payload;
      state.error = null;
    },
    getServiceAgreementListsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteServiceAgreementStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteServiceAgreementSuccess: (state, action) => {
      state.loading = false;
      state.serviceAgreementDetails = state.serviceTickets?.filter(
        (ticket) => ticket.service_ticket_id !== action.payload
      );
      state.error = null;
    },
    deleteServiceAgreementFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getServiceAgreementDetailsStart: (state) => {
      state.loadingDetails = true;
      state.error = null;
    },
    getServiceAgreementDetailsSuccess: (state, action) => {
      state.loadingDetails = false;
      state.serviceTicketDetails = action.payload;
      state.error = null;
    },
    getServiceAgreementDetailsFailure: (state, action) => {
      state.loadingDetails = false;
      state.error = action.payload;
    },

    updateServiceAgreementStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateServiceAgreementSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    updateServiceAgreementFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearServiceAgreements: (state, action) => {
      state.loading = false;
      state.error = null;
      state.serviceAgreements = [];
    },
  },
});

export const {
  serviceAgreementStart,
  serviceAgreementSuccess,
  serviceAgreementFailure,
  getServiceAgreementDetailsStart,
  getServiceAgreementDetailsSuccess,
  getServiceAgreementDetailsFailure,
  getServiceAgreementListsStart,
  getServiceAgreementListsSuccess,
  getServiceAgreementListsFailure,
  deleteServiceAgreementStart,
  deleteServiceAgreementSuccess,
  deleteServiceAgreementFailure,
  updateServiceAgreementStart,
  updateServiceAgreementSuccess,
  updateServiceAgreementFailure,
  clearServiceAgreements

} = serviceAgreementSlice.actions;

export default serviceAgreementSlice.reducer;
