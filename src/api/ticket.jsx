import api from "./index";

/**
 * Create request object for UpdateTicket
 * @param {string} ticketNumber
 * @param {int} teamId
 * @param {int} agentId
 * @param {string} status
 * @param {string} title
 * @param {string} description
 * @param {string} source
 * @param {string} urgency
 * @param {int} categoryId
 * @param {int} subCategory1Id
 * @param {int} subCategory2Id
 * @param {string} incomingAt
 * @param {string} dueAt
 * @param {string} patientId
 * @param {string} patientName
 * @param {string} patientPhone
 * @param {string} soNumber
 * @param {string} medicalRecord
 * @param {string} description
 * @constructor
 */
export function UpdateTicketRequest(
  ticketNumber,
  teamId,
  agentId,
  status,
  title,
  description,
  source,
  urgency,
  categoryId,
  subCategory1Id,
  subCategory2Id,
  incomingAt,
  dueAt,
  patientId,
  patientName,
  patientPhone,
  soNumber,
  medicalRecord
) {
  this.number = ticketNumber;
  this.title = title;
  this.description = description ? description : "";
  this.team = { id: teamId };
  this.agent = { id: agentId || null };
  this.status = status;
  this.source = source;
  this.urgency = urgency;
  this.category = { id: categoryId };
  this.subCategory1 = { id: subCategory1Id };
  this.subCategory2 = { id: subCategory2Id };
  this.incomingAt = incomingAt;
  this.dueAt = dueAt;
  this.patientId = patientId;
  this.patientName = patientName;
  this.patientPhone = patientPhone;
  this.soNumber = soNumber;
  this.medicalRecord = medicalRecord ? medicalRecord : "";
}

export default {
  getTicketList(param) {
    return api.get(`/tickets${param ? param : ""}`);
  },

  getTicketListV2(param) {
    return api.get(`/tickets/all-tickets/v2${param ? param : ""}`);
  },

  getTicketListV3(param) {
    return api.get(`/tickets/all-tickets/v3${param ? param : ""}`);
  },

  downloadCommentLog(param) {
    return api.get(`/reports/report/comment-log${param ? param : ""}`);
  },

  downloadSla(param) {
    return api.get(`/reports/report/sla${param ? param : ""}`);
  },

  downloadSolutionTicket(param) {
    return api.get(`/reports/report/ticket-solution${param ? param : ""}`);
  },

  downloadCustomerInteraction(param) {
    return api.get(`/reports/report/customer-interaction${param ? param : ""}`);
  },

  getTicketByNumber(ticketNumber) {
    return api.get(`/tickets/${ticketNumber}`);
  },

  deleteTicketList(ticketNumber) {
    return api.delete(`/tickets?number=${ticketNumber}`);
  },

  deleteTicketByNumber(ticketNumber) {
    return api.delete(`/tickets/${ticketNumber}`);
  },

  getTicketHistoryList(ticketNumber, page, size) {
    return api.get(
      `/tickets/${ticketNumber}/histories?page=${page}&size=${size}`
    );
  },

  getTicketCommentList(ticketNumber, page, size) {
    return api.get(
      `/tickets/${ticketNumber}/comments?page=${page}&size=${size}`
    );
  },

  addCommentTicket(ticketNumber, message, createdAt, user) {
    return api.post(`/tickets/${ticketNumber}/comments`, {
      message,
      createdAt,
      user: {
        id: user,
      },
    });
  },

  updateCommentTicket(ticketNumber, commentId, payload) {
    return api.put(`/tickets/${ticketNumber}/comments/${commentId}`, payload);
  },

  deleteCommentTicket(ticketNumber, commentId) {
    return api.delete(`/tickets/${ticketNumber}/comments/${commentId}`);
  },

  updateTicket(
    ticketNumber,
    // team,
    // agent,
    status,
    title,
    infobipChatId,
    description,
    source,
    urgency,
    category,
    subCategory1,
    subCategory2,
    incomingAt,
    dueAt,
    patientId,
    patientName,
    patientPhone,
    soNumber,
    medicalRecord,
    ticketSolution,
    patientSatisfactionNote,
    patientSatisfactionStatus,
    ra,
    rb,
    businessUnit,
    clinicName,
    idClinic
  ) {
    return api.put(`/tickets/${ticketNumber}`, {
      number: ticketNumber,
      title: title,
      infobipChatId: infobipChatId,
      description: description,
      //   team: {
      //     id: team,
      //   },
      //   agent: { id: agent || null },
      status: status,
      source: source,
      urgency: urgency,
      category: { id: category },
      subCategory1: { id: subCategory1 },
      subCategory2: { id: subCategory2 },
      incomingAt: incomingAt,
      dueAt: dueAt,
      patientId: patientId,
      patientName: patientName,
      patientPhone: patientPhone,
      soNumber: soNumber,
      medicalRecord: medicalRecord,
      ticketSolution,
      patientSatisfactionNote,
      patientSatisfactionStatus,
      ra,
      rb,
      businessUnit: businessUnit,
      clinicName: clinicName,
      idClinic: idClinic
    });
  },

  updateTicketDetails(ticketNumber, team, agent, status) {
    return api.post(`/tickets/${ticketNumber}/details`, {
      number: ticketNumber,
      team: {
        id: team,
      },
      agent: { id: agent || null },
      status: status,
    });
  },

  updateTicketSolutionDetails(ticketNumber, payload) {
    return api.patch(`/tickets/${ticketNumber}/solutions`, payload);
  },

  /**
   *
   * @param {array UpdateTicketRequest} updateTicketRequests
   * @returns {*}
   */
  updateTickets(updateTicketRequests) {
    return api.put(`/tickets`, updateTicketRequests);
  },

  addTicket(
    title,
    infobipChatId,
    description,
    team,
    agent,
    status,
    source,
    urgency,
    category,
    subCategory1,
    subCategory2,
    incomingAt,
    dueAt,
    patientId,
    patientName,
    patientPhone,
    soNumber,
    medicalRecord,
    ra,
    rb,
    businessUnit,
    clinicName,
    idClinic
  ) {
    return api.post(`/tickets`, {
      title: title,
      description: description,
      infobipChatId: infobipChatId,
      team: {
        id: team,
      },
      agent: { id: agent || null },
      status: status,
      source: source,
      urgency: urgency,
      category: { id: category },
      subCategory1: { id: subCategory1 },
      subCategory2: { id: subCategory2 },
      incomingAt: incomingAt,
      dueAt: dueAt,
      patientId: patientId,
      patientName: patientName,
      patientPhone: patientPhone,
      soNumber: soNumber,
      medicalRecord: medicalRecord,
      ra,
      rb,
      businessUnit: businessUnit,
      clinicName: clinicName,
      idClinic: idClinic
    });
  },

  updateStatusTicket(ticketNumber, status) {
    return api.post(`/tickets/${ticketNumber}/status`, { status });
  },

  createTicketSolution(payload, ticketNumber) {
    return api.post(`/tickets/${ticketNumber}/solutions`, payload);
  },

  updateTicketSolution(payload, ticketNumber) {
    return api.put(`/tickets/${ticketNumber}/solutions`, payload);
  },

  deleteTicketSolution(ticketNumber, id) {
    return api.delete(`/tickets/${ticketNumber}/solutions/${id}`);
  },

  getOrderType() {
    return api.get(`/tickets/orders`);
  },

  getStatusProductions() {
    return api.get(`/tickets/status-productions`);
  },

  createCSAT(payload, ticketNumber) {
    return api.post(`/tickets/${ticketNumber}/satisfactions`, payload);
  },

  updateCSAT(payload, ticketNumber) {
    return api.put(`/tickets/${ticketNumber}/satisfactions`, payload);
  },

  getProblemTypes() {
    return api.get(`/tickets/problems`);
  },
  getRecentClosedTickets(size) {
    return api.get(`/tickets/recent-closed?size=${size}`);
  },
  getSearchInActiveTickets(params) {
    return api.get(`/tickets/search-inactive-tickets${params}`);
  },
  getUnassignedTickets(params) {
    return api.get(`/tickets/all-unassigned-tickets/v2${params ? params : ""}`);
  },
  getSummaryUnassignedTickets(agentId) {
    return api.get(`/tickets/all-summary-tickets?agent=${agentId}`);
  },
  getPatientDetailList(page, phoneNumber) {
    return api.get(`/patients/finds/${phoneNumber}?page=${page}`);
  },
};
