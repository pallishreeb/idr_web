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

// Add equipments
export const addIdrEquipment = (idrEquipmentData, navigate) => {
  return async (dispatch) => {
    dispatch(addIdrEquipmentStart());

    try {
      const data = await fetchJson(apiConfig.addEquipment, {
        method: "POST",
        body: idrEquipmentData,
      });

      dispatch(addIdrEquipmentSuccess(data));
      toast.success("Idr Equipment added successfully");
      navigate("/idr-equipment");
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
  signout,
  sortBy, orderBy
} = {}) => {
  return async (dispatch) => {
    dispatch(getIdrEquipmentsStart());
    try {

      let url = apiConfig.getEquipments;
      const params = new URLSearchParams();
      const encodedDate = encodeURIComponent(signout);
      // console.log(signout, encodedDate)
      if (search) params.append("search", search);
      if (location) params.append("location_name", location);
      if (model) params.append("model", model);
      if (device_type) params.append("device_type", device_type);
      if (signout) params.append("signout", encodedDate);
      if (sortBy) params.append('sortBy', sortBy);
      if (orderBy) params.append('orderBy', orderBy);
      if (params.toString()) {
        // url += `?${params.toString()}`;
          // Replace '+' with '%20' to ensure spaces are encoded correctly
         url += `?${params.toString().replace(/\+/g, '%20')}`;
      }

      const response = await axios.get(url);

      dispatch(getIdrEquipmentsSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(getIdrEquipmentsFailure(error.message));
      toast.error(
        error.response?.data?.message || "Failed to fetch equipments"
      );
    }
  };
};

// Get equipments by ID
export const getIdrEquipmentById = (idrEquipmentId) => {
  return async (dispatch) => {
    dispatch(getIdrEquipmentByIdStart());
    try {
      const response = await axios.get(
        `${apiConfig.getEquimentById}/${idrEquipmentId}`
      );
      dispatch(getIdrEquipmentByIdSuccess(response.data.equipments));
      return response.data?.equipments;
    } catch (error) {
      dispatch(getIdrEquipmentByIdFailure(error.message));
      toast.error(
        error.response?.data?.message || "Failed to fetch Idr Equipment by ID"
      );
    }
  };
};

// Delete equipments
export const deleteInventory = (idrEquipmentId) => {
  return async (dispatch) => {
    dispatch(deleteIdrEquipmentStart());
    try {
      await axios.delete(`${apiConfig.deleteEquipment}/${idrEquipmentId}`);
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

// Update equipments
export const updateEquipment = (idrEquipmentData, navigate) => {
  return async (dispatch) => {
    dispatch(updateIdrEquipmentStart());
    try {
      const response = await axios.post(
        `${apiConfig.editEquipment}`,
        idrEquipmentData
      );
      dispatch(updateIdrEquipmentSuccess(response.data));
      toast.success("Idr Equipment updated successfully");
      navigate(`/idr-equipment`);
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
      const data = await fetchJson(apiConfig.transferEquipmentToWorkorder, {
        method: "POST",
        body: idrEquipmentData,
      });
      dispatch(idrEquipmentWorkOrderAssignSuccess(data));
      toast.success(data?.message || "Idr Equipment transferred to WorkOrder");
      navigate("/idr-equipment");
    } catch (error) {
      dispatch(idrEquipmentWorkOrderAssignFailure(error.message));
      toast.error(error.message || "Failed to Assign Work Order");
    }
  };
};

//  idrEquipmentTransfer 
export const idrEmployeeAssign = (idrEquipmentData, navigate) => {
  return async (dispatch) => {
    dispatch(idrEquipmentTransferStart());
    try {
      const data = await fetchJson(apiConfig.transferEquipmentToEmployee, {
        method: "POST",
        body: idrEquipmentData,
      });
      dispatch(idrEquipmentTransferSuccess(data));
      toast.success(data?.message || "Idr Equipment transferred successfully");
      navigate("/idr-equipment");
    } catch (error) {
      dispatch(idrEquipmentTransferFailure(error.message));
      toast.error(error.message || "Failed to Transfer Idr Equipment");
    }
  };
};

// Get all returned request equipments 
export const getReturnedRequestEquipments = ({ signout = "", sortBy = "", orderBy = "" } = {}) => {
  
  return async (dispatch) => {
    dispatch(getIdrEquipmentsStart());
    try {
      let url = apiConfig.equipmentReturnRequestList;
      const params = new URLSearchParams();
      const formattedDateTime = (signoutDate) => {
        // Create a new Date object with the provided date string
        const date = new Date(signoutDate);
      
        // Manually format the date to ensure there's no timezone shift
        const formattedDate = date.toLocaleDateString('en-US', {
          timeZone: 'UTC', // Force UTC to avoid shifting the date
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      
        return formattedDate;
        } 
      if (signout) params.append("signout", formattedDateTime(signout));
      if (sortBy) params.append('sortBy', sortBy);
      if (orderBy) params.append('orderBy', orderBy);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const response = await axios.get(url);

      dispatch(getIdrEquipmentsSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(getIdrEquipmentsFailure(error.message));
      toast.error(
        error.response?.data?.message || "Failed to fetch equipments"
      );
    }
  };
};
// Get all returned equipments 
export const getAssignedEquipments = ({ signout = "",sortBy = "", orderBy = "" } = {}) => {

  // console.log(sortBy, orderBy);
  return async (dispatch) => {
    dispatch(getIdrEquipmentsStart());
    try {
      let url = apiConfig.equipmentAssigned;
      const params = new URLSearchParams();
      const formattedDateTime = (signoutDate) => {
        // Create a new Date object with the provided date string
        const date = new Date(signoutDate);
      
        // Manually format the date to ensure there's no timezone shift
        const formattedDate = date.toLocaleDateString('en-US', {
          timeZone: 'UTC', // Force UTC to avoid shifting the date
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      
        return formattedDate;
        } 
      if (signout) params.append("signout", formattedDateTime(signout));
      if (sortBy) params.append('sortBy', sortBy);
      if (orderBy) params.append('orderBy', orderBy);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const response = await axios.get(url);
      dispatch(getIdrEquipmentsSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(getIdrEquipmentsFailure(error.message));
      toast.error(
        error.response?.data?.message || "Failed to fetch equipments"
      );
    }
  };
};

// Confirm returned equipments
export const confirmReturnedEquipment = (equipmentId, navigate) => {
  return async (dispatch) => {
    dispatch(updateIdrEquipmentStart());
    try {
      const response = await axios.patch(
        `${apiConfig.confirmReturnedEquipment}/${equipmentId}`
      );
      dispatch(updateIdrEquipmentSuccess(response.data));
      toast.success("Equipment Return Confirmed");
      navigate(`/idr-equipment`);
    } catch (error) {
      dispatch(updateIdrEquipmentFailure(error.message));
      toast.error(
        error.response?.data?.message || "Failed to update Idr Equipment"
      );
    }
  };
};