import { GET_TICKET_RECOMMENDATION_STATUS_FAILED, GET_TICKET_RECOMMENDATION_STATUS_LOADING, GET_TICKET_RECOMMENDATION_STATUS_SUCCESS, RESET_TICKET_RECOMMENDATION_STATUS } from "store/type/TicketRecommendationType";

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

export const getTicketRecommendation = (state = initialState, action) => {
  switch (action.type) {
    case GET_TICKET_RECOMMENDATION_STATUS_LOADING:
      return { ...state, status: "LOADING" };
    case GET_TICKET_RECOMMENDATION_STATUS_SUCCESS:
      return {
        ...state,
        status: "SUCCESS",
        data: action.payload,
        meta: {
          currentPage: action.payload?.currentPage,
          total: action.payload?.totalElements,
        },
      };
    case GET_TICKET_RECOMMENDATION_STATUS_FAILED:
      return {
        ...state,
        status: "FAILED",
        error: { ...action.error },
      };
    case RESET_TICKET_RECOMMENDATION_STATUS:
      return {
        ...state,
        status: "IDLE",
        error: { message: "", description: "" },
      };
    default:
      return state;
  }
};