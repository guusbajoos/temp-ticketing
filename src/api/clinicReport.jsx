import api from "."

export default {
  getClinicReport(param){
    return api.get(`/reports/dashboard/clinic-location${param ? param : ""}`)
  }
}