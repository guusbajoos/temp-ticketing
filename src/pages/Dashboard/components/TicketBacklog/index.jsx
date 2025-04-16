/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Column } from '@ant-design/charts';
import { isEmpty } from 'lodash';


import { connect } from 'react-redux';

import { getReportDashboard } from 'store/action/ReportAction';
import { PageSpinner } from 'components/PageSpinner';

export function TicketBacklog({ dashboardReport, isLoading }) {
  let config = {
    data: !isEmpty(dashboardReport.ticketBacklog)
      ? dashboardReport.ticketBacklog
      : [],
    isGroup: true,
    xField: 'date',
    yField: 'value',
    seriesField: 'name',
    appendPadding: [40, 10, 33, 10],
    legend: { position: 'bottom-left' },
  };

  return (
    <div className="mb-40 ticket-backlog">
      <div className="fw-bold text-md mb-20">Ticket Backlog</div>
      <div className="panel panel--secondary">
        {isLoading ? (
          <PageSpinner className="page-spinner--dashboard-ticket-backlog" />
        ) : (
          <Column {...config} />
        )}
      </div>
    </div>
  );
}

const mapStateToProps = ({ dashboardReport }) => ({ dashboardReport });

export default connect(mapStateToProps, { getReportDashboard })(TicketBacklog)
