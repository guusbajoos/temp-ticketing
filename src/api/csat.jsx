import api from './index'

export default {
    getAllSummaryCSAT(param) {
        return api.get(`/tickets/all-summary-satisfactions${param ? param : ''}`)
    },
    getAllTicketCSAT(param) {
        return api.get(`/tickets/all-ticket-satisfactions${param ? param : ''}`)
    },
}
