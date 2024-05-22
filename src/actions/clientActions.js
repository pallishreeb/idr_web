// src/actions/clientActions.js

import axios from '../axios-config';
import { toast } from "react-toastify";
import { createClientStart, createClientSuccess, createClientFailure, getClientsStart, getClientsSuccess, getClientsFailure, getClientByIdStart, getClientByIdSuccess, getClientByIdFailure, deleteClientStart, deleteClientSuccess, deleteClientFailure, getIndustriesStart, getIndustriesSuccess, getIndustriesFailure, updateClientStart, updateClientSuccess, updateClientFailure } from "../reducers/clientSlice";
import {  apiConfig } from "../config";

// axios.defaults.baseURL = API_BASE_URL;
// axios.defaults.headers.common["Content-Type"] = "application/json";
// axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem('user_idr_token')}`;

export const addClient = (clientData,navigate) => {
  return async (dispatch) => {
    dispatch(createClientStart());
    try {
      const response = await axios.post(apiConfig.addClient, clientData);
      dispatch(createClientSuccess(response.data));
      toast.success("Client added successfully");
      navigate('/clients')
    } catch (error) {
      dispatch(createClientFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to add client");
    }
  };
};

// export const getClients = () => {
//   return async (dispatch) => {
//     dispatch(getClientsStart());
//     try {
//       const response = await axios.get(apiConfig.getClients);
//       dispatch(getClientsSuccess(response.data));
//     } catch (error) {
//       dispatch(getClientsFailure(error.message));
//       toast.error(error.response?.data?.message || "Failed to fetch clients");
//     }
//   };
// };
export const getClients = ({ clientName, industryId } = {}) => {
  return async (dispatch) => {
    dispatch(getClientsStart());
    try {
      let url = apiConfig.getClients;
      const params = new URLSearchParams();

      if (clientName) {
        params.append('client_name', clientName);
      }
      if (industryId) {
        params.append('industry_id', industryId);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      dispatch(getClientsSuccess(response.data));
    } catch (error) {
      dispatch(getClientsFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch clients");
    }
  };
};
export const getClientById = (clientId) => {
  return async (dispatch) => {
    dispatch(getClientByIdStart());
    try {
      const response = await axios.get(`${apiConfig.getClientById}/${clientId}`);
      dispatch(getClientByIdSuccess(response.data.client));
    } catch (error) {
      dispatch(getClientByIdFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch client by ID");
    }
  };
};

export const deleteClient = (clientId) => {
  return async (dispatch) => {
    dispatch(deleteClientStart());
    try {
     await axios.delete(`${apiConfig.deleteClient}/${clientId}`).then((res)=>{
      dispatch(deleteClientSuccess(clientId));
      toast.success("Client deleted successfully");
     });
     
    } catch (error) {
      dispatch(deleteClientFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to delete client");
    }
  };
};

export const getIndustries = () => {
  return async (dispatch) => {
    dispatch(getIndustriesStart());
    try {
      const response = await axios.get(apiConfig.getIndustries);
      dispatch(getIndustriesSuccess(response.data));
    } catch (error) {
      dispatch(getIndustriesFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch industries");
    }
  };
};

export const updateClient = (clientId, clientData,navigate) => {
  return async (dispatch) => {
    dispatch(updateClientStart());
    try {
      const response = await axios.patch(`${apiConfig.updateClient}`, clientData);
      dispatch(updateClientSuccess(response.data));
      toast.success("Client updated successfully");
      navigate(`/clients`);
    } catch (error) {
      dispatch(updateClientFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to update client");
    }
  };
};

