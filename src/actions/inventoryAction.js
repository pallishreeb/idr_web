import axios from '../axios-config';
import { toast } from "react-toastify";
import { 
  addInventoryStart, addInventorySuccess, addInventoryFailure,
  getInventoriesStart, getInventoriesSuccess, getInventoriesFailure,
  getInventoryByIdStart, getInventoryByIdSuccess, getInventoryByIdFailure,
  deleteInventoryStart, deleteInventorySuccess, deleteInventoryFailure,
  updateInventoryStart, updateInventorySuccess, updateInventoryFailure,
  inventoryWorkOrderAssignStart,inventoryWorkOrderAssignSuccess,inventoryWorkOrderAssignFailure,
  inventoryTransferStart,inventoryTransferSuccess,inventoryTransferFailure
} from "../reducers/inventorySlice";
import { apiConfig } from "../config";
import { fetchJson } from '../fetch-config';


// Add inventory
export const addInventory = (inventoryData, navigate) => {
  return async (dispatch) => {
    dispatch(addInventoryStart());

    try {
      const data = await fetchJson(apiConfig.addInventory, {
        method: 'POST',
        body: inventoryData
      });

      dispatch(addInventorySuccess(data));
      toast.success("Inventory added successfully");
      navigate('/inventory');
    } catch (error) {
      console.error('Error occurred:', error);

      dispatch(addInventoryFailure(error.message));
      toast.error(error.message || "Failed to add inventory");
    }
  };
};

// Get all inventories with optional search, filter, and sorting parameters
export const getInventories = ({ search, location, model, device_type, sortBy, orderBy } = {}) => {
  return async (dispatch) => {
    dispatch(getInventoriesStart());
    try {
      let url = apiConfig.getInventories;
      const params = new URLSearchParams();

      if (search) params.append('search', search);
      if (location) params.append('location', location);
      if (model) params.append('model', model);
      if (device_type) params.append('device_type', device_type);
      if (sortBy) params.append('sortBy', sortBy);
      if (orderBy) params.append('orderBy', orderBy);

      if (params.toString()) {
        // url += `?${params.toString()}`;
        url += `?${params.toString().replace(/\+/g, '%20')}`;
      }

      const response = await axios.get(url);

      dispatch(getInventoriesSuccess(response.data));
      return response.data;
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

//  inventory work order assign
export const inventoryWorkOrderAssign = (inventoryData, navigate) => {
  return async (dispatch) => {
    dispatch(inventoryWorkOrderAssignStart());
    try {
      const data = await fetchJson(apiConfig.inventoryWorkOrderAssign, {
        method: 'POST',
        body: inventoryData
      });
      dispatch(inventoryWorkOrderAssignSuccess(data));
      toast.success(data?.message ||"Inventory transferred to WorkOrder");
      navigate('/inventory');
    } catch (error) {
      dispatch(inventoryWorkOrderAssignFailure(error.message));
      toast.error(error.message || "Failed to Assign Work Order");
    }
  };
};

//  inventory transfer
export const inventoryTransfer = (inventoryData, navigate) => {
  return async (dispatch) => {
    dispatch(inventoryTransferStart());
    try {
      const data = await fetchJson(apiConfig.inventoryTransfer, {
        method: 'POST',
        body: inventoryData
      });
      dispatch(inventoryTransferSuccess(data));
      toast.success(data?.message || "Inventory transferred successfully");
      navigate('/inventory');
    } catch (error) {
      dispatch(inventoryTransferFailure(error.message));
      toast.error(error.message || "Failed to Transfer Inventory");
    }
  };
};