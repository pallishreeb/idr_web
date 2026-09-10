import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  permissions: [],
  loading: false,
  loaded: false,
  error: null,
};

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    setPermissions(state, action) {
      state.permissions = action.payload;
      state.loading = false;
      state.loaded = true;
      state.error = null;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },

    setError(state, action) {
      state.loading = false;
      state.loaded = false;
      state.error = action.payload;
    },

    clearPermissions(state) {
      state.permissions = [];
      state.loading = false;
      state.loaded = false;
      state.error = null;
    },
  },
});

export const {
  setPermissions,
  setLoading,
  setError,
  clearPermissions,
} = permissionSlice.actions;

export default permissionSlice.reducer;