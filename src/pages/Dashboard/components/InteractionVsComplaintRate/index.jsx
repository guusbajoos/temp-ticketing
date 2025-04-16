/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Chart from 'react-google-charts';


import { connect } from 'react-redux';

import { getReportDashboard } from 'store/action/ReportAction';
import { PageSpinner } from 'components/PageSpinner';

import './styles/index.scss';

export function InteractionVsComplaintRate({ data }) {


  return (
    <div className="mb-40 complaint-rate">
      <div className="fw-bold text-md mb-20">Complaint Rate</div>
      <div className="panel panel--secondary">
        <Chart
          width={'100%'}
          height={'600px'}
          chartType="ComboChart"
          loader={
            <PageSpinner className="page-spinner--dashboard-ticket-backlog" />
          }
          data={[['Week', 'Informasi', 'Keluhan'], ...data.data]}
          options={{
            vAxis: { title: 'Total Tickets' },
            hAxis: { title: 'Date' },
            seriesType: 'bars',
            isStacked: true,
            backgroundColor: '#fafafa',
          }}
          rootProps={{ 'data-complaint': '1' }}
        />

        <div className="complaint-rate">
          <p>Complaint Rate</p>
          {data.percentage.map((item, index) => (
            <div key={index}>
              <div>
                {item.text}: {item.value}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({ dashboardReport }) => ({ dashboardReport });

export default connect(mapStateToProps, { getReportDashboard })(InteractionVsComplaintRate)
