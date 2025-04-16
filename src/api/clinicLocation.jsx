import api from "."

export default {
  getClinicLocationList(param){
    return api.get(`/clinic${param ? param : ""}`)
  }
}