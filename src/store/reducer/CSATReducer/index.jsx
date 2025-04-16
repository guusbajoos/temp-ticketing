import { GET_CSAT_SUMMARY_LIST, GET_TICKET_CSAT_LIST } from '../../type'

export const csatSummaryList = (state = {}, action) => {
    switch (action.type) {
        case GET_CSAT_SUMMARY_LIST:
            if (action.error) {
                return { data: null, error: action.error }
            } else {
                return { data: action.payload, error: null }
            }
        default:
            return state
    }
}

export const ticketCsatList = (state = {}, action) => {
    switch (action.type) {
        case GET_TICKET_CSAT_LIST:
            return action.payload
        default:
            return state
    }
}
