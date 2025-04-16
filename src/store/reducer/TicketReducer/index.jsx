import {
    GET_TICKET_BY_NUMBER,
    GET_TICKET_LIST,
    GET_TICKET_HISTORY_LIST,
    GET_TICKET_COMMENT_LIST,
    GET_TICKET_RECENT_CLOSED,
    GET_TICKET_SEARCH_INACTIVE,
    GET_TICKET_SUMMARY_UNASSIGNED,
    GET_PATIENT_DETAILS_LIST
} from '../../type'

export const ticketList = (state = {}, action) => {
    switch (action.type) {
        case GET_TICKET_LIST:
            return action.payload
        default:
            return state
    }
}

export const ticketByNumber = (state = {}, action) => {
    switch (action.type) {
        case GET_TICKET_BY_NUMBER:
            return action.payload
        default:
            return state
    }
}

export const ticketCommentList = (state = {}, action) => {
    switch (action.type) {
        case GET_TICKET_COMMENT_LIST:
            return action.payload
        default:
            return state
    }
}

export const ticketHistoryList = (state = {}, action) => {
    switch (action.type) {
        case GET_TICKET_HISTORY_LIST:
            return action.payload
        default:
            return state
    }
}

export const ticketRecentClosed = (state = {}, action) => {
    switch (action.type) {
        case GET_TICKET_RECENT_CLOSED:
            return action.payload
        default:
            return state
    }
}
export const ticketListSearchInActive = (state = {}, action) => {
    switch (action.type) {
        case GET_TICKET_SEARCH_INACTIVE:
            return action.payload
        default:
            return state
    }
}
export const summaryUnassignedTickets = (state = {}, action) => {
    switch (action.type) {
        case GET_TICKET_SUMMARY_UNASSIGNED:
            return action.payload
        default:
            return state
    }
}

export const patientDetailList = (state = {}, action) => {
    switch (action.type) {
        case GET_PATIENT_DETAILS_LIST:
            return action.payload
        default:
            return state
    }
}
