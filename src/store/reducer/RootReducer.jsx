import { combineReducers } from "redux";

import { userList, userById } from "./UserReducer";
import { roleList, roleById } from "./RoleReducer";
import { isSidebarClose } from "./component-reducer/ToggleSidebarReducer";
import { teamList, teamById } from "./TeamReducer";
import {
  ticketByNumber,
  ticketList,
  ticketHistoryList,
  ticketCommentList,
  ticketRecentClosed,
  ticketListSearchInActive,
  summaryUnassignedTickets,
  patientDetailList,
} from "./TicketReducer";
import { dashboardReport, dashboardReportByType } from "./ReportReducer";
import { categoryList, categoryBusiness } from "./CategoryReducer";
import { csatSummaryList, ticketCsatList } from "./CSATReducer";
import {
  getPatients,
  getPatientByPhone,
  getPatientTickets,
  updatePatientProfile,
  getPatientTicketRelated,
  getPatientHistoryByPhoneNumber,
} from "./PatientsReducer";
import { getTicketCategories } from "./TicketCategoriesReducer";
import { getBusiness } from "./BusinessReducer";
import { getClinicLocation } from "./ClinicLocationReducer";
import { getTicketRecommendation } from "./TicketRecomendationReducer";
import { getClinicReport } from "./ClinicReportReducer";
import { categoryByBusiness } from "./CategoryReducer/category-by-business";

const rootReducer = combineReducers({
  userList,
  userById,
  roleList,
  roleById,
  ticketList,
  ticketByNumber,
  ticketHistoryList,
  ticketCommentList,
  ticketRecentClosed,
  ticketListSearchInActive,
  summaryUnassignedTickets,
  patientDetailList,
  teamList,
  teamById,
  isSidebarClose,
  dashboardReport,
  dashboardReportByType,
  categoryList,
  categoryBusiness,
  csatSummaryList,
  ticketCsatList,
  getPatients,
  getPatientByPhone,
  getPatientTickets,
  updatePatientProfile,
  getPatientTicketRelated,
  getPatientHistoryByPhoneNumber,
  getTicketCategories,
  getBusiness,
  getClinicLocation,
  getTicketRecommendation,
  getClinicReport,
  categoryByBusiness
});

export default rootReducer;
