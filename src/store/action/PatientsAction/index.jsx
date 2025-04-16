import patientApi from "api/patients";
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
} from "store/type/PatientsType";
import { queryStringify, removeEmptyAttributes } from "utils/index";

export const getPatients = (params) => async (dispatch) => {
  dispatch({
    type: GET_PATIENT_STATUS_LOADING,
  });

  try {
    const { data } = await patientApi.getPatients(
      queryStringify(removeEmptyAttributes(params))
    );
    dispatch({
      type: GET_PATIENT_STATUS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_PATIENT_STATUS_FAILED,
      error: {
        message: "Failed to fetch data",
        description: error.response.data.message,
      },
    });
  }
};

export const getPatientByPhone = (phoneNumber) => async (dispatch) => {
  dispatch({
    type: READ_PATIENT_STATUS_LOADING,
  });

  try {
    const { data } = await patientApi.getPatientByPhone(phoneNumber);
    dispatch({
      type: READ_PATIENT_STATUS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: READ_PATIENT_STATUS_FAILED,
      error: {
        message: "Failed to fetch data",
        description: error.response.data.message,
      },
    });
  }
};

export const getPatientTicketByPhone =
  (phoneNumber, params) => async (dispatch) => {
    dispatch({
      type: GET_PATIENT_TICKET_STATUS_LOADING,
    });

    try {
      const { data } = await patientApi.getPatientTicketByPhone(
        phoneNumber,
        queryStringify(removeEmptyAttributes(params))
      );
      dispatch({
        type: GET_PATIENT_TICKET_STATUS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_PATIENT_TICKET_STATUS_FAILED,
        error: {
          message: "Failed to fetch data",
          description: error.response.data.message,
        },
      });
    }
  };

export const getPatientTicketRelatedByNumber =
  (ticketNumber) => async (dispatch) => {
    dispatch({
      type: GET_PATIENT_TICKET_RELATED_LOADING,
    });

    try {
      const { data } =
        await patientApi.getPatientTicketRelatedByNumber(ticketNumber);
      dispatch({
        type: GET_PATIENT_TICKET_RELATED_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_PATIENT_TICKET_RELATED_FAILED,
        error: {
          message: "Failed to fetch data",
          description: error.response.data.message,
        },
      });
    }
  };

export const getPatientHistoryByPhoneNumber =
  (phoneNumber, params) => async (dispatch) => {
    dispatch({
      type: GET_PATIENT_HISTORY_LOADING,
    });

    try {
      const { data } = await patientApi.getPatientHistoryByPhoneNumber(
        phoneNumber,
        queryStringify(removeEmptyAttributes(params))
      );
      dispatch({
        type: GET_PATIENT_HISTORY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_PATIENT_HISTORY_FAILED,
        error: {
          message: "Failed to fetch data",
          description: error.response.data.message,
        },
      });
    }
  };

export const updatePatientProfile = (payload) => async (dispatch) => {
  dispatch({
    type: PATCH_PATIENT_STATUS_LOADING,
  });

  try {
    await patientApi.updatePatientProfile(payload);
    dispatch({
      type: PATCH_PATIENT_STATUS_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: PATCH_PATIENT_STATUS_FAILED,
      error: {
        message: "Failed to fetch data",
        description: error.response.data.message,
      },
    });
  }
};

export const resetPatientStatus = () => (dispatch) => {
  dispatch({
    type: RESET_PATIENT_STATUS,
  });
};
