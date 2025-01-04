// src/actions/serviceTicketActions.js

import axios from "../axios-config";
import { toast } from "react-toastify";
import {
  serviceTicketStart,
  serviceTicketSuccess,
  serviceTicketFailure,
  getServiceTicketListsStart,
  getServiceTicketListsSuccess,
  getServiceTicketListsFailure,
  deleteServiceTicketStart,
  deleteServiceTicketSuccess,
  deleteServiceTicketFailure,
  updateServiceTicketStart,
  updateServiceTicketSuccess,
  updateServiceTicketFailure,
  assignPeopleToServiceTicketStart,
  assignPeopleToServiceTicketSuccess,
  assignPeopleToServiceTicketFailure,
  deleteAssigneeSuccess,
  getServiceTicketDetailsStart,
  getServiceTicketDetailsSuccess,
  getServiceTicketDetailsFailure
} from "../reducers/serviceTicketSlice";
import { apiConfig } from "../config";
import { fetchJson } from '../fetch-config';
// Generate a new service ticket
export const generateServiceTicket = (ticketData) => {
    return async (dispatch) => {
      dispatch(serviceTicketStart());
      try {
        const data = await fetchJson(apiConfig.generateServiceTicket, {
          method: 'POST',
          body: ticketData
        });
  
        dispatch(serviceTicketSuccess(data));
        toast.success("Service ticket generated successfully");
        return data;
        // navigate('/inventory');
      } catch (error) {
        console.error('Error occurred:', error);
  
        dispatch(serviceTicketFailure(error.message));
        toast.error(error.message || "Failed to generate service ticket");
      }
    };
  };
  
// export const generateServiceTicket = (ticketData) => {
//     return async (dispatch) => {
//       dispatch(serviceTicketStart());
//       try {
//         const response = await axios.post(apiConfig.generateServiceTicket, ticketData);
//         // const ticket = response?.data?.tickets; // Extract the ticket data
//         dispatch(serviceTicketSuccess(response?.data?.service_ticket_id));
//         toast.success("Service ticket generated successfully");
//         return response?.data; // Return the full ticket object
//       } catch (error) {
//         console.error("Error generating service ticket:", error);
//         dispatch(serviceTicketFailure(error.message));
//         toast.error(error.response?.data?.message || "Failed to generate service ticket");
//         throw error; // Throw the error so it can be caught in the component
//       }
//     };
//   };
  

// Get all service ticket lists with optional filters
export const getServiceTicketLists = (filters) => {
  return async (dispatch) => {
    dispatch(getServiceTicketListsStart());
    try {
      const params = new URLSearchParams();

      for (const key in filters) {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      }

      const queryString = params.toString();
      const url = queryString ? `${apiConfig.getServiceTicketLists}?${queryString}` : apiConfig.getServiceTicketLists;
      const response = await axios.get(url);
 
      console.log("service ticket response", response)
      dispatch(getServiceTicketListsSuccess(response?.data?.tickets));
    } catch (error) {
      dispatch(getServiceTicketListsFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch service ticket lists");
    }
  };
};

// Delete a service ticket
export const deleteServiceTicket = (serviceTicketId) => {
  return async (dispatch) => {
    dispatch(deleteServiceTicketStart());
    try {
      await axios.delete(`${apiConfig.deleteServiceTicket}/${serviceTicketId}`);
      dispatch(deleteServiceTicketSuccess(serviceTicketId));
      toast.success("Service ticket deleted successfully");
    } catch (error) {
      dispatch(deleteServiceTicketFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to delete service ticket");
    }
  };
};

// Update a service ticket
export const updateServiceTicket = (ticketData,serviceTicketId) => {
  return async (dispatch) => {
    dispatch(updateServiceTicketStart());
    try {
      const response = await axios.post(`${apiConfig.updateServiceTicket}/${serviceTicketId}`, ticketData);
      dispatch(updateServiceTicketSuccess(response.data));
      toast.success("Service ticket updated successfully");
    } catch (error) {
      dispatch(updateServiceTicketFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to update service ticket");
    }
  };
};

// Assign people to a service ticket
export const assignPeopleToServiceTicket = (technicians,navigate,isEditing) => {
  return async (dispatch) => {
    dispatch(assignPeopleToServiceTicketStart());
    try {
      const response = await axios.post(`${apiConfig.assignPeopleToServiceTicket}`, technicians);
      dispatch(assignPeopleToServiceTicketSuccess(response?.data));
      if(isEditing){
        return response?.data;
        } else {
          navigate('/service-tickets');
      }

    } catch (error) {
      console.log(error);
      dispatch(assignPeopleToServiceTicketFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to assign people to service ticket");
    }
  };
};

// Delete an assignee from a service ticket
export const deleteAssignee = (assigneeId) => {
  return async (dispatch) => {
    dispatch(deleteServiceTicketStart());
    try {
      const res = await axios.delete(`${apiConfig.deleteAssigneeFromServiceTicket}/${assigneeId}`);
      dispatch(deleteAssigneeSuccess(assigneeId));
      toast.success("Assignee deleted successfully");
      return res;
    } catch (error) {
      dispatch(deleteServiceTicketFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to delete assignee");
    }
  };
};

// Get service ticket lists by client ID
export const getServiceTicketListsByClientId = (client_id) => {
  return async (dispatch) => {
    dispatch(getServiceTicketListsStart());
    try {
      const url = `${apiConfig.serviceTicketByClient}/${client_id}`;
      const response = await axios.get(url);
      dispatch(getServiceTicketListsSuccess(response.data));
    } catch (error) {
      dispatch(getServiceTicketListsFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch service ticket lists");
    }
  };
};

export const getServiceTicketDetails = (serviceTicketId) => {
  return async (dispatch) => {
    dispatch(getServiceTicketDetailsStart());
    try {
      const url = `${apiConfig.serviceTicketByID}/${serviceTicketId}`;
      const response = await axios.get(url);
      
      dispatch(getServiceTicketDetailsSuccess(response.data?.ticket));
    } catch (error) {
      dispatch(getServiceTicketDetailsFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch service ticket details");
    }
  };
};