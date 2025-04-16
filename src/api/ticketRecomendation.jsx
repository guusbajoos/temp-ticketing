import api from "."

export default {
  getTicketRecommendation(param){
    return api.get(`/tickets/search-history-ticket${param ? param : ""}`)
  }
}