import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  equipments: [],
  equipment: null,
  loading: false,
  loadingAssign: false,
  loadingTransfer: false,
  error: null,
};

const idrEquipmentSlice = createSlice({
  name: "idrequipment",
  initialState,
  reducers: {
    addIdrEquipmentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addIdrEquipmentSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      // state.equipments.push(action.payload);
    },
    addIdrEquipmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getIdrEquipmentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getIdrEquipmentSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.equipments = action.payload;
    },
    getIdrEquipmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getIdrEquipmentByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getIdrEquipmentByIdSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.equipment = action.payload;
    },
    getIdrEquipmentByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteIdrEquipmentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteIdrEquipmentSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      // state.equipments = state.equipments.filter(equipment => equipment.id !== action.payload);
    },
    deleteIdrEquipmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateIdrEquipmentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateIdrEquipmentSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    updateIdrEquipmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    idrEquipmentWorkOrderAssignSuccess: (state, action) => {
      state.loadingAssign = false;
      state.error = null;
    },
    idrEquipmentWorkOrderAssignFailure: (state, action) => {
      state.loadingAssign = false;
      state.error = action.payload;
    },
    idrEquipmentWorkOrderAssignStart: (state) => {
      state.loadingAssign = true;
      state.error = null;
    },
    idrEquipmentTransferSuccess: (state, action) => {
      state.loadingTransfer = false;
      state.error = null;
    },
    idrEquipmentTransferFailure: (state, action) => {
      state.loadingTransfer = false;
      state.error = action.payload;
    },
    idrEquipmentTransferStart: (state) => {
      state.loadingTransfer = true;
      state.error = null;
    },
    getIdrEquipmentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getIdrEquipmentsSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.equipments = action.payload;
    },
    getIdrEquipmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  addIdrEquipmentStart,
  addIdrEquipmentSuccess,
  addIdrEquipmentFailure,
  getIdrEquipmentStart,
  getIdrEquipmentSuccess,
  getIdrEquipmentFailure,
  getIdrEquipmentByIdStart,
  getIdrEquipmentByIdSuccess,
  getIdrEquipmentByIdFailure,
  deleteIdrEquipmentStart,
  deleteIdrEquipmentSuccess,
  deleteIdrEquipmentFailure,
  updateIdrEquipmentStart,
  updateIdrEquipmentSuccess,
  updateIdrEquipmentFailure,
  idrEquipmentWorkOrderAssignSuccess,
  idrEquipmentWorkOrderAssignFailure,
  idrEquipmentWorkOrderAssignStart,
  idrEquipmentTransferSuccess,
  idrEquipmentTransferFailure,
  idrEquipmentTransferStart,
  getIdrEquipmentsStart,
  getIdrEquipmentsSuccess,
  getIdrEquipmentsFailure,
} = idrEquipmentSlice.actions;

export default idrEquipmentSlice.reducer;
