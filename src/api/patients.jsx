import api from "./index";

export default {
  getPatients(params) {
    return api.get(`/patients/tickets${params}`);
  },
  getPatientByPhone(phoneNumber) {
    return api.get(`/patients/details/${phoneNumber}`);
  },
  updatePatientProfile(payload) {
    return api.patch(`/patients/tickets`, payload);
  },
  getPatientTicketByPhone(phoneNumber, params) {
    return api.get(`/patients/tickets/${phoneNumber}${params}`);
  },
  getPatientTicketRelatedByNumber(ticketNumber) {
    return api.get(`/tickets/${ticketNumber}/relateds`);
  },
  getPatientHistoryByPhoneNumber(phoneNumber, params) {
    return api.get(`/patients/${phoneNumber}/histories${params}`);
  },
};
