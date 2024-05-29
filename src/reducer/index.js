import { combineReducers } from "@reduxjs/toolkit"

import authReducer from "../slices/authSlice"
import cartReducer from "../slices/cartSlice"
import profileReducer from "../slices/profileSlice"
import categoryReducer from "../slices/categorySlice"
import productreducer from "../slices/productSlice"
import rentReducer from "../slices/rentSlice"
import serviceReducer from "../slices/serviceSlice"


const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  cart: cartReducer,
  category: categoryReducer,
  product: productreducer,
  rent:rentReducer,
  service: serviceReducer,
})

export default rootReducer
