import axios from '../axios-config';
import { toast } from "react-toastify";
import { fetchIDREmployeesFailure,fetchIDREmployeesRequest,fetchIDREmployeesSuccess,deleteEmployeeFailure,deleteEmployeeRequest,deleteEmployeeSuccess, fetchIDREmployeeDetailsRequest,
  fetchIDREmployeeDetailsSuccess,
  fetchIDREmployeeDetailsFailure,
  updateIDREmployeeRequest,
  updateIDREmployeeSuccess,
  updateIDREmployeeFailure,createIdrEmployeetStart,createIdrEmployeeSuccess,createIdrEmployeeFailure} from "../reducers/idrEmployeeSlice";
import {  apiConfig } from "../config";
import { fetchJson } from "../fetch-config";


export const fetchIDREmployees = () => async dispatch => {
  dispatch(fetchIDREmployeesRequest());
  try {
    const response = await axios.get(apiConfig.getIdrEmployees);
    dispatch(fetchIDREmployeesSuccess(response?.data?.employees));
  } catch (error) {
    dispatch(fetchIDREmployeesFailure(error.message));
    toast.error(error.response?.data?.message || "Failed to fetch idr employees");
  }
};

export const deleteEmployee = (employeeId) => async dispatch => {
    dispatch(deleteEmployeeRequest());
    try {
      
      const data = await fetchJson(`${apiConfig.deleteIdrEmp}/${employeeId}`, {
        method: "DELETE",
      });
         dispatch(deleteEmployeeSuccess(employeeId));
        toast.success("IDR Employee deleted successfully")
       } catch (error) {
         dispatch(deleteEmployeeFailure(error.message));
         toast.error(error?.message || "Failed to delete idr employee");
       }
};

export const fetchIDREmployeeDetails = (employeeId) => async (dispatch) => {
  dispatch(fetchIDREmployeeDetailsRequest());
  try {
    const response = await axios.get(`${apiConfig.getIdrEmpById}/${employeeId}`);
    dispatch(fetchIDREmployeeDetailsSuccess(response.data.employee));
  } catch (error) {
    dispatch(fetchIDREmployeeDetailsFailure(error.message));
    toast.error(error.response?.data?.message || 'Failed to fetch employee details');
  }
};

export const updateIDREmployee = (employeeData) => async (dispatch) => {
  dispatch(updateIDREmployeeRequest());
  try {
    const data = await fetchJson(apiConfig.updateIdrEmp, {
      method: "POST",
      body: employeeData,
    });
    dispatch(updateIDREmployeeSuccess(data));
    toast.success('Employee updated successfully');
  } catch (error) {
    console.log(error)
    dispatch(updateIDREmployeeFailure(error.message));
    toast.error(error?.message || 'Failed to update employee');
  }
};
export const createIDREmployee = (idrEmployeeData,navigate) => {
    return async (dispatch) => {
      dispatch(createIdrEmployeetStart());
      try {
              const data = await fetchJson(apiConfig.addIdrEmployee, {
                method: "POST",
                body: idrEmployeeData,
              });
        
              dispatch(createIdrEmployeeSuccess(data));
        // console.log(data)
        toast.success("Idr Employee added successfully");
        navigate('/idr-employees')
      } catch (error) {
        console.log(error.message,"error")
        dispatch(createIdrEmployeeFailure(error?.message));
        toast.error(error?.message || "Failed to add IdrEmployee");
      }
    };
  };


  