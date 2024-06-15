  import { createSlice } from "@reduxjs/toolkit";

  const initialState = {
    loading: false,
    idrEmployees: [],
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
    },
  });
  
  export const {
    fetchIDREmployeesRequest,
    fetchIDREmployeesSuccess,
    fetchIDREmployeesFailure,
    deleteEmployeeRequest,
    deleteEmployeeSuccess,
    deleteEmployeeFailure,
  } = idrEmployeeSlice.actions;
  
  export default idrEmployeeSlice.reducer;
  
  