import ticketCategoriesApi from "api/ticket-categories";
import { GET_TICKET_CATEGORIES_STATUS_FAILED, GET_TICKET_CATEGORIES_STATUS_LOADING, GET_TICKET_CATEGORIES_STATUS_SUCCESS, RESET_TICKET_CATEGORIES_STATUS } from "store/type/TicketCategoriesType";
import { queryStringify, removeEmptyAttributes } from "utils/index";
export const getTicketCategories = (params) => async (dispatch) => {
  dispatch({
    type: GET_TICKET_CATEGORIES_STATUS_LOADING
  })

  try {
    const {data} =  await ticketCategoriesApi.getTicketCategories(
      queryStringify(removeEmptyAttributes(params))
    )
    dispatch({
      type: GET_TICKET_CATEGORIES_STATUS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: GET_TICKET_CATEGORIES_STATUS_FAILED,
      error: {
        message: "Failed to fetch data",
        description: error.response.data.message,
      },
    })
  }
}


export const resetTicketCategoriesStatus = () => (dispatch) => {
  dispatch({
    type: RESET_TICKET_CATEGORIES_STATUS,
  });
};