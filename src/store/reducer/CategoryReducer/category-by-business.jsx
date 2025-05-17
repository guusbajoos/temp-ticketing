import {
  GET_CATEGORY_BY_BUSINESS_STATUS_LOADING,
  GET_CATEGORY_BY_BUSINESS_STATUS_SUCCESS,
  GET_CATEGORY_BY_BUSINESS_STATUS_FAILED,
  RESET_CATEGORY_BY_BUSINESS_STATUS,
} from "../../type";

const initialState = {
  status: "IDLE",
  data: [],
  error: {
    message: "",
    description: "",
  },
};

export const categoryByBusiness = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORY_BY_BUSINESS_STATUS_LOADING:
      return { ...state, status: "LOADING" };
    case GET_CATEGORY_BY_BUSINESS_STATUS_SUCCESS:
      return {
        ...state,
        status: "SUCCESS",
        data: action.payload,
      };
    case GET_CATEGORY_BY_BUSINESS_STATUS_FAILED:
      return {
        ...state,
        status: "FAILED",
        error: { ...action.error },
      };
    case RESET_CATEGORY_BY_BUSINESS_STATUS:
      return {
        ...state,
        status: "IDLE",
        error: { message: "", description: "" },
      };
    default:
      return state;
  }
};