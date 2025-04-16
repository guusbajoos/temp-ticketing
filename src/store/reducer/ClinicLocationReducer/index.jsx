import { GET_CLINIC_LOCATION_STATUS_FAILED, GET_CLINIC_LOCATION_STATUS_LOADING, GET_CLINIC_LOCATION_STATUS_SUCCESS, RESET_CLINIC_LOCATION_STATUS } from "store/type/ClinicLocationType";

const initialState = {
  status: "IDLE",
  data: [],
  meta: {
    currentPage: 1,
    total: 0,
    totalPage: 0
  },
  error: {
    message: "",
    description: "",
  },
};

export const getClinicLocation = (state = initialState, action) => {
  switch (action.type) {
    case GET_CLINIC_LOCATION_STATUS_LOADING:
      return { ...state, status: "LOADING" };
    case GET_CLINIC_LOCATION_STATUS_SUCCESS:
      return {
        ...state,
        status: "SUCCESS",
        data: action.payload,
        meta: {
          currentPage: action.payload?.currentPage,
          total: action.payload?.totalElements,
        },
      };
    case GET_CLINIC_LOCATION_STATUS_FAILED:
      return {
        ...state,
        status: "FAILED",
        error: { ...action.error },
      };
    case RESET_CLINIC_LOCATION_STATUS:
      return {
        ...state,
        status: "IDLE",
        error: { message: "", description: "" },
      };
    default:
      return state;
  }
};