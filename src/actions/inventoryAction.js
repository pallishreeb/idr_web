import axios from '../axios-config';
import { toast } from "react-toastify";
import { 
  addInventoryStart, addInventorySuccess, addInventoryFailure,
  getInventoriesStart, getInventoriesSuccess, getInventoriesFailure,
  getInventoryByIdStart, getInventoryByIdSuccess, getInventoryByIdFailure,
  deleteInventoryStart, deleteInventorySuccess, deleteInventoryFailure,
  updateInventoryStart, updateInventorySuccess, updateInventoryFailure
} from "../reducers/inventorySlice";
import { apiConfig } from "../config";

// Add inventory
export const addInventory = (inventoryData, navigate) => {
  return async (dispatch) => {
    dispatch(addInventoryStart());
    try {
      const response = await axios.post(apiConfig.addInventory, inventoryData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(addInventorySuccess(response.data));
      toast.success("Inventory added successfully");
      navigate('/inventory');
    } catch (error) {
      dispatch(addInventoryFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to add inventory");
    }
  };
};

// Get all inventories with optional search and filter parameters
export const getInventories = ({ search, location, model, device_type } = {}) => {
  return async (dispatch) => {
    dispatch(getInventoriesStart());
    try {
      let url = apiConfig.getInventories;
      const params = new URLSearchParams();

      if (search) params.append('search', search);
      if (location) params.append('location', location);
      if (model) params.append('model', model);
      if (device_type) params.append('device_type', device_type);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);

      dispatch(getInventoriesSuccess(response.data));
    } catch (error) {
      dispatch(getInventoriesFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch inventories");
    }
  };
};

// Get inventory by ID
export const getInventoryById = (inventoryId) => {
  return async (dispatch) => {
    dispatch(getInventoryByIdStart());
    try {
      const response = await axios.get(`${apiConfig.getInventoryById}/${inventoryId}`);
      dispatch(getInventoryByIdSuccess(response.data.inventory));
      return response.data?.inventory
    } catch (error) {
      dispatch(getInventoryByIdFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch inventory by ID");
    }
  };
};

// Delete inventory
export const deleteInventory = (inventoryId) => {
  return async (dispatch) => {
    dispatch(deleteInventoryStart());
    try {
      await axios.delete(`${apiConfig.deleteInventory}/${inventoryId}`);
      dispatch(deleteInventorySuccess(inventoryId));
      toast.success("Inventory deleted successfully");
    } catch (error) {
      dispatch(deleteInventoryFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to delete inventory");
    }
  };
};

// Update inventory
export const updateInventory = (inventoryData, navigate) => {
  return async (dispatch) => {
    dispatch(updateInventoryStart());
    try {
      const response = await axios.post(`${apiConfig.updateInventory}`, inventoryData);
      dispatch(updateInventorySuccess(response.data));
      toast.success("Inventory updated successfully");
      navigate(`/inventory`);
    } catch (error) {
      dispatch(updateInventoryFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to update inventory");
    }
  };
};
