/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Column } from '@ant-design/charts';

import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import { getReportDashboard } from 'store/action/ReportAction';
import { PageSpinner } from 'components/PageSpinner';

import './styles/index.scss';

export function ComplaintRate({ dashboardReport, isLoading }) {
  const concatComplaintWithType = !isEmpty(dashboardReport.complaintRate)
    ? dashboardReport.complaintRate.map((value) => ({
        ...value,
        type: 'Complaint Rate',
      }))
    : [];

  let config = {
    data: !isEmpty(concatComplaintWithType) ? concatComplaintWithType : [],
    xField: 'date',
    yField: 'complaintRate',
    seriesField: 'type',
    height: 750,
    color: '#FF7A7A',
    appendPadding: [40, 10, 33, 10],
    legend: { position: 'bottom-left' },
    columnWidthRatio: 0.8,
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.type,
          value: datum.complaintRate + '%',
        };
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  return (
    <div className="mb-40 complaint-rate">
      <div className="fw-bold text-md mb-20">Complaint Rate</div>
      <div className="panel panel--secondary">
        {isLoading ? (
          <PageSpinner className="page-spinner--dashboard-team-capacity" />
        ) : (
          <Column {...config} />
        )}
      </div>
    </div>
  );
}

const mapStateToProps = ({ dashboardReport }) => ({ dashboardReport });

export default connect(mapStateToProps, { getReportDashboard })(ComplaintRate)
