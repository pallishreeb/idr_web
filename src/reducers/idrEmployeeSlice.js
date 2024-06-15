  import { createSlice } from "@reduxjs/toolkit";

  const initialState = {
    loading: false,
    idrEmployees: [],
    idrEmployeeDetails: {},
    error: null,
  };
  
  const idrEmployeeSlice = createSlice({
    name: "idrEmployees",
    initialState,
    reducers: {
      fetchIDREmployeesRequest: (state) => {
        state.loading = true;
        state.error = null;
      },
      fetchIDREmployeesSuccess: (state, action) => {
        state.loading = false;
        state.error = null;
        state.idrEmployees = action.payload;
      },
      fetchIDREmployeesFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
      deleteEmployeeRequest: (state) => {
        state.loading = true;
        state.error = null;
      },
      deleteEmployeeSuccess: (state, action) => {
        state.loading = false;
        state.error = null;
        state.idrEmployees = state.idrEmployees.filter(employee => employee.idr_emp_id !== action.payload);
      },
      deleteEmployeeFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
      fetchIDREmployeeDetailsRequest: (state) => {
        state.loading = true;
        state.error = null;
      },
      fetchIDREmployeeDetailsSuccess: (state, action) => {
        state.loading = false;
        state.idrEmployeeDetails = action.payload;
      },
      fetchIDREmployeeDetailsFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
      updateIDREmployeeRequest: (state) => {
        state.loading = true;
        state.error = null;
      },
      updateIDREmployeeSuccess: (state, action) => {
        state.loading = false;
        const updatedEmployee = action.payload;
        const index = state.idrEmployees.findIndex(employee => employee.idr_emp_id === updatedEmployee.idr_emp_id);
        if (index !== -1) {
          state.idrEmployees[index] = updatedEmployee;
        }
      },
      updateIDREmployeeFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },

    },
  });
  
  export const {
    fetchIDREmployeesRequest,
    fetchIDREmployeesSuccess,
    fetchIDREmployeesFailure,
    deleteEmployeeRequest,
    deleteEmployeeSuccess,
    deleteEmployeeFailure,
    fetchIDREmployeeDetailsRequest,
    fetchIDREmployeeDetailsSuccess,
    fetchIDREmployeeDetailsFailure,
    updateIDREmployeeRequest,
    updateIDREmployeeSuccess,
    updateIDREmployeeFailure,
  } = idrEmployeeSlice.actions;
  
  export default idrEmployeeSlice.reducer;
  
  