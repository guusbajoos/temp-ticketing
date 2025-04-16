import api from ".";

export default {
  getTicketCategories(params){
    return api.get(`/categories/all${params}`);
  },

  addCategory(payload) {
    return api.post(
      `/categories/create`, payload
    )
  }
}