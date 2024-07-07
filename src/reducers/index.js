// reducers.js
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import clientReducer from "./clientSlice";
import clientEmployeeReducer from "./clientEmployeeSlice";
import idrEmployeeReducer from "./idrEmployeeSlice";
import locationReducer from "./locationSlice";
import workOrderSlice from "./workOrderSlice";
import locationsInventorySlice from "./locationInventorySlice";

const rootReducer = combineReducers({
  user: userReducer,
  client: clientReducer,
  clientEmployee: clientEmployeeReducer,
  location: locationReducer,
  employee: idrEmployeeReducer,
  workOrder: workOrderSlice,
  locationInventory: locationsInventorySlice,
});

export default rootReducer;
