import ReportApi from 'api/report';

import { GET_REPORT_DASHBOARD, GET_REPORT_DASHBOARD_BY_TYPE } from '../../type';

export const getReportDashboard = (param) => async (dispatch) => {
  const { data } = await ReportApi.getReportDashboard(param);

  dispatch({
    type: GET_REPORT_DASHBOARD,
    payload: {
      ticketBacklog: data.ticketBacklog || [],
      tickets: data.tickets || {},
      complaintRate: data.complaintRate || [],
      topCategory: data.topCategory || [],
      topSubCategory1: data.topSubCategory1 || [],
      topSubCategory2: data.topSubCategory2 || [],
      ticketCapacities: data.ticketCapacities || [],
      businessUnit: data.businessUnit ||[],
    },
  });
};

export const getReportDashboardByType = (type, param) => async (dispatch) => {
  const { data } = await ReportApi.getReportDashboardByType(type, param);

  dispatch({
    type: GET_REPORT_DASHBOARD_BY_TYPE,
    payload: data,
  });
};
