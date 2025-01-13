// src/actions/locationActions.js

import axios from '../axios-config';
import {
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
} from "../reducers/clientEquipmentSlice";
import { apiConfig } from "../config";
import { toast } from "react-toastify";



// Get all client equipments with optional search and filter parameters
export const getClientEquipments = ({
  client_id,
  location_id,
  model,
  device_type,
  status,
  sortBy,
  orderBy,
} = {}) => {
  return async (dispatch) => {
    if (!client_id || !location_id) {
      toast.error("Client ID and Location ID are required to fetch equipment.");
      return;
    }

    dispatch(getClientEquipmentsStart());
    try {
      let url = apiConfig.getClientEquipments;
      const params = new URLSearchParams();

      params.append("client_id", client_id);
      params.append("location_id", location_id); // Mandatory params
      if (model) params.append("model", model);
      if (device_type) params.append("device_type", device_type);
      if (status) params.append("isDecomission", status);
      if (sortBy) params.append("sortBy", sortBy);
      if (orderBy) params.append("orderBy", orderBy);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      dispatch(getClientEquipmentsSuccess(response.data?.clientEquipments));
      return response.data?.clientEquipments;
    } catch (error) {
      dispatch(getClientEquipmentsFailure(error.message));
      toast.error(
        error.response?.data?.message || "Failed to fetch client equipment."
      );
    }
  };
};

  
  // Get client equipments by ID
  export const getClientEquipmentById = (clientEquipmentId) => {
    return async (dispatch) => {
      dispatch(getClientEquipmentByIdStart());
      try {
        const response = await axios.get(
          `${apiConfig.getClientEquipmentById}/${clientEquipmentId}`
        );
        dispatch(getClientEquipmentByIdSuccess(response.data?.clientEquipment));
        return response.data?.clientEquipment;
      } catch (error) {
        dispatch(getClientEquipmentByIdFailure(error.message));
        toast.error(
          error.response?.data?.message || "Failed to fetch Idr Equipment by ID"
        );
      }
    };
  };

//add client equipment
export const addClientEquipment = (equipmentData,navigate) => {
  return async (dispatch) => {
    dispatch(addClientEquipmentStart());
    try {
      const response = await axios.post(apiConfig.addClientEquipment, equipmentData);
      dispatch(addClientEquipmentSuccess(response.data.location));
      toast.success("Client Equipment added successfully!");
      navigate("/client-equipments");
    } catch (error) {
      dispatch(addClientEquipmentFailure(error.message));
      toast.error(error.response?.data?.message || "Error adding Client Equipment");
    }
  };
};

//retire client equipment
export const retireClientEquipment= (clientEquipment) => {
  return async (dispatch) => {
    dispatch(retireClientEquipmentStart());
    try {
      
      await axios.patch(`${apiConfig.retireClientEquipment}`,clientEquipment).then(() =>{
        dispatch(retireClientEquipmentSuccess(clientEquipment.id));
        toast.success("Client Equipment Decomissioned successfully!");
      });
    } catch (error) {
      dispatch(retireClientEquipmentFailure(error.message));
      toast.error(error.response?.data?.message || "Error Decomissioning ClientEquipment");
    }
  };
};

//update client equipment
export const updateClientEquipment = ( updatedClientEquipment,navigate) => {
  console.log(updatedClientEquipment, "updatedClientEquipment")
  return async (dispatch) => {
    dispatch(updateClientEquipmentStart());
    try {
      // Make the API call to update the location data
      const response = await axios.patch(`${apiConfig.updateClientEquipment}`, updatedClientEquipment);
      // Dispatch success action if the update was successful
    
      dispatch(updateClientEquipmentSuccess(response.data));

      // Optionally, you can dispatch any additional actions or perform other logic here
      toast.success("Client Equipment updated successfully");
      navigate("/client-equipments");
    } catch (error) {
      // Dispatch failure action if there was an error
      dispatch(updateClientEquipmentFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to update Client Equipment");
    }
  };
};