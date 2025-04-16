import {
  GET_PATIENT_STATUS_LOADING,
  GET_PATIENT_STATUS_SUCCESS,
  GET_PATIENT_STATUS_FAILED,
  READ_PATIENT_STATUS_LOADING,
  READ_PATIENT_STATUS_SUCCESS,
  READ_PATIENT_STATUS_FAILED,
  GET_PATIENT_TICKET_STATUS_LOADING,
  GET_PATIENT_TICKET_STATUS_SUCCESS,
  GET_PATIENT_TICKET_STATUS_FAILED,
  GET_PATIENT_TICKET_RELATED_LOADING,
  GET_PATIENT_TICKET_RELATED_SUCCESS,
  GET_PATIENT_TICKET_RELATED_FAILED,
  PATCH_PATIENT_STATUS_LOADING,
  PATCH_PATIENT_STATUS_SUCCESS,
  PATCH_PATIENT_STATUS_FAILED,
  RESET_PATIENT_STATUS,
  GET_PATIENT_HISTORY_LOADING,
  GET_PATIENT_HISTORY_SUCCESS,
  GET_PATIENT_HISTORY_FAILED,
} from "../../type/PatientsType";

const initialState = {
  status: "IDLE",
  data: [],
  detail: {},
  tickets: [],
  ticketRelateds: [],
  histories: [],
  meta: {
    currentPage: 1,
    total: 0,
  },
  error: {
    message: "",
    description: "",
  },
};

export const getPatients = (state = initialState, action) => {
  switch (action.type) {
    case GET_PATIENT_STATUS_LOADING:
      return { ...state, status: "LOADING" };
    case GET_PATIENT_STATUS_SUCCESS:
      return {
        ...state,
        status: "SUCCESS",
        data: action.payload.currentElements,
        meta: {
          currentPage: action.payload?.currentPage,
          total: action.payload?.totalElements,
        },
      };
    case GET_PATIENT_STATUS_FAILED:
      return {
        ...state,
        status: "FAILED",
        error: { ...action.error },
      };
    case RESET_PATIENT_STATUS:
      return {
        ...state,
        status: "IDLE",
        error: { message: "", description: "" },
      };
    default:
      return state;
  }
};

export const getPatientByPhone = (state = initialState, action) => {
  switch (action.type) {
    case READ_PATIENT_STATUS_LOADING:
      return { ...state, status: "LOADING" };
    case READ_PATIENT_STATUS_SUCCESS:
      return {
        ...state,
        status: "SUCCESS",
        detail: { ...action.payload.data },
      };
    case READ_PATIENT_STATUS_FAILED:
      return {
        ...state,
        status: "FAILED",
        error: { ...action.error },
      };
    case RESET_PATIENT_STATUS:
      return {
        ...state,
        status: "IDLE",
        error: { message: "", description: "" },
      };
    default:
      return state;
  }
};

export const getPatientTicketRelated = (state = initialState, action) => {
  switch (action.type) {
    case GET_PATIENT_TICKET_RELATED_LOADING:
      return { ...state, status: "LOADING" };
    case GET_PATIENT_TICKET_RELATED_SUCCESS:
      return {
        ...state,
        status: "SUCCESS",
        ticketRelateds: action.payload.data,
      };
    case GET_PATIENT_TICKET_RELATED_FAILED:
      return {
        ...state,
        status: "FAILED",
        error: { ...action.error },
      };
    case RESET_PATIENT_STATUS:
      return {
        ...state,
        status: "IDLE",
        error: { message: "", description: "" },
      };
    default:
      return state;
  }
};

export const getPatientTickets = (state = initialState, action) => {
  switch (action.type) {
    case GET_PATIENT_TICKET_STATUS_LOADING:
      return { ...state, status: "LOADING" };
    case GET_PATIENT_TICKET_STATUS_SUCCESS:
      return {
        ...state,
        status: "SUCCESS",
        tickets: action.payload.currentElements,
        meta: {
          currentPage: action.payload?.currentPage,
          total: action.payload?.totalElements,
        },
      };
    case GET_PATIENT_TICKET_STATUS_FAILED:
      return {
        ...state,
        status: "FAILED",
        error: { ...action.error },
      };
    case RESET_PATIENT_STATUS:
      return {
        ...state,
        status: "IDLE",
        error: { message: "", description: "" },
      };
    default:
      return state;
  }
};

export const getPatientHistoryByPhoneNumber = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case GET_PATIENT_HISTORY_LOADING:
      return { ...state, status: "LOADING" };
    case GET_PATIENT_HISTORY_SUCCESS:
      return {
        ...state,
        status: "SUCCESS",
        histories: action.payload.currentElements,
        meta: {
          currentPage: action.payload?.currentPage,
          total: action.payload?.totalElements,
        },
      };
    case GET_PATIENT_HISTORY_FAILED:
      return {
        ...state,
        status: "FAILED",
        error: { ...action.error },
      };
    case RESET_PATIENT_STATUS:
      return {
        ...state,
        status: "IDLE",
        error: { message: "", description: "" },
      };
    default:
      return state;
  }
};

export const updatePatientProfile = (state = initialState, action) => {
  switch (action.type) {
    case PATCH_PATIENT_STATUS_LOADING:
      return { ...state, status: "LOADING" };
    case PATCH_PATIENT_STATUS_SUCCESS:
      return { ...state, status: "SUCCESS" };
    case PATCH_PATIENT_STATUS_FAILED:
      return { ...state, status: "FAILED", error: { ...action.error } };
    case RESET_PATIENT_STATUS:
      return {
        ...state,
        status: "IDLE",
        error: { message: "", description: "" },
      };
    default:
      return state;
  }
};
