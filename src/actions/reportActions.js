import axios from '../axios-config';
import { toast } from "react-toastify";
import { 
  getInventoryReportListStart, getInventoryReportListSuccess, getInventoryReportListFailure,
  getInventoryReportByIdStart, getInventoryReportByIdSuccess, getInventoryReportByIdFailure,
  getEquipmentReportListStart, getEquipmentReportListSuccess, getEquipmentReportListFailure,
  getEquipmentReportByIdStart, getEquipmentReportByIdSuccess, getEquipmentReportByIdFailure
} from "../reducers/reportSlice";
import { apiConfig } from "../config";

// Get Inventory Report List
export const getInventoryReportList = ({ search, location, sortBy, orderBy } = {}) => {
  return async (dispatch) => {
    dispatch(getInventoryReportListStart());
    try {
      let url = apiConfig.getInventoryReportList;
      const params = new URLSearchParams();

      if (search) params.append('search', search);
      if (location) params.append('location', location);
      if (sortBy) params.append('sortBy', sortBy);
      if (orderBy) params.append('orderBy', orderBy);

      if (params.toString()) {
        url += `?${params.toString().replace(/\+/g, '%20')}`;
      }

      const response = await axios.get(url);

      dispatch(getInventoryReportListSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(getInventoryReportListFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch inventory reports");
    }
  };
};

// Get Inventory Report by ID
export const getInventoryReportById = (reportId) => {
  return async (dispatch) => {
    dispatch(getInventoryReportByIdStart());
    try {
      const response = await axios.get(`${apiConfig.getInventoryReportById}/${reportId}`);
      dispatch(getInventoryReportByIdSuccess(response.data.report));
      return response?.data;
    } catch (error) {
      dispatch(getInventoryReportByIdFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch inventory report by ID");
    }
  };
};

// Get Equipment Report List
export const getEquipmentReportList = ({ search, device_type, sortBy, orderBy } = {}) => {
  return async (dispatch) => {
    dispatch(getEquipmentReportListStart());
    try {
      let url = apiConfig.getEquipmentReportList;
      const params = new URLSearchParams();

      if (search) params.append('search', search);
      if (device_type) params.append('device_type', device_type);
      if (sortBy) params.append('sortBy', sortBy);
      if (orderBy) params.append('orderBy', orderBy);

      if (params.toString()) {
        url += `?${params.toString().replace(/\+/g, '%20')}`;
      }

      const response = await axios.get(url);

      dispatch(getEquipmentReportListSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(getEquipmentReportListFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch equipment reports");
    }
  };
};

// Get Equipment Report by ID
export const getEquipmentReportById = (reportId) => {
  return async (dispatch) => {
    dispatch(getEquipmentReportByIdStart());
    try {
      const response = await axios.get(`${apiConfig.getEquipmentReportById}/${reportId}`);
      dispatch(getEquipmentReportByIdSuccess(response.data.report));
      return response?.data;
    } catch (error) {
      dispatch(getEquipmentReportByIdFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch equipment report by ID");
    }
  };
};
