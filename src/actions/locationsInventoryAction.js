import axios from "axios";
import { apiConfig } from "../config";
import {
  getLocationInventoryFailure,
  getLocationInventoryStart,
  getLocationInventorySuccess,
  postLocationInventoryFailure,
  postLocationInventoryStart,
  postLocationInventorySuccess,
  deleteLocationInventoryStart,
  deleteLocationInventorySuccess,
  deleteLocationInventoryFailure

} from "../reducers/locationInventorySlice";
import { toast } from "react-toastify";
import { fetchJson } from '../fetch-config';

export const getLocationInventory = () => {
  return async (dispatch) => {
    dispatch(getLocationInventoryStart());
    try {
      const response = await axios.get(apiConfig.getInventoryLocation);
      // console.log("check", response.data.locations);
      dispatch(getLocationInventorySuccess(response.data.locations));
    } catch (error) {
      dispatch(getLocationInventoryFailure(error.message));
    }
  };
};

export const postLocationInventory = (location) => {
  return async (dispatch) => {
    dispatch(postLocationInventoryStart());
    try {
      const data = await fetchJson(apiConfig.postInventoryLocation, {
        method: 'POST',
        body: location
      });
      dispatch(postLocationInventorySuccess(data));
      return data;
    } catch (error) {
      dispatch(postLocationInventoryFailure(error.message));
      toast.error(error.message || "Error in adding location.");
      return error;
    }
  };
};


export const deleteLocationInventory = (locationId) => {
  return async (dispatch) => {
    dispatch(deleteLocationInventoryStart());
    try {
      const response = await fetchJson(`${apiConfig.deleteInventoryLocation}/${locationId}`, {
        method: 'DELETE',
      });
      dispatch(deleteLocationInventorySuccess(locationId));
      toast.success("Location deleted successfully.");
      return response;
    } catch (error) {
      dispatch(deleteLocationInventoryFailure(error.message));
      toast.error(error.message || "Failed to delete location.");
      return error;
    }
  };
};
