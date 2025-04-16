import CsatApi from 'api/csat'

import { GET_CSAT_SUMMARY_LIST, GET_TICKET_CSAT_LIST } from '../../type'


export const getAllCsatSummary = (param) => async (dispatch) => {
    try {
        const { data } = await CsatApi.getAllSummaryCSAT(param)
        dispatch({
            type: GET_CSAT_SUMMARY_LIST,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: GET_CSAT_SUMMARY_LIST,
            error: error
        })
    }
}

export const getAllTicketCSAT = (param) => async (dispatch) => {
    try {
        const { data } = await CsatApi.getAllTicketCSAT(param)
        dispatch({
            type: GET_TICKET_CSAT_LIST,
            payload: data,
        })
        return data
    } catch (error) {
        dispatch({
            type: GET_TICKET_CSAT_LIST,
            error: error,
        })
    }
}
