import { toast } from "react-hot-toast";

import { apiConnector } from "../apiConnector";
import { providerRent } from "../apis";

const { GET_RENT_ITEM_DETAILS } = providerRent;

export const getRentDetails = async (id, token) => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("GET", GET_RENT_ITEM_DETAILS.replace(":id", id), null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("GET RENT DETAILS API RESPONSE............", response);
      if (!response?.data?.success) {
        throw new Error("Could Not Retrieve Rent Details");
      }
      toast.success("Rent Details Retrieved Successfully");
      result = response?.data?.data;
    } catch (error) {
      console.log("GET RENT DETAILS API ERROR............", error);
      toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result;
  };