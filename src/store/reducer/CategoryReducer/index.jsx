import {
  GET_CATEGORY_BUSINESS_STATUS_LOADING,
  GET_CATEGORY_BUSINESS_STATUS_SUCCESS,
  GET_CATEGORY_BUSINESS_STATUS_FAILED,
  GET_CATEGORY_LIST,
  RESET_CATEGORY_BUSINESS_STATUS,
} from "../../type";

const initialState = {
  status: "IDLE",
  data: [],
  error: {
    message: "",
    description: "",
  },
};

export const categoryList = (state = {}, action) => {
  switch (action.type) {
    case GET_CATEGORY_LIST:
      return action.payload;
    default:
      return state;
  }
};

export const categoryBusiness = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORY_BUSINESS_STATUS_LOADING:
      return { ...state, status: "LOADING" };
    case GET_CATEGORY_BUSINESS_STATUS_SUCCESS:
      return {
        ...state,
        status: "SUCCESS",
        data: action.payload,
      };
    case GET_CATEGORY_BUSINESS_STATUS_FAILED:
      return {
        ...state,
        status: "FAILED",
        error: { ...action.error },
      };
    case RESET_CATEGORY_BUSINESS_STATUS:
      return {
        ...state,
        status: "IDLE",
        error: { message: "", description: "" },
      };
    default:
      return state;
  }
};
