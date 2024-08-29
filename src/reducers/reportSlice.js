import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  equipments: [],
  inventories:[],
  equipment: null,
  inventory:null,
  loading: false,
  error: null,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    getEquipmentReportListStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getEquipmentReportListSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.equipments = action.payload;
    },
    getEquipmentReportListFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getEquipmentReportByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getEquipmentReportByIdSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.equipment = action.payload;
    },
    getEquipmentReportByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getInventoryReportListStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      getInventoryReportListSuccess: (state, action) => {
        state.loading = false;
        state.error = null;
        state.inventories = action.payload;
      },
      getInventoryReportListFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
      getInventoryReportByIdStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      getInventoryReportByIdSuccess: (state, action) => {
        state.loading = false;
        state.error = null;
        state.inventory = action.payload;
      },
      getInventoryReportByIdFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
  },
});

export const {
    getInventoryReportListStart, getInventoryReportListSuccess, getInventoryReportListFailure,
    getInventoryReportByIdStart, getInventoryReportByIdSuccess, getInventoryReportByIdFailure,
    getEquipmentReportListStart, getEquipmentReportListSuccess, getEquipmentReportListFailure,
    getEquipmentReportByIdStart, getEquipmentReportByIdSuccess, getEquipmentReportByIdFailure
} = reportSlice.actions;

export default reportSlice.reducer;
