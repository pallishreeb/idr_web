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
    model,
    device_type,
    status,
    sortBy, orderBy
  } = {}) => {
    return async (dispatch) => {
      dispatch(getClientEquipmentsStart());
      try {
  
        let url = apiConfig.getClientEquipments;
        const params = new URLSearchParams();

        if (location) params.append("location_name", location);
        if (model) params.append("model", model);
        if (device_type) params.append("device_type", device_type);
        if (status) params.append("status", status);
        if (sortBy) params.append('sortBy', sortBy);
        if (orderBy) params.append('orderBy', orderBy);
        if (params.toString()) {
          // url += `?${params.toString()}`;
            // Replace '+' with '%20' to ensure spaces are encoded correctly
           url += `?${params.toString().replace(/\+/g, '%20')}`;
        }
  
        const response = await axios.get(url);
  
        dispatch(getClientEquipmentsSuccess(response.data));
        return response.data;
      } catch (error) {
        dispatch(getClientEquipmentsFailure(error.message));
        toast.error(
          error.response?.data?.message || "Failed to fetch client equipments"
        );
      }
    };
  };
  
  // Get client equipments by ID
  export const getClientEquipmentById = (idrEquipmentId) => {
    return async (dispatch) => {
      dispatch(getClientEquipmentByIdStart());
      try {
        const response = await axios.get(
          `${apiConfig.getClientEquipmentById}/${idrEquipmentId}`
        );
        dispatch(getClientEquipmentByIdSuccess(response.data.equipments));
        return response.data?.equipments;
      } catch (error) {
        dispatch(getClientEquipmentByIdFailure(error.message));
        toast.error(
          error.response?.data?.message || "Failed to fetch Idr Equipment by ID"
        );
      }
    };
  };

//add client equipment
export const addClientEquipment = (locationData,navigate) => {
  return async (dispatch) => {
    dispatch(addClientEquipmentStart());
    try {
      const response = await axios.post(apiConfig.addClientEquipment, locationData);
      dispatch(addClientEquipmentSuccess(response.data.location));
      toast.success("Client Equipment added successfully!");
      navigate("/locations");
    } catch (error) {
      dispatch(addClientEquipmentFailure(error.message));
      toast.error(error.response?.data?.message || "Error adding Client Equipment");
    }
  };
};

//retire client equipment
export const retireClientEquipment= (locationId) => {
  return async (dispatch) => {
    dispatch(retireClientEquipmentStart());
    try {
      await axios.delete(`${apiConfig.retireClientEquipment}/${locationId}`).then(() =>{
        dispatch(retireClientEquipmentSuccess(locationId));
        toast.success("Client Equipment retired successfully!");
      });
    } catch (error) {
      dispatch(retireClientEquipmentFailure(error.message));
      toast.error(error.response?.data?.message || "Error retiring ClientEquipment");
    }
  };
};

//update client equipment
export const updateClientEquipment = (locationId, updatedClientEquipment,navigate) => {
  console.log(updatedClientEquipment, "updatedLocationData")
  return async (dispatch) => {
    dispatch(updateClientEquipmentStart());
    try {
      // Make the API call to update the location data
      const response = await axios.patch(`${apiConfig.updateClientEquipment}/${locationId}`, updatedClientEquipment);
      // Dispatch success action if the update was successful
    
      dispatch(updateClientEquipmentSuccess(response.data));
      // Optionally, you can dispatch any additional actions or perform other logic here
      toast.success("Client Equipment updated successfully");
      navigate("/locations");
    } catch (error) {
      // Dispatch failure action if there was an error
      dispatch(updateClientEquipmentFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to update Client Equipment");
    }
  };
};