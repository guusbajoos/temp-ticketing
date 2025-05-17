import api from "./index";

export default {
  getCategoryList(param) {
    return api.get(`/categories${param ? param : ""}`);
  },
  getCategoryBusiness(param) {
    return api.get(`/business${param ? param : ""}`);
  },
  getCategoryByBusiness(param) {
    return api.get(`/categories${param || ""}&level=0`);
  },
};
