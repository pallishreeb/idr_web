// src/reducers/serviceTicketSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  loadingDetails: false,
  loadingAssign: false,
  loadingAssignImage:false,
  serviceTickets: [],
  technicians: [],
  serviceRequests:[],
  serviceReqInfo:null,
  service_ticket_id: null,
  serviceTicketDetails: null,
  serviceRequestDetails: null,
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
    getServiceRequestsListsSuccess: (state, action) => {
      state.loading = false;
      state.serviceRequests = action.payload;
      state.error = null;
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
    getServiceRequestInfoSuccess: (state, action) => {
      state.loadingDetails = false;
      state.serviceReqInfo = action.payload;
      state.error = null;
    },
    getServiceRequestDetailsSuccess: (state, action) => {
      state.loadingDetails = false;
      state.serviceRequestDetails = action.payload;
      state.error = null;
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
      state.loadingAssignImage = true;
      state.error = null;
    },
    serviceTicketImageSuccess: (state, action) => {
      state.loadingAssignImage = false;
      state.error = null;
    },
    serviceTicketImageFailure: (state, action) => {
      state.loadingAssignImage = false;
      state.error = action.payload;
    },
    linkDeviceToServiceTicketStart: (state) => {
      state.loadingAssign = true;
      state.error = null;
    },
    linkDeviceToServiceTicketSuccess: (state, action) => {
      state.loadingAssign = false;
      state.error = null;
    },
    linkDeviceToServiceTicketFailure: (state, action) => {
      state.loadingAssign = false;
      state.error = action.payload;
    },
    addNoteToDeviceStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addNoteToDeviceSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    addNoteToDeviceFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addNotesToTicketStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addNotesToTicketSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    addNotesToTicketFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteServiceNoteStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteServiceNoteSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    deleteServiceNoteFailure: (state, action) => {
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
  serviceTicketImageFailure,
  linkDeviceToServiceTicketStart,
  linkDeviceToServiceTicketSuccess,
  linkDeviceToServiceTicketFailure,
  addNoteToDeviceStart,
  addNoteToDeviceSuccess,
  addNoteToDeviceFailure,
  addNotesToTicketStart,
  addNotesToTicketSuccess,
  addNotesToTicketFailure,
  deleteServiceNoteStart,
  deleteServiceNoteSuccess,
  deleteServiceNoteFailure,
  getServiceRequestInfoSuccess,
  getServiceRequestsListsSuccess,
  getServiceRequestDetailsSuccess
} = serviceTicketSlice.actions;

export default serviceTicketSlice.reducer;
