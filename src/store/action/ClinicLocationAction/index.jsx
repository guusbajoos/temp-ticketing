import clinicLocation from "api/clinicLocation"
import { GET_CLINIC_LOCATION_STATUS_FAILED, GET_CLINIC_LOCATION_STATUS_LOADING, GET_CLINIC_LOCATION_STATUS_SUCCESS, RESET_CLINIC_LOCATION_STATUS } from "store/type/ClinicLocationType"
import { queryStringify, removeEmptyAttributes } from "utils/index"

export const getClinicLocation = (params) => async (dispatch) => {
  dispatch({
    type: GET_CLINIC_LOCATION_STATUS_LOADING
  })

  try {
    const {data} =  await clinicLocation.getClinicLocationList(
      queryStringify(removeEmptyAttributes(params))
    )
    dispatch({
      type: GET_CLINIC_LOCATION_STATUS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: GET_CLINIC_LOCATION_STATUS_FAILED,
      error: {
        message: "Failed to fetch data",
        description: error.response.data.message,
      },
    })
  }
}


export const resetClinicLocationStatus = () => (dispatch) => {
  dispatch({
    type: RESET_CLINIC_LOCATION_STATUS,
  });
};