// src/actions/clientEmployeeActions.js

import axios from "axios";
import {
  addClientEmployeeStart,
  addClientEmployeeSuccess,
  addClientEmployeeFailure,
  deleteClientEmployeeStart,
  deleteClientEmployeeSuccess,
  deleteClientEmployeeFailure,
  getClientEmployeeByIdStart,
  getClientEmployeeByIdSuccess,
  getClientEmployeeByIdFailure,
  getEmployeeByIdStart,
  getEmployeeByIdSuccess,
  getEmployeeByIdFailure,
  updateClientEmployeeStart,
  updateClientEmployeeSuccess,
  updateClientEmployeeFailure

} from "../reducers/clientEmployeeSlice";
import { API_BASE_URL, apiConfig } from "../config";
import { toast } from "react-toastify";

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const addClientEmployee = (employeeData,navigate) => {
  return async (dispatch) => {
    dispatch(addClientEmployeeStart());
    try {
      const response = await axios.post(apiConfig.addClientEmployee, employeeData);
      dispatch(addClientEmployeeSuccess(response.data));
      toast.success("Employee added successfully!");
      navigate('/client-employees')
    } catch (error) {
      dispatch(addClientEmployeeFailure(error.message));
      // console.log(error)
      toast.error(error.response.data.message || "Error adding employee");
    }
  };
};

export const deleteClientEmployee = (employeeId) => {
  return async (dispatch) => {
    dispatch(deleteClientEmployeeStart());
    try {
       await axios.delete(`${apiConfig.deleteClientEmployee}/${employeeId}`);
      dispatch(deleteClientEmployeeSuccess(employeeId));
      toast.success("Employee deleted successfully!");
    } catch (error) {
      dispatch(deleteClientEmployeeFailure(error.message));
      toast.error(error?.response?.data?.message || "Error deleting employee");
    }
  };
};

export const getClientEmployeeByClientId = (clientId) => {
  return async (dispatch) => {
    dispatch(getClientEmployeeByIdStart());
    try {
      const response = await axios.get(`${apiConfig.getClientEmployeeById}/${clientId}`);
      // console.log(response)
      dispatch(getClientEmployeeByIdSuccess(response.data.employees));
    } catch (error) {
      dispatch(getClientEmployeeByIdFailure(error.message));
      toast.error("Error fetching employee details");
    }
  };
};

export const getEmployeeById = (employeeId) => {
  return async (dispatch) => {
    dispatch(getEmployeeByIdStart());
    try {
      const response = await axios.post(`${apiConfig.client_emp_by_id}`, {client_emp_id: employeeId});
      dispatch(getEmployeeByIdSuccess(response.data.emp));
    } catch (error) {
      dispatch(getEmployeeByIdFailure(error.message));
      toast.error("Failed to fetch employee by ID");
    }
  };
};

export const updateClientEmployee = (employeeId, updatedEmployeeData,navigate) => {
  return async (dispatch) => {
    dispatch(updateClientEmployeeStart());
    try {
      // Make the API call to update the client employee data
      const response = await axios.patch(`${apiConfig.updateClientEmp}/${employeeId}`, updatedEmployeeData);
      // Dispatch success action if the update was successful
      dispatch(updateClientEmployeeSuccess(response.data));
      // Optionally, you can dispatch any additional actions or perform other logic here
      toast.success("Client employee updated successfully");
      navigate('/client-employees')
    } catch (error) {
      // Dispatch failure action if there was an error
      dispatch(updateClientEmployeeFailure(error.message));
      toast.error("Failed to update client employee");
    }
  };
};