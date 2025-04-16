import { GET_REPORT_DASHBOARD, GET_REPORT_DASHBOARD_BY_TYPE } from '../../type';

export const dashboardReport = (state = {}, action) => {
  switch (action.type) {
    case GET_REPORT_DASHBOARD:
      return action.payload;
    default:
      return state;
  }
};

export const dashboardReportByType = (state = {}, action) => {
  switch (action.type) {
    case GET_REPORT_DASHBOARD_BY_TYPE:
      return action.payload;
    default:
      return state;
  }
};
