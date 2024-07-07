import axios from "axios";
import { apiConfig } from "../config";
import {
  getLocationInventoryFailure,
  getLocationInventoryStart,
  getLocationInventorySuccess,
  postLocationInventoryFailure,
  postLocationInventoryStart,
  postLocationInventorySuccess,
} from "../reducers/locationInventorySlice";
import { toast } from "react-toastify";

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

export const postLocationInventory = (data) => {
  return async (dispatch) => {
    dispatch(postLocationInventoryStart());
    try {
      const response = await axios.post(apiConfig.postInventoryLocation, data);
      dispatch(postLocationInventorySuccess(response.location));
      return response;
    } catch (error) {
      dispatch(postLocationInventoryFailure(error.message));
      toast.error("Error in adding location.")
    }
  };
};
