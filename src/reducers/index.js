// reducers.js
import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import clientReducer from './clientSlice';
import clientEmployeeReducer from './clientEmployeeSlice';
import locationReducer from './locationSlice';

const rootReducer = combineReducers({
  user: userReducer,
  client: clientReducer,
  clientEmployee:clientEmployeeReducer,
  location:locationReducer,
});

export default rootReducer;
