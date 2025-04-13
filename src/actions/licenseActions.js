// src/actions/serviceTicketActions.js

import axios from "../axios-config";
import { toast } from "react-toastify";
import {
    licenseStart,
    licenseSuccess,
    licenseFailure,
    getLicenseDetailsStart,
    getLicenseDetailsSuccess,
    getLicenseDetailsFailure,
    getLicenseListsStart,
    getLicenseListsSuccess,
    getLicenseListsFailure,
    deleteLicenseStart,
    deleteLicenseSuccess,
    deleteLicenseFailure,
    updateLicenseStart,
    updateLicenseSuccess,
    updateLicenseFailure,

} from "../reducers/licenseSlice";
import { apiConfig } from "../config";
import { fetchJson } from '../fetch-config';
// Generate a new license ticket
export const createLicense = (licenseData,navigate) => {
    return async (dispatch) => {
      dispatch(licenseStart());
      try {
        const data = await fetchJson(apiConfig.createLicense, {
          method: 'POST',
          body: licenseData
        });
  
        dispatch(licenseSuccess(data));
        toast.success("License generated successfully");
        // navigate('/client-licensing');
        return data;
        
      } catch (error) {
        console.error('Error occurred:', error);
  
        dispatch(licenseFailure(error.message));
        toast.error(error.message || "Failed to create license");
      }
    };
};
    
export const getLicenseLists = (filters = {},sortBy, orderBy) => {
  return async (dispatch, getState) => {
    // console.log(sortBy,orderBy)
    const { user_type } = getState().user.user; // Get user_type from state

    dispatch(getLicenseListsStart());

    try {
      const params = new URLSearchParams();

      for (const key in filters) {
        if (filters[key]) {
          // Exclude client_id and location_id for Client Employee
          if (
            user_type === "Client Employee" &&
            (key === "client_id" ) //|| key === "location_id"
          ) {
            continue;
          }
          params.append(key, filters[key]);
    
        }
      }

      // if(filters['location_id']) params.append('location_id', filters['location_id'])
      if (sortBy) params.append('sort_by', sortBy);
      if (orderBy) params.append('order', orderBy);


      const queryString = params.toString();
      const url = queryString
        ? `${apiConfig.getLicenseList}?${queryString}`
        : apiConfig.getLicenseList;

      const response = await axios.get(url);

      // console.log("License response:", response);
      dispatch(getLicenseListsSuccess(response?.data?.Licenses));
    } catch (error) {
      dispatch(getLicenseListsFailure(error.message));
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch License lists"
      );
    }
  };
};


// Update a service ticket
export const updateLicense = (licenseData,navigate) => {
  return async (dispatch) => {
    dispatch(updateLicenseStart());
    try {
      const response = await axios.patch(`${apiConfig.updateLicense}`, licenseData);
      dispatch(updateLicenseSuccess(response.data));
      toast.success("License updated successfully");
      // navigate('/client-licensing')
    } catch (error) {
      dispatch(updateLicenseFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to update License");
    }
  };
};

// Delete a service ticket
export const deleteLicense= (licenseId) => {
  return async (dispatch) => {
    dispatch(deleteLicenseStart());
    try {
      await axios.delete(`${apiConfig.deleteLicense}/${licenseId}`);
      dispatch(deleteLicenseSuccess(licenseId));
      toast.success("License deleted successfully");
    } catch (error) {
      dispatch(deleteLicenseFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to delete License");
    }
  };
};

export const getLicenseDetails = (licenseId) => {
  return async (dispatch) => {
    dispatch(getLicenseDetailsStart());
    try {
      const url = `${apiConfig.licenseDetailsById}/${licenseId}`;
      const response = await axios.get(url);
      // console.log("license details", response.data?.LicenseRec)
      dispatch(getLicenseDetailsSuccess(response.data?.LicenseRec));
      return response?.data?.LicenseRec;
    } catch (error) {
      dispatch(getLicenseDetailsFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch license details");
    }
  };
};


