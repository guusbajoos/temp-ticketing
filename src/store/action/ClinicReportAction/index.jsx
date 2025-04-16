import clinicReport from "api/clinicReport"
import { GET_CLINIC_REPORT_STATUS_FAILED, GET_CLINIC_REPORT_STATUS_LOADING, GET_CLINIC_REPORT_STATUS_SUCCESS, RESET_CLINIC_REPORT_STATUS } from "store/type/ClinicReportType"
import { queryStringify, removeEmptyAttributes } from "utils/index"

export const getClinicReport = (params) => async (dispatch) => {
  dispatch({
    type: GET_CLINIC_REPORT_STATUS_LOADING
  })

  try {
    const {data} =  await clinicReport.getClinicReport(
      queryStringify(removeEmptyAttributes(params))
    )
    dispatch({
      type: GET_CLINIC_REPORT_STATUS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: GET_CLINIC_REPORT_STATUS_FAILED,
      error: {
        message: "Failed to fetch data",
        description: error.response.data.message,
      },
    })
  }
}


export const resetClinicReportStatus = () => (dispatch) => {
  dispatch({
    type: RESET_CLINIC_REPORT_STATUS,
  });
};