import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subcontractors: [],
  subcontractorDetails: null,
  loading: false,
  loadingDetails: false,
  error: null,
};

const subcontractorSlice = createSlice({
  name: "subcontractor",
  initialState,
  reducers: {
    subcontractorStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    subcontractorSuccess: (state, action) => {
      state.loading = false;
      state.subcontractors.push(action.payload);
    },
    subcontractorFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getSubcontractorListsStart: (state) => {
      state.loading = true;
    },
    getSubcontractorListsSuccess: (state, action) => {
      state.loading = false;
      state.subcontractors = action.payload;
    },
    getSubcontractorListsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteSubcontractorStart: (state) => {
      state.loading = true;
    },
    deleteSubcontractorSuccess: (state, action) => {
      state.loading = false;
      state.subcontractors = state.subcontractors.filter(
        (sub) => sub.id !== action.payload
      );
    },
    deleteSubcontractorFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateSubcontractorStart: (state) => {
      state.loading = true;
    },
    updateSubcontractorSuccess: (state, action) => {
      state.loading = false;
      state.subcontractors = state.subcontractors.map((sub) =>
        sub.id === action.payload.id ? action.payload : sub
      );
    },
    updateSubcontractorFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getSubcontractorDetailsStart: (state) => {
      state.loadingDetails = true;
    },
    getSubcontractorDetailsSuccess: (state, action) => {
      state.loadingDetails = false;
      state.subcontractorDetails = action.payload;
    },
    getSubcontractorDetailsFailure: (state, action) => {
      state.loadingDetails = false;
      state.error = action.payload;
    },
    addNotesToSubcontractorStart: (state) => {
      state.loading = true;
    },
    addNotesToSubcontractorSuccess: (state, action) => {
      state.loading = false;
      state.subcontractorDetails.notes = [
        ...state.subcontractorDetails.notes,
        action.payload,
      ];
    },
    addNotesToSubcontractorFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteSubcontractorNoteStart: (state) => {
      state.loading = true;
    },
    deleteSubcontractorNoteSuccess: (state, action) => {
      state.loading = false;
      state.subcontractorDetails.notes = state.subcontractorDetails.notes.filter(
        (note) => note.id !== action.payload
      );
    },
    deleteSubcontractorNoteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  subcontractorStart,
  subcontractorSuccess,
  subcontractorFailure,
  getSubcontractorListsStart,
  getSubcontractorListsSuccess,
  getSubcontractorListsFailure,
  deleteSubcontractorStart,
  deleteSubcontractorSuccess,
  deleteSubcontractorFailure,
  updateSubcontractorStart,
  updateSubcontractorSuccess,
  updateSubcontractorFailure,
  getSubcontractorDetailsStart,
  getSubcontractorDetailsSuccess,
  getSubcontractorDetailsFailure,
  addNotesToSubcontractorStart,
  addNotesToSubcontractorSuccess,
  addNotesToSubcontractorFailure,
  deleteSubcontractorNoteStart,
  deleteSubcontractorNoteSuccess,
  deleteSubcontractorNoteFailure,
} = subcontractorSlice.actions;

export default subcontractorSlice.reducer;
