// src/actions/serviceTicketActions.js

import axios from "../axios-config";
import { toast } from "react-toastify";
import {
serviceAgreementStart,
serviceAgreementSuccess,
serviceAgreementFailure,
getServiceAgreementDetailsStart,
getServiceAgreementDetailsSuccess,
getServiceAgreementDetailsFailure,
getServiceAgreementListsStart,
getServiceAgreementListsSuccess,
getServiceAgreementListsFailure,
deleteServiceAgreementStart,
deleteServiceAgreementSuccess,
deleteServiceAgreementFailure,


} from "../reducers/serviceAgreementSlice";
import { apiConfig } from "../config";
import { fetchJson } from '../fetch-config';
// Generate a new service ticket
export const generateServiceAgreement = (ticketData,navigate) => {
    return async (dispatch) => {
      dispatch(serviceAgreementStart());
      try {
        const data = await fetchJson(apiConfig.serviceAgreementAdd, {
          method: 'POST',
          body: ticketData
        });
  
        dispatch(serviceAgreementSuccess(data));
        toast.success("Service ticket generated successfully");
        navigate('/service-agreements');
        return data;
        
      } catch (error) {
        console.error('Error occurred:', error);
  
        dispatch(serviceAgreementFailure(error.message));
        toast.error(error.message || "Failed to generate service ticket");
      }
    };
};
    
// Get all service ticket lists with optional filters
export const getServiceAgreementLists = (filters) => {
  return async (dispatch) => {
    dispatch(getServiceAgreementListsStart());
    try {
      const params = new URLSearchParams();

      for (const key in filters) {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      }

      const queryString = params.toString();
      const url = queryString ? `${apiConfig.serviceAgreementList}?${queryString}` : apiConfig.getServiceTicketLists;
      const response = await axios.get(url);
 
      console.log("service ticket response", response)
      dispatch(getServiceAgreementListsSuccess(response?.data?.Agreements));
    } catch (error) {
      dispatch(getServiceAgreementListsFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch service ticket lists");
    }
  };
};

// Update a service ticket
export const updateServiceAgreement = (serviceAgreementId) => {
  return async (dispatch) => {
    dispatch(deleteServiceAgreementStart());
    try {
      await axios.delete(`${apiConfig.serviceAgreementUpdate}/${serviceAgreementId}`);
      dispatch(deleteServiceAgreementSuccess(serviceAgreementId));
      toast.success("Service ticket deleted successfully");
    } catch (error) {
      dispatch(deleteServiceAgreementFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to delete service ticket");
    }
  };
};

// Delete a service ticket
export const deleteServiceAgreement = (serviceAgreementId) => {
  return async (dispatch) => {
    dispatch(deleteServiceAgreementStart());
    try {
      await axios.delete(`${apiConfig.serviceAgreementUpdate}/${serviceAgreementId}`);
      dispatch(deleteServiceAgreementSuccess(serviceAgreementId));
      toast.success("Service ticket deleted successfully");
    } catch (error) {
      dispatch(deleteServiceAgreementFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to delete service ticket");
    }
  };
};

export const getServiceAgreementDetails = (serviceAgreementId) => {
  return async (dispatch) => {
    dispatch(getServiceAgreementDetailsStart());
    try {
      const url = `${apiConfig.serviceAgreementById}/${serviceAgreementId}`;
      const response = await axios.get(url);
      
      dispatch(getServiceAgreementDetailsSuccess(response.data?.Agreement));
      return response?.data?.Agreement;
    } catch (error) {
      dispatch(getServiceAgreementDetailsFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch service ticket details");
    }
  };
};


