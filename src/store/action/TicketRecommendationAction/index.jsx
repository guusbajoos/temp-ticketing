import ticketRecomendation from "api/ticketRecomendation"
import { GET_TICKET_RECOMMENDATION_STATUS_FAILED, GET_TICKET_RECOMMENDATION_STATUS_LOADING, GET_TICKET_RECOMMENDATION_STATUS_SUCCESS, RESET_TICKET_RECOMMENDATION_STATUS } from "store/type/TicketRecommendationType"
import { queryStringify, removeEmptyAttributes } from "utils/index"

export const getTicketRecommendation = (params) => async (dispatch) => {
  dispatch({
    type: GET_TICKET_RECOMMENDATION_STATUS_LOADING
  })

  try {
    const {data} =  await ticketRecomendation.getTicketRecommendation(
      queryStringify(removeEmptyAttributes(params))
    )
    dispatch({
      type: GET_TICKET_RECOMMENDATION_STATUS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: GET_TICKET_RECOMMENDATION_STATUS_FAILED,
      error: {
        message: "Failed to fetch data",
        description: error.response.data.message,
      },
    })
  }
}


export const resetTicketRecommendationStatus = () => (dispatch) => {
  dispatch({
    type: RESET_TICKET_RECOMMENDATION_STATUS,
  });
};