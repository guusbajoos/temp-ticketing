import TicketApi from 'api/ticket'

import {
    GET_TICKET_BY_NUMBER,
    GET_TICKET_LIST,
    GET_TICKET_HISTORY_LIST,
    GET_TICKET_COMMENT_LIST,
    GET_TICKET_RECENT_CLOSED,
    GET_TICKET_SEARCH_INACTIVE,
    GET_TICKET_SUMMARY_UNASSIGNED,
    GET_PATIENT_DETAILS_LIST,
} from '../../type'

export const getTicketList = (param) => async (dispatch) => {
    const { data } = await TicketApi.getTicketList(param)

    dispatch({
        type: GET_TICKET_LIST,
        payload: data,
    })
}

export const getTicketListV2 = (param) => async (dispatch) => {
    const { data } = await TicketApi.getTicketListV2(param)

    dispatch({
        type: GET_TICKET_LIST,
        payload: data,
    })
}

export const getTicketByNumber = (number) => async (dispatch) => {
    const { data } = await TicketApi.getTicketByNumber(number)

    dispatch({
        type: GET_TICKET_BY_NUMBER,
        payload: data,
    })
}

export const getTicketCommentList =
    (number, page, size) => async (dispatch) => {
        const { data } = await TicketApi.getTicketCommentList(number, page, size)

        dispatch({
            type: GET_TICKET_COMMENT_LIST,
            payload: data,
        })
    }

export const getTicketHistoryList =
    (number, page, size) => async (dispatch) => {
        const { data } = await TicketApi.getTicketHistoryList(number, page, size)

        dispatch({
            type: GET_TICKET_HISTORY_LIST,
            payload: data,
        })
    }

export const getRecentClosedTickets = (size) => async (dispatch) => {
    const { data } = await TicketApi.getRecentClosedTickets(size)

    dispatch({
        type: GET_TICKET_RECENT_CLOSED,
        payload: data,
    })
}
export const getSearchInActiveTickets = (params) => async (dispatch) => {
    const { data } = await TicketApi.getSearchInActiveTickets(params)

    dispatch({
        type: GET_TICKET_SEARCH_INACTIVE,
        payload: data,
    })
}

export const getSummaryUnassignedTickets = (params) => async (dispatch) => {
    const { data } = await TicketApi.getSummaryUnassignedTickets(params)
    dispatch({
        type: GET_TICKET_SUMMARY_UNASSIGNED,
        payload: data,
    })
}

export const getPatientDetailList = (page, phoneNumber) => async (dispatch) => {
    const { data } = await TicketApi.getPatientDetailList(page, phoneNumber)
    dispatch({
        type: GET_PATIENT_DETAILS_LIST,
        payload: data
    })
}
