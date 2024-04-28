// src/actions/locationActions.js

import axios from "axios";
import {
  addLocationStart,
  addLocationSuccess,
  addLocationFailure,
  deleteLocationStart,
  deleteLocationSuccess,
  deleteLocationFailure,
  getLocationByClientStart,
  getLocationByClientSuccess,
  getLocationByClientFailure,
  getLocationByIdFailure,
  getLocationByIdSuccess,
  getLocationByIdStart,
  updateLocationStart,
  updateLocationSuccess,
  updateLocationFailure
} from "../reducers/locationSlice";
import { API_BASE_URL, apiConfig } from "../config";
import { toast } from "react-toastify";

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const addLocation = (locationData,navigate) => {
  return async (dispatch) => {
    dispatch(addLocationStart());
    try {
      const response = await axios.post(apiConfig.addLocation, locationData);
      dispatch(addLocationSuccess(response.data.location));
      toast.success("Location added successfully!");
      navigate("/locations");
    } catch (error) {
      dispatch(addLocationFailure(error.message));
      toast.error(error.response.data.message || "Error adding location");
    }
  };
};

export const deleteLocation = (locationId) => {
  return async (dispatch) => {
    dispatch(deleteLocationStart());
    try {
      const response = await axios.delete(`${apiConfig.deleteLocation}/${locationId}`);
      dispatch(deleteLocationSuccess(response.data.message));
      toast.success("Location deleted successfully!");
    } catch (error) {
      dispatch(deleteLocationFailure(error.message));
      toast.error("Error deleting location");
    }
  };
};

export const getLocationByClient = (clientId) => {
  return async (dispatch) => {
    dispatch(getLocationByClientStart());
    try {
      const response = await axios.get(`${apiConfig.getLocationByClient}/${clientId}`);
      dispatch(getLocationByClientSuccess(response.data.locations));
    } catch (error) {
      dispatch(getLocationByClientFailure(error.message));
      toast.error("Error fetching locations");
    }
  };
};

export const getLocationById = (locationId) => {
  return async (dispatch) => {
    dispatch(getLocationByIdStart());
    try {
      const response = await axios.post(`${apiConfig.location_by_id}`, {location_id: locationId});
      dispatch(getLocationByIdSuccess(response.data.loc));
    } catch (error) {
      dispatch(getLocationByIdFailure(error.message));
      toast.error("Failed to fetch employee by ID");
    }
  };
};

export const updateLocation = (locationId, updatedLocationData,navigate) => {
  console.log(updatedLocationData, "updatedLocationData")
  return async (dispatch) => {
    dispatch(updateLocationStart());
    try {
      // Make the API call to update the location data
      const response = await axios.patch(`${apiConfig.updateLocation}/${locationId}`, updatedLocationData);
      // Dispatch success action if the update was successful
    
      dispatch(updateLocationSuccess(response.data));
      // Optionally, you can dispatch any additional actions or perform other logic here
      toast.success("Location updated successfully");
      navigate("/locations");
    } catch (error) {
      // Dispatch failure action if there was an error
      dispatch(updateLocationFailure(error.message));
      toast.error("Failed to update location");
    }
  };
};