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
      console.log("check", response);
      dispatch(postLocationInventorySuccess(data.location));
    } catch (error) {
      dispatch(postLocationInventoryFailure(error.message));
    }
  };
};
