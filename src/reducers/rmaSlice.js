import { createSlice } from "@reduxjs/toolkit";

const rmaSlice = createSlice({
  name: "rma",
  initialState: {
    loading: false,
    loadingDetails: false,
    loadingAssignImage:false,
    error: null,
    rmaList: [],
    rmaDetails: null,
  },
  reducers: {
    rmaStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    rmaSuccess: (state, action) => {
      state.loading = false;
      state.rmaDetails = action.payload;
    },
    rmaFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getRMAListsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getRMAListsSuccess: (state, action) => {
      state.loading = false;
      state.rmaList = action.payload;
    },
    getRMAListsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteRMAStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteRMASuccess: (state, action) => {
      state.loading = false;
      state.rmaList = state.rmaList.filter((rma) => rma.rma_id !== action.payload);
    },
    deleteRMAFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateRMAStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateRMASuccess: (state, action) => {
      state.loading = false;
      state.rmaDetails = action.payload;
    },
    updateRMAFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getRMADetailsStart: (state) => {
      state.loadingDetails = true;
      state.error = null;
    },
    getRMADetailsSuccess: (state, action) => {
      state.loadingDetails = false;
      state.rmaDetails = action.payload;
    },
    getRMADetailsFailure: (state, action) => {
      state.loadingDetails = false;
      state.error = action.payload;
    },
    clearRma: (state, action) => {
      state.loading = false;
      state.error = null;
      state.rmaList = []
    },
    addNotesToRmaStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addNotesToRmaSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    addNotesToRmaFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteRmaNoteStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteRmaNoteSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    deleteRmaNoteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addAttachmentsToRmaStart: (state) => {
      state.loadingAssignImage = true;
      state.error = null;
    },
    addAttachmentsToRmaSuccess: (state, action) => {
      state.loadingAssignImage = false;
      state.error = null;
    },
    addAttachmentsToRmaFailure: (state, action) => {
      state.loadingAssignImage = false;
      state.error = action.payload;
    },
  },
});

export const {
  rmaStart,
  rmaSuccess,
  rmaFailure,
  getRMAListsStart,
  getRMAListsSuccess,
  getRMAListsFailure,
  deleteRMAStart,
  deleteRMASuccess,
  deleteRMAFailure,
  updateRMAStart,
  updateRMASuccess,
  updateRMAFailure,
  getRMADetailsStart,
  getRMADetailsSuccess,
  getRMADetailsFailure,
  clearRma,
  addNotesToRmaStart,
  addNotesToRmaSuccess,
  addNotesToRmaFailure,
  addAttachmentsToRmaStart,
  addAttachmentsToRmaSuccess,
  addAttachmentsToRmaFailure,
  deleteRmaNoteStart,
  deleteRmaNoteSuccess,
  deleteRmaNoteFailure,
} = rmaSlice.actions;

export default rmaSlice.reducer;