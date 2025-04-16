import businessApi from 'api/business'
import { GET_BUSINESS_STATUS_FAILED, GET_BUSINESS_STATUS_LOADING, GET_BUSINESS_STATUS_SUCCESS, RESET_BUSINESS_STATUS } from 'store/type/BusinessType'
import { queryStringify, removeEmptyAttributes } from 'utils/index'

export const getBusiness = (params) => async (dispatch) => {
  dispatch({
    type: GET_BUSINESS_STATUS_LOADING
  })

  try {
    const {data} =  await businessApi.getBusinessList(
      queryStringify(removeEmptyAttributes(params))
    )
    dispatch({
      type: GET_BUSINESS_STATUS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: GET_BUSINESS_STATUS_FAILED,
      error: {
        message: "Failed to fetch data",
        description: error.response.data.message,
      },
    })
  }
}


export const resetBusinessStatus = () => (dispatch) => {
  dispatch({
    type: RESET_BUSINESS_STATUS,
  });
};