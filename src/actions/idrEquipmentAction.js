import axios from "../axios-config";
import { toast } from "react-toastify";
import { apiConfig } from "../config";
import { fetchJson } from "../fetch-config";
import {
  addIdrEquipmentFailure,
  addIdrEquipmentStart,
  addIdrEquipmentSuccess,
  deleteIdrEquipmentFailure,
  deleteIdrEquipmentStart,
  deleteIdrEquipmentSuccess,
  getIdrEquipmentByIdFailure,
  getIdrEquipmentByIdStart,
  getIdrEquipmentByIdSuccess,
  idrEquipmentTransferFailure,
  idrEquipmentTransferStart,
  idrEquipmentTransferSuccess,
  idrEquipmentWorkOrderAssignFailure,
  idrEquipmentWorkOrderAssignStart,
  idrEquipmentWorkOrderAssignSuccess,
  updateIdrEquipmentFailure,
  updateIdrEquipmentStart,
  updateIdrEquipmentSuccess,
  getIdrEquipmentsStart,
  getIdrEquipmentsSuccess,
  getIdrEquipmentsFailure
} from "../reducers/IdrEquipmentSlice";

// Add inventory
export const addIdrEquipment = (idrEquipmentData, navigate) => {
  return async (dispatch) => {
    dispatch(addIdrEquipmentStart());

    try {
      const data = await fetchJson(apiConfig.addInventory, {
        method: "POST",
        body: idrEquipmentData,
      });

      dispatch(addIdrEquipmentSuccess(data));
      toast.success("Idr Equipment added successfully");
      // navigate("/inventory");
    } catch (error) {
      console.error("Error occurred:", error);

      dispatch(addIdrEquipmentFailure(error.message));
      toast.error(error.message || "Failed to add Idr Equipment");
    }
  };
};

// Get all equipments with optional search and filter parameters
export const getIdrEquipments = ({
  search,
  location,
  model,
  device_type,
} = {}) => {
  return async (dispatch) => {
    dispatch(getIdrEquipmentsStart());
    try {
      let url = apiConfig.getInventories;
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (location) params.append("location_name", location);
      if (model) params.append("model", model);
      if (device_type) params.append("device_type", device_type);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);

      dispatch(getIdrEquipmentsSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(getIdrEquipmentsFailure(error.message));
      toast.error(
        error.response?.data?.message || "Failed to fetch inventories"
      );
    }
  };
};

// Get inventory by ID
export const getIdrEquipmentById = (idrEquipmentId) => {
  return async (dispatch) => {
    dispatch(getIdrEquipmentByIdStart());
    try {
      const response = await axios.get(
        `${apiConfig.getInventoryById}/${idrEquipmentId}`
      );
      dispatch(getIdrEquipmentByIdSuccess(response.data.inventory));
      return response.data?.inventory;
    } catch (error) {
      dispatch(getIdrEquipmentByIdFailure(error.message));
      toast.error(
        error.response?.data?.message || "Failed to fetch Idr Equipment by ID"
      );
    }
  };
};

// Delete inventory
export const deleteInventory = (idrEquipmentId) => {
  return async (dispatch) => {
    dispatch(deleteIdrEquipmentStart());
    try {
      await axios.delete(`${apiConfig.deleteInventory}/${idrEquipmentId}`);
      dispatch(deleteIdrEquipmentSuccess(idrEquipmentId));
      toast.success("Idr Equipment deleted successfully");
    } catch (error) {
      dispatch(deleteIdrEquipmentFailure(error.message));
      toast.error(
        error.response?.data?.message || "Failed to delete Idr Equipment"
      );
    }
  };
};

// Update inventory
export const updateEquipment = (idrEquipmentData, navigate) => {
  return async (dispatch) => {
    dispatch(updateIdrEquipmentStart());
    try {
      const response = await axios.post(
        `${apiConfig.updateInventory}`,
        idrEquipmentData
      );
      dispatch(updateIdrEquipmentSuccess(response.data));
      toast.success("Idr Equipment updated successfully");
      // navigate(`/inventory`);
    } catch (error) {
      dispatch(updateIdrEquipmentFailure(error.message));
      toast.error(
        error.response?.data?.message || "Failed to update Idr Equipment"
      );
    }
  };
};

// idrWorkOrderAssign
export const idrWorkOrderAssign = (idrEquipmentData, navigate) => {
  return async (dispatch) => {
    dispatch(idrEquipmentWorkOrderAssignStart());
    try {
      const data = await fetchJson(apiConfig.inventoryWorkOrderAssign, {
        method: "POST",
        body: idrEquipmentData,
      });
      dispatch(idrEquipmentWorkOrderAssignSuccess(data));
      toast.success(data?.message || "Idr Equipment transferred to WorkOrder");
      // navigate("/inventory");
    } catch (error) {
      dispatch(idrEquipmentWorkOrderAssignFailure(error.message));
      toast.error(error.message || "Failed to Assign Work Order");
    }
  };
};

//  idrEquipmentTransfer 
export const idrEquipmentTransfer = (idrEquipmentData, navigate) => {
  return async (dispatch) => {
    dispatch(idrEquipmentTransferStart());
    try {
      const data = await fetchJson(apiConfig.inventoryTransfer, {
        method: "POST",
        body: idrEquipmentData,
      });
      dispatch(idrEquipmentTransferSuccess(data));
      toast.success(data?.message || "Idr Equipment transferred successfully");
      // navigate("/inventory");
    } catch (error) {
      dispatch(idrEquipmentTransferFailure(error.message));
      toast.error(error.message || "Failed to Transfer Idr Equipment");
    }
  };
};
