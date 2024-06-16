// src/reducers/workOrderSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  workOrders: [],
  technicians: [],
  notes: [],
  work_order_id: null,
  workOrderDetails: null,
  error: null,
};

const workOrderSlice = createSlice({
  name: "workOrders",
  initialState,
  reducers: {
    generateTicketStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    generateTicketSuccess: (state, action) => {
      state.loading = false;
      // state.workOrders.push(action.payload);
      state.work_order_id = action.payload,
      state.error = null;
    },
    generateTicketFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTechnicianToTicketStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addTechnicianToTicketSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      // const index = state.workOrders.findIndex(order => order.id === action.payload.workOrderId);
      // if (index !== -1) {
      //   state.workOrders[index].technicians.push(action.payload.technician);
      // }
    },
    addTechnicianToTicketFailure: (state, action) => {
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
      // const index = state.workOrders.findIndex(order => order.id === action.payload.workOrderId);
      // if (index !== -1) {
      //   state.workOrders[index].notes.push(action.payload.note);
      // }
    },
    addNotesToTicketFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getWorkOrderListsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getWorkOrderListsSuccess: (state, action) => {
      state.loading = false;
      state.workOrders = action.payload;
      state.error = null;
    },
    getWorkOrderListsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteWorkOrderStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteWorkOrderSuccess: (state, action) => {
      state.loading = false;
      state.workOrders = state.workOrders?.workOrder.filter(order => order.work_order_id !== action.payload);
      state.error = null;
    },
    deleteWorkOrderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateTicketStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateTicketSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      // const index = state.workOrders?.workOrder.findIndex(order => order.work_order_id === action.payload.work_order_id);
      // if (index !== -1) {
      //   state.workOrders.workOrder[index] = action.payload;
      // }
    },
    updateTicketFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateTechnicianStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateTechnicianSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      // const workOrderIndex = state.workOrders.findIndex(order => order.id === action.payload.workOrderId);
      // if (workOrderIndex !== -1) {
      //   const technicianIndex = state.workOrders[workOrderIndex].technicians.findIndex(tech => tech.id === action.payload.technician.id);
      //   if (technicianIndex !== -1) {
      //     state.workOrders[workOrderIndex].technicians[technicianIndex] = action.payload.technician;
      //   }
      // }
    },
    updateTechnicianFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateNotesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateNotesSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      // const workOrderIndex = state.workOrders.findIndex(order => order.id === action.payload.workOrderId);
      // if (workOrderIndex !== -1) {
      //   const noteIndex = state.workOrders[workOrderIndex].notes.findIndex(note => note.id === action.payload.note.id);
      //   if (noteIndex !== -1) {
      //     state.workOrders[workOrderIndex].notes[noteIndex] = action.payload.note;
      //   }
      // }
    },
    updateNotesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getTechniciansByWorkOrderStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getTechniciansByWorkOrderSuccess: (state, action) => {
      state.loading = false;
      state.technicians = action.payload;
      state.error = null;
    },
    getTechniciansByWorkOrderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getNotesByWorkOrderStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getNotesByWorkOrderSuccess: (state, action) => {
      state.loading = false;
      state.notes = action.payload;
      state.error = null;
    },
    getNotesByWorkOrderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getWorkOrderByClientIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getWorkOrderByClientIdSuccess: (state, action) => {
      state.loading = false;
      state.workOrders = action.payload;
      state.error = null;
    },
    getWorkOrderByClientIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getWorkOrderDetailsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getWorkOrderDetailsSuccess: (state, action) => {
      state.loading = false;
      state.workOrderDetails = action.payload;
      state.error = null;
    },
    getWorkOrderDetailsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  }
});

export const {
  generateTicketStart, generateTicketSuccess, generateTicketFailure,
  addTechnicianToTicketStart, addTechnicianToTicketSuccess, addTechnicianToTicketFailure,
  addNotesToTicketStart, addNotesToTicketSuccess, addNotesToTicketFailure,
  getWorkOrderListsStart, getWorkOrderListsSuccess, getWorkOrderListsFailure,
  deleteWorkOrderStart, deleteWorkOrderSuccess, deleteWorkOrderFailure,
  updateTicketStart, updateTicketSuccess, updateTicketFailure,
  updateTechnicianStart, updateTechnicianSuccess, updateTechnicianFailure,
  updateNotesStart, updateNotesSuccess, updateNotesFailure,
  getTechniciansByWorkOrderStart, getTechniciansByWorkOrderSuccess, getTechniciansByWorkOrderFailure,
  getNotesByWorkOrderStart, getNotesByWorkOrderSuccess, getNotesByWorkOrderFailure,
  getWorkOrderByClientIdStart, getWorkOrderByClientIdSuccess, getWorkOrderByClientIdFailure,
  getWorkOrderDetailsStart,getWorkOrderDetailsSuccess,getWorkOrderDetailsFailure
} = workOrderSlice.actions;

export default workOrderSlice.reducer;
