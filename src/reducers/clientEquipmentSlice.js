import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  equipments: [],
  equipment: null,
  loading: false,
  loadingDetails: false,
  loadingAssign: false,
  loadingTransfer: false,
  error: null,
};

const clientEquipmentSlice = createSlice({
  name: "clientEquipment",
  initialState,
  reducers: {
    addClientEquipmentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addClientEquipmentSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      // state.equipments.push(action.payload);
    },
    addClientEquipmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getClientEquipmentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getClientEquipmentsSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.equipments = action.payload;
    },
    getClientEquipmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getClientEquipmentByIdStart: (state) => {
      state.loadingDetails = true;
      state.error = null;
    },
    getClientEquipmentByIdSuccess: (state, action) => {
      state.loadingDetails = false;
      state.error = null;
      state.equipment = action.payload;
    },
    getClientEquipmentByIdFailure: (state, action) => {
      state.loadingDetails = false;
      state.error = action.payload;
    },
    retireClientEquipmentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    retireClientEquipmentSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.equipments = state.equipments.map((equipment) =>
        equipment.client_equipment_id === action.payload.id
          ? { ...equipment, is_deleted: action.payload.isDecomission }
          : equipment
      )
    },
    retireClientEquipmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateClientEquipmentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateClientEquipmentSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    updateClientEquipmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearClientEquipments: (state, action) => {
      state.loading = false;
      state.error = null;
      state.equipments = [];
    },
    
  },
});

export const {
    getClientEquipmentsStart,
    getClientEquipmentsSuccess,
    getClientEquipmentsFailure,
    getClientEquipmentByIdStart,
    getClientEquipmentByIdSuccess,
    getClientEquipmentByIdFailure,
    addClientEquipmentStart,
    addClientEquipmentSuccess,
    addClientEquipmentFailure,
    updateClientEquipmentStart,
    updateClientEquipmentSuccess,
    updateClientEquipmentFailure,
    retireClientEquipmentStart,
    retireClientEquipmentSuccess,
    retireClientEquipmentFailure,
    clearClientEquipments

} = clientEquipmentSlice.actions;

export default clientEquipmentSlice.reducer;
