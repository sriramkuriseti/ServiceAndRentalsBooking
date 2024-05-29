import { toast } from "react-hot-toast";

import { apiConnector } from "../apiConnector";
import { providerProduct } from "../apis";

const { CREATE_PRODUCT, UPDATE_PRODUCT , GET_PRODUCT_DETAILS } = providerProduct;

export const createProduct = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", CREATE_PRODUCT, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE PRODUCT API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Add Product Details");
    }
    toast.success("Product Details Added Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("CREATE PRODUCT API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const updateProduct = async (data, id, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("PUT", UPDATE_PRODUCT.replace(":id", id), data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("UPDATE PRODUCT API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Update Product Details");
    }
    toast.success("Product Details Updated Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("UPDATE PRODUCT API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const getProductDetails = async (id, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("GET", GET_PRODUCT_DETAILS.replace(":id", id), null, {
      Authorization: `Bearer ${token}`,
    });
    console.log("GET PRODUCT DETAILS API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Retrieve Product Details");
    }
    toast.success("Product Details Retrieved Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("GET PRODUCT DETAILS API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};