import api from "."

export default {
  getBusinessList(param){
    return api.get(`/business${param ? param : ""}`)
  }
}