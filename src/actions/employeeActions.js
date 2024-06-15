import axios from '../axios-config';
import { toast } from "react-toastify";
import { fetchIDREmployeesFailure,fetchIDREmployeesRequest,fetchIDREmployeesSuccess,deleteEmployeeFailure,deleteEmployeeRequest,deleteEmployeeSuccess} from "../reducers/idrEmployeeSlice";
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

// export const addIdrEmployee = (idrEmployeeData,navigate) => {
//     return async (dispatch) => {
//       dispatch(createIdrEmployeetStart());
//       try {
//         const response = await axios.post(apiConfig.addIdrEmployee, idrEmployeeData);
//         dispatch(createIdrEmployeeSuccess(response.data));
//         toast.success("Idr Employee added successfully");
//         navigate('/idr-employees')
//       } catch (error) {
//         dispatch(createIdrEmployeeFailure(error.message));
//         toast.error(error.response?.data?.message || "Failed to add IdrEmployee");
//       }
//     };
//   };

// export const updateIdrEmployee = (idrEmployeeId,idrEmployeeData,navigate) => {
//     return async (dispatch) => {
//       dispatch(updateIdrEmployeeStart());
//       try {
//         const response = await axios.patch(`${apiConfig.updateClient}`, idrEmployeeData);
//         dispatch(updateIdrEmployeeSuccess(response.data));
//         toast.success("Idr Employee updated successfully");
//         navigate('/idr-employees');
//       } catch (error) {
//         dispatch(updateIdrEmployeeFailure(error.message));
//         toast.error(error.response?.data?.message || "Failed to update Idr Employee");
//       }
//     };
//   };
  