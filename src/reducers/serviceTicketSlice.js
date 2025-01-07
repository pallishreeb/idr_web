// src/reducers/serviceTicketSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  loadingDetails: false,
  serviceTickets: [],
  technicians: [],
  service_ticket_id: null,
  serviceTicketDetails: null,
  error: null,
};

const serviceTicketSlice = createSlice({
  name: "serviceTickets",
  initialState,
  reducers: {
    serviceTicketStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    serviceTicketSuccess: (state, action) => {
      state.loading = false;
      state.service_ticket_id = action.payload;
      state.error = null;
    },
    serviceTicketFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTechnicianToServiceTicketStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addTechnicianToServiceTicketSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    addTechnicianToServiceTicketFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getServiceTicketListsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getServiceTicketListsSuccess: (state, action) => {
      state.loading = false;
      state.serviceTickets = action.payload;
      state.error = null;
    },
    getServiceTicketListsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteServiceTicketStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteServiceTicketSuccess: (state, action) => {
      state.loading = false;
      state.serviceTickets = state.serviceTickets?.filter(
        (ticket) => ticket.service_ticket_id !== action.payload
      );
      state.error = null;
    },
    deleteServiceTicketFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateServiceTicketStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateServiceTicketSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    updateServiceTicketFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getServiceTicketDetailsStart: (state) => {
      state.loadingDetails = true;
      state.error = null;
    },
    getServiceTicketDetailsSuccess: (state, action) => {
      state.loadingDetails = false;
      state.serviceTicketDetails = action.payload;
      state.error = null;
    },
    getServiceTicketDetailsFailure: (state, action) => {
      state.loadingDetails = false;
      state.error = action.payload;
    },
    assignPeopleToServiceTicketStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    assignPeopleToServiceTicketSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    assignPeopleToServiceTicketFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteAssigneeSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    serviceTicketImageStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    serviceTicketImageSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    serviceTicketImageFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  serviceTicketStart,
  serviceTicketSuccess,
  serviceTicketFailure,
  addTechnicianToServiceTicketStart,
  addTechnicianToServiceTicketSuccess,
  addTechnicianToServiceTicketFailure,
  getServiceTicketListsStart,
  getServiceTicketListsSuccess,
  getServiceTicketListsFailure,
  deleteServiceTicketStart,
  deleteServiceTicketSuccess,
  deleteServiceTicketFailure,
  updateServiceTicketStart,
  updateServiceTicketSuccess,
  updateServiceTicketFailure,
  getServiceTicketDetailsStart,
  getServiceTicketDetailsSuccess,
  getServiceTicketDetailsFailure,
  assignPeopleToServiceTicketStart,
  assignPeopleToServiceTicketSuccess,
  assignPeopleToServiceTicketFailure,
  deleteAssigneeSuccess,
  serviceTicketImageStart,
  serviceTicketImageSuccess,
  serviceTicketImageFailure

} = serviceTicketSlice.actions;

export default serviceTicketSlice.reducer;
