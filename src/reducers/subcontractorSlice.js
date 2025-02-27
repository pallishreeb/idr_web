import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subcontractors: [],
  subcontractor: null,
  loading: false,
  loadingDetails: false,
  subcontractorTypes:[],
  subcontractorServices:[],
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
        (sub) => sub.subcontractor_id !== action.payload
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
        sub.subcontractor_id === action.payload.id ? action.payload : sub
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
      state.subcontractor = action.payload;
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
      state.error = null;
    },
    addNotesToSubcontractorFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteSubcontractorNoteStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteSubcontractorNoteSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    deleteSubcontractorNoteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getSubcontractorTypesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSubcontractorTypesSuccess: (state, action) => {
      state.loading = false;
      state.subcontractorTypes = action.payload;
    },
    getSubcontractorTypesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getSubcontractorServicesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSubcontractorServicesSuccess: (state, action) => {
      state.loading = false;
      state.subcontractorServices = action.payload;
    },
    getSubcontractorServicesFailure: (state, action) => {
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
  getSubcontractorTypesStart,
  getSubcontractorTypesSuccess,
  getSubcontractorTypesFailure,
  getSubcontractorServicesStart,
  getSubcontractorServicesSuccess,
  getSubcontractorServicesFailure,
} = subcontractorSlice.actions;

export default subcontractorSlice.reducer;
