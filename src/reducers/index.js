// reducers.js
import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import clientReducer from './clientSlice';
import clientEmployeeReducer from './clientEmployeeSlice';
import idrEmployeeReducer from './idrEmployeeSlice';
import locationReducer from './locationSlice';

const rootReducer = combineReducers({
  user: userReducer,
  client: clientReducer,
  clientEmployee:clientEmployeeReducer,
  location:locationReducer,
  employee:idrEmployeeReducer,
});

export default rootReducer;
