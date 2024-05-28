import { combineReducers } from "@reduxjs/toolkit"

import serviceReducer from "../slices/serviceSlice"
import authReducer from "../slices/authSlice"
import cartReducer from "../slices/cartSlice"
import profileReducer from "../slices/profileSlice"
import categoryReducer from "../slices/categorySlice"
const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  cart: cartReducer,
  category: categoryReducer,
  service: serviceReducer,
})

export default rootReducer
