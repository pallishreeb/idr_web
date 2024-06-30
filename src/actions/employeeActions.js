import axios from '../axios-config';
import { toast } from "react-toastify";
import { fetchIDREmployeesFailure,fetchIDREmployeesRequest,fetchIDREmployeesSuccess,deleteEmployeeFailure,deleteEmployeeRequest,deleteEmployeeSuccess, fetchIDREmployeeDetailsRequest,
  fetchIDREmployeeDetailsSuccess,
  fetchIDREmployeeDetailsFailure,
  updateIDREmployeeRequest,
  updateIDREmployeeSuccess,
  updateIDREmployeeFailure,createIdrEmployeetStart,createIdrEmployeeSuccess,createIdrEmployeeFailure} from "../reducers/idrEmployeeSlice";
import {  apiConfig } from "../config";


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
        await axios.delete(`${apiConfig.deleteIdrEmp}/${employeeId}`).then((res)=>{
         dispatch(deleteEmployeeSuccess(employeeId));
         toast.success("IDR Employee deleted successfully");
        });
        
       } catch (error) {
         dispatch(deleteEmployeeFailure(error.message));
         toast.error(error.response?.data?.message || "Failed to delete idr employee");
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
    const response = await axios.post(`${apiConfig.updateIdrEmp}`, employeeData);
    dispatch(updateIDREmployeeSuccess(response.data));
    toast.success('Employee updated successfully');
  } catch (error) {
    console.log(error)
    dispatch(updateIDREmployeeFailure(error.message));
    toast.error(error.response?.data?.message || 'Failed to update employee');
  }
};
export const createIDREmployee = (idrEmployeeData,navigate) => {
    return async (dispatch) => {
      dispatch(createIdrEmployeetStart());
      try {
        const response = await axios.post(apiConfig.addIdrEmployee, idrEmployeeData);
        dispatch(createIdrEmployeeSuccess(response?.data));
        // console.log(response.data)
        toast.success("Idr Employee added successfully");
        navigate('/idr-employees')
      } catch (error) {
        console.log(error,"error")
        dispatch(createIdrEmployeeFailure(error.message));
        toast.error(error.response?.data?.message || "Failed to add IdrEmployee");
      }
    };
  };


  