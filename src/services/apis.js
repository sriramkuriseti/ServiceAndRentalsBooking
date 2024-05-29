
const BASE_URL = process.env.REACT_APP_BASE_URL

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/resetPasswordToken",
  RESETPASSWORD_API: BASE_URL + "/auth/resetPassword",
}

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
}



// CATAGORIES API
export const categories = {
  FETCH_CATEGORIES_API: BASE_URL + "/category/getAllCategories",
  CREATE_CATEGORY:BASE_URL+"/category/createCategory",
  EDIT_CATEGORY: BASE_URL+"/category/editCategory/:id",
  GET_CATEGORY_DETAILS: BASE_URL+"/category/getCategoryDetails/:id",
}



// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
}

//PRODUCT PROVIDER SIDE END POINTS
export const providerProduct={
  CREATE_PRODUCT:BASE_URL+"/product/createProduct",
  UPDATE_PRODUCT:BASE_URL+"/product/updateProduct/:id",
  DELETE_PRODUCT:BASE_URL+"/product/deleteProduct/:id",
  UPDATE_PRODUCT_PROGRESS:BASE_URL+"/product/updateProductProgress/:productID",
  GET_ALL_PRODUCTS: BASE_URL+"/product/getAllProducts",
  GET_PRODUCT_DETAILS : BASE_URL+"/product/getProductDetails/:id",
}

//PRODUCT CUSTOMER SIDE ENDPOINTS
export const userProduct = {
  BOOK_PRODUCT: BASE_URL + "/bookProduct/:productId",
  CANCEL_PRODUCT: BASE_URL + "/CancelProduct/:productId",
  RETURN_PRODUCT: BASE_URL + "/ReturnProduct/:productId",
  GET_PRODUCT_PROGRESS: BASE_URL + "/getProductProgress/:productID",
  GET_ALL_BOUGHT_PRODUCTS: BASE_URL + "/getAllBoughtProducts",
  GET_USERS_OF_PRODUCT: BASE_URL + "/getUsersOfProduct/:productId",
}; 

//RENT PRODUCT PROVIDER SIDE ENDPOINTS
export const  providerRent = {
  CREATE_RENT_PRODUCT: BASE_URL + "/createRentProduct",
  UPDATE_RENT_PRODUCT: BASE_URL + "/updateRentProduct/:id",
  GET_ALL_RENT_ITEMS: BASE_URL + "/getAllRentItems",
  GET_RENT_ITEM_DETAILS: BASE_URL + "/getRentItemDetails/:id",
  DELETE_RENT_ITEM: BASE_URL + "/deleteRentItem/:id",
  UPDATE_RENT_PROGRESS: BASE_URL + "/updateRentProgress/:id",
}

//RENT SLOTS
export const RentSlots = {
  CREATE_RENT_SLOTS: BASE_URL + "/createRentSlots",
  UPDATE_RENT_SLOTS: BASE_URL + "/updateRentSlots/:slotId",
  DELETE_RENT_SLOTS: BASE_URL + "/deleteRentSlots/:slotId",
  GET_SLOTS_OF_RENT_ITEM: BASE_URL + "/getSlotsOfRentItem/:rentId",
}

//RENT USER SIDE ENDPOINTS
export const userRents = {
  BOOK_RENT_ITEM: BASE_URL + "/service/bookRentItem",
  CANCEL_RENT_ITEM: BASE_URL + "/service/cancelRentItem",
  RETURN_RENT_ITEM: BASE_URL + "/service/returnRentItem",
  GET_RENT_ITEM_PROGRESS: BASE_URL + "/service/getRentItemProgress",
  GET_BOOKED_RENTED_ITEMS: BASE_URL + "/service/getBookedRentedItems",
  GET_ALL_USERS_OF_RENT_ITEM: BASE_URL + "/service/getAllUsersOfRentItem/:rentId",
}

//PROVIDER SIDE SERVICE ENDPOINTS
export const providerService = {
  CREATE_SERVICE: BASE_URL + "/service/createService",
  UPDATE_SERVICE: BASE_URL + "/service/updateService/:id",
  GET_PROVIDER_SERVICES : BASE_URL + "/service/getProviderServices",
  GET_ALL_USERS_OF_SERVICE: BASE_URL + "/service/getAllUsersOfService/:serviceId",
  DELETE_SERVICE: BASE_URL + "/service/deleteService/:id",
  UPDATE_SERVICE_PROGRESS: BASE_URL + "/service/updateServiceProgress/:id",
}

// SERVICE SLOTS
export const ServiceSlots = {
  CREATE_SERVICE_SLOTS: BASE_URL + "/service/createServiceSlots",
  UPDATE_SERVICE_SLOTS: BASE_URL + "/service/updateServiceSlots/:id",
  DELETE_SERVICE_SLOTS: BASE_URL + "/service/deleteServiceSlots/:id",
  GET_SLOTS_OF_SERVICE: BASE_URL + "/service/getSlotsOfService/:id",
}

//USER SIDE SERVICE ENDPOINTS
export const userService = {
  BOOK_SERVICE: BASE_URL + "/service/bookService",
  CANCEL_SERVICE: BASE_URL + "/service/cancelService",
  CHECK_SERVICE_STATUS: BASE_URL + "/service/checkServiceStatus",
  GET_ALL_BOOKED_SERVICES: BASE_URL + "/service/getAllBookedServices",
  GET_ALL_SERVICES: BASE_URL + "/service/GetAllServices",
  GET_SERVICE_DETAILS: BASE_URL + "/service/getAllServiceDetails/:id",
 
}