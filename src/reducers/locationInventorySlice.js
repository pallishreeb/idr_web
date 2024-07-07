import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  locations: [],
  loading: false,
  error: null,
};

const locationsInventorySlice = createSlice({
  name: "locationsInventory",
  initialState,
  reducers: {
    getLocationInventoryStart: (state) => {
      state.error = null;
      state.loading = true;
    },
    getLocationInventorySuccess: (state, action) => {
      state.locations = action.payload;
      state.loading = false;
      state.error = null;
    },
    getLocationInventoryFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    postLocationInventoryStart: (state) => {
      state.error = null;
      state.loading = true;
    },

    postLocationInventorySuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },

    postLocationInventoryFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  getLocationInventorySuccess,
  getLocationInventoryFailure,
  getLocationInventoryStart,
  postLocationInventorySuccess,
  postLocationInventoryFailure,
  postLocationInventoryStart,
} = locationsInventorySlice.actions;

export default locationsInventorySlice.reducer;
