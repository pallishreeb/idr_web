import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subcontractors: [],
  subcontractor: null,
  loading: false,
  loadingDetails: false,
  subcontractorTypes: [],
  subcontractorServices: [],
  subcontractorUsers: [],
  subcontractorUser: null,
  loadingUsers: false,
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
        (sub) => sub.subcontractor_id !== action.payload,
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
        sub.subcontractor_id === action.payload.id ? action.payload : sub,
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
    getSubcontractorUsersStart: (state) => {
      state.loadingUsers = true;
      state.error = null;
    },
    getSubcontractorUsersSuccess: (state, action) => {
      state.loadingUsers = false;
      state.subcontractorUsers = action.payload;
    },
    getSubcontractorUsersFailure: (state, action) => {
      state.loadingUsers = false;
      state.error = action.payload;
    },

    addSubcontractorUserStart: (state) => {
      state.loadingUsers = true;
    },
    addSubcontractorUserSuccess: (state, action) => {
      state.loadingUsers = false;
      state.subcontractorUsers.push(action.payload);
    },
    addSubcontractorUserFailure: (state, action) => {
      state.loadingUsers = false;
      state.error = action.payload;
    },

    getSubcontractorUserByIdStart: (state) => {
      state.loadingUsers = true;
    },
    getSubcontractorUserByIdSuccess: (state, action) => {
      state.loadingUsers = false;
      state.subcontractorUser = action.payload;
    },
    getSubcontractorUserByIdFailure: (state, action) => {
      state.loadingUsers = false;
      state.error = action.payload;
    },

    updateSubcontractorUserStart: (state) => {
      state.loadingUsers = true;
    },
    updateSubcontractorUserSuccess: (state, action) => {
      state.loadingUsers = false;
      state.subcontractorUsers = state.subcontractorUsers.map((u) =>
        u.subcontractor_user_id === action.payload.subcontractor_user_id
          ? action.payload
          : u,
      );
    },
    updateSubcontractorUserFailure: (state, action) => {
      state.loadingUsers = false;
      state.error = action.payload;
    },

    deleteSubcontractorUserStart: (state) => {
      state.loadingUsers = true;
    },
    deleteSubcontractorUserSuccess: (state, action) => {
      state.loadingUsers = false;
      state.subcontractorUsers = state.subcontractorUsers.filter(
        (u) => u.subcontractor_user_id !== action.payload,
      );
    },
    deleteSubcontractorUserFailure: (state, action) => {
      state.loadingUsers = false;
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
  getSubcontractorUsersStart,
  getSubcontractorUsersSuccess,
  getSubcontractorUsersFailure,
  addSubcontractorUserStart,
  addSubcontractorUserSuccess,
  addSubcontractorUserFailure,
  getSubcontractorUserByIdStart,
  getSubcontractorUserByIdSuccess,
  getSubcontractorUserByIdFailure,
  updateSubcontractorUserStart,
  updateSubcontractorUserSuccess,
  updateSubcontractorUserFailure,
  deleteSubcontractorUserStart,
  deleteSubcontractorUserSuccess,
  deleteSubcontractorUserFailure,
} = subcontractorSlice.actions;

export default subcontractorSlice.reducer;
