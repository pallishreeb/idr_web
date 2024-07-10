import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  inventories: [],
  inventory: null,
  loading: false,
  loadingAssign: false,
  loadingTransfer: false,
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    addInventoryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addInventorySuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      // state.inventories.push(action.payload);
    },
    addInventoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getInventoriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getInventoriesSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.inventories = action.payload;
    },
    getInventoriesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getInventoryByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getInventoryByIdSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.inventory = action.payload;
    },
    getInventoryByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteInventoryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteInventorySuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      // state.inventories = state.inventories.filter(inventory => inventory.id !== action.payload);
    },
    deleteInventoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateInventoryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateInventorySuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      // const index = state.inventories.findIndex(inventory => inventory.id === action.payload.id);
      // if (index !== -1) {
      //   state.inventories[index] = action.payload;
      // }
    },
    updateInventoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    inventoryWorkOrderAssignSuccess: (state, action) => {
      state.loadingAssign = false;
      state.error = null;
    },
    inventoryWorkOrderAssignFailure: (state, action) => {
      state.loadingAssign = false;
      state.error = action.payload;
    },
    inventoryWorkOrderAssignStart: (state) => {
      state.loadingAssign = true;
      state.error = null;
    },
    inventoryTransferSuccess: (state, action) => {
      state.loadingTransfer = false;
      state.error = null;
    },
    inventoryTransferFailure: (state, action) => {
      state.loadingTransfer = false;
      state.error = action.payload;
    },
    inventoryTransferStart: (state) => {
      state.loadingTransfer = true;
      state.error = null;
    },
  },
});

export const {
  addInventoryStart,
  addInventorySuccess,
  addInventoryFailure,
  getInventoriesStart,
  getInventoriesSuccess,
  getInventoriesFailure,
  getInventoryByIdStart,
  getInventoryByIdSuccess,
  getInventoryByIdFailure,
  deleteInventoryStart,
  deleteInventorySuccess,
  deleteInventoryFailure,
  updateInventoryStart,
  updateInventorySuccess,
  updateInventoryFailure,
  inventoryWorkOrderAssignStart,
  inventoryWorkOrderAssignSuccess,
  inventoryWorkOrderAssignFailure,
  inventoryTransferStart,
  inventoryTransferSuccess,
  inventoryTransferFailure,
  
} = inventorySlice.actions;

export default inventorySlice.reducer;
