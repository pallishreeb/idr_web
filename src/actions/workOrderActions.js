// src/actions/workOrderActions.js

import axios from '../axios-config';
import { toast } from "react-toastify";
import {
  generateTicketStart, generateTicketSuccess, generateTicketFailure,
  addTechnicianToTicketStart, addTechnicianToTicketSuccess, addTechnicianToTicketFailure,
  addNotesToTicketStart, addNotesToTicketSuccess, addNotesToTicketFailure,
  getWorkOrderListsStart, getWorkOrderListsSuccess, getWorkOrderListsFailure,
  deleteWorkOrderStart, deleteWorkOrderSuccess, deleteWorkOrderFailure,
  updateTicketStart, updateTicketSuccess, updateTicketFailure,
  updateTechnicianStart, updateTechnicianSuccess, updateTechnicianFailure,
  updateNotesStart, updateNotesSuccess, updateNotesFailure,
  getTechniciansByWorkOrderStart, getTechniciansByWorkOrderSuccess, getTechniciansByWorkOrderFailure,
  getNotesByWorkOrderStart, getNotesByWorkOrderSuccess, getNotesByWorkOrderFailure,
  getWorkOrderByClientIdStart, getWorkOrderByClientIdSuccess, getWorkOrderByClientIdFailure,
  getWorkOrderDetailsStart,getWorkOrderDetailsSuccess,getWorkOrderDetailsFailure,
  assignPeopleToWorkOrderStart,assignPeopleToWorkOrderSuccess,assignPeopleToWorkOrderFailure,
  deleteAssigneeSuccess, deleteNoteSuccess
} from "../reducers/workOrderSlice";
import { apiConfig } from "../config";

export const generateTicket = (ticketData) => {
  return async (dispatch) => {
    dispatch(generateTicketStart());
    try {
      const response = await axios.post(apiConfig.generateTicket, ticketData);
      dispatch(generateTicketSuccess(response.data.work_order_id));
      toast.success("Ticket generated successfully");
      return response?.data;
    } catch (error) {
      console.log(error)
      dispatch(generateTicketFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to generate ticket");
    }
  };
};

export const addTechnicianToTicket = (technicianData) => {
  return async (dispatch) => {
    dispatch(addTechnicianToTicketStart());
    try {
      const response = await axios.post(`${apiConfig.addTechnicianToTicket}`, technicianData);
      dispatch(addTechnicianToTicketSuccess(response?.data));
      toast.success("Technician added to ticket successfully");
      return response?.data
    } catch (error) {
      console.log(error)
      dispatch(addTechnicianToTicketFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to add technician to ticket");
    }
  };
};

export const addNotesToTicket = ( notesData) => {
  return async (dispatch) => {
    dispatch(addNotesToTicketStart());
    try {
      const response = await axios.post(`${apiConfig.addNotesToTicket}`, notesData);
      // console.log("res",response)
      if(response?.data){
        dispatch(addNotesToTicketSuccess(response?.data));
        toast.success("Notes added to ticket successfully");
        return response?.data
      }else{
        dispatch(addNotesToTicketFailure(response?.data?.message));
         toast.error("Failed to add notes to ticket");
      }
   
    } catch (error) {
      console.log("err",error)
      dispatch(addNotesToTicketFailure(error?.message));
      toast.error(error?.message || error?.response?.data?.message || "Failed to add notes to ticket");
    }
  };
};

export const getWorkOrderLists = (filters) => {
  return async (dispatch) => {
    dispatch(getWorkOrderListsStart());
    try {
      const params = new URLSearchParams();

      for (const key in filters) {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      }

      const queryString = params.toString();
      const url = queryString ? `${apiConfig.getWorkOrderLists}?${queryString}` : apiConfig.getWorkOrderLists;
      const response = await axios.get(url);
      
      dispatch(getWorkOrderListsSuccess(response.data));
    } catch (error) {
      dispatch(getWorkOrderListsFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch work order lists");
    }
  };
};
export const deleteWorkOrder = (workOrderId) => {
  return async (dispatch) => {
    dispatch(deleteWorkOrderStart());
    try {
      await axios.delete(`${apiConfig.deleteWorkOrder}/${workOrderId}`);
      dispatch(deleteWorkOrderSuccess(workOrderId));
      toast.success("Work order deleted successfully");
    } catch (error) {
      dispatch(deleteWorkOrderFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to delete work order");
    }
  };
};

export const updateTicket = ( ticketData) => {
  return async (dispatch) => {
    dispatch(updateTicketStart());
    try {
      const response = await axios.post(`${apiConfig.updateTicket}`, ticketData);
      dispatch(updateTicketSuccess(response.data));
      toast.success("Ticket updated successfully");
    } catch (error) {
      dispatch(updateTicketFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to update ticket");
    }
  };
};

export const updateTechnician = (technicianData) => {
  return async (dispatch) => {
    dispatch(updateTechnicianStart());
    try {
      const response = await axios.post(`${apiConfig.updateTechnician}`, technicianData);
      dispatch(updateTechnicianSuccess(response.data));
      toast.success("Technician updated successfully");
    } catch (error) {
      dispatch(updateTechnicianFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to update technician");
    }
  };
};

export const updateNotes = (notesData) => {
  return async (dispatch) => {
    dispatch(updateNotesStart());
    try {
      const response = await axios.post(`${apiConfig.updateNotes}`, notesData);
      dispatch(updateNotesSuccess(response.data));
      toast.success("Notes updated successfully");
    } catch (error) {
      dispatch(updateNotesFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to update notes");
    }
  };
};

export const getTechniciansByWorkOrder = (workOrderId) => {
  return async (dispatch) => {
    dispatch(getTechniciansByWorkOrderStart());
    try {
      const response = await axios.get(`${apiConfig.getTechniciansByWorkOrder}/${workOrderId}`);
      dispatch(getTechniciansByWorkOrderSuccess(response.data));
    } catch (error) {
      dispatch(getTechniciansByWorkOrderFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch technicians by work order");
    }
  };
};

export const getNotesByWorkOrder = (workOrderId) => {
  return async (dispatch) => {
    dispatch(getNotesByWorkOrderStart());
    try {
      const response = await axios.get(`${apiConfig.getNotesByWorkOrder}/${workOrderId}`);
      dispatch(getNotesByWorkOrderSuccess(response.data));
    } catch (error) {
      dispatch(getNotesByWorkOrderFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch notes by work order");
    }
  };
};

export const getWorkOrderByClientId = (clientId) => {
  return async (dispatch) => {
    dispatch(getWorkOrderByClientIdStart());
    try {
      const response = await axios.get(`${apiConfig.getWorkOrderByClientId}/${clientId}`);
      dispatch(getWorkOrderByClientIdSuccess(response.data));
    } catch (error) {
      dispatch(getWorkOrderByClientIdFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch work order by client ID");
    }
  };
};

export const getWorkOrderDetails = (workOrderId) => {
  return async (dispatch) => {
    dispatch(getWorkOrderDetailsStart());
    try {
      const url = `${apiConfig.workOrderbyId}/${workOrderId}`;
      const response = await axios.get(url);
      
      dispatch(getWorkOrderDetailsSuccess(response.data?.workOrder));
    } catch (error) {
      dispatch(getWorkOrderDetailsFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch work order details");
    }
  };
};

export const assignPeopleToWorkOrder = (technicians) => {
  return async (dispatch) => {
    dispatch(assignPeopleToWorkOrderStart());
    try {
      const response = await axios.post(`${apiConfig.assignPeople}`, technicians);
      dispatch(assignPeopleToWorkOrderSuccess(response?.data));
      // toast.success("People assigned to work order successfully");
      return response?.data;
    } catch (error) {
      console.log(error);
      dispatch(assignPeopleToWorkOrderFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to assign people to work order");
    }
  };
};


export const deleteAssignee = (assigneeId) => {
  return async (dispatch) => {
    dispatch(deleteWorkOrderStart());
    try {
      await axios.delete(`${apiConfig.deleteAssignee}/${assigneeId}`);
      dispatch(deleteAssigneeSuccess(assigneeId));
      toast.success("Assignee deleted successfully");
    } catch (error) {
      dispatch(deleteWorkOrderFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to delete Assignee");
    }
  };
};

export const deleteNote = (noteId) => {
  return async (dispatch) => {
    dispatch(deleteWorkOrderStart());
    try {
      await axios.delete(`${apiConfig.deleteNote}/${noteId}`);
      dispatch(deleteNoteSuccess(noteId));
      toast.success("Comment deleted successfully");
    } catch (error) {
      dispatch(deleteWorkOrderFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to delete Comment");
    }
  };
};