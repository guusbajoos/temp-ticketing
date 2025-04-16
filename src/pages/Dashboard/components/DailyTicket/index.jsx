/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Chart from 'react-google-charts';

import { PageSpinner } from 'components/PageSpinner';

export function DailyTicket({ data }) {
  return (
    <div className="mb-40 ticket-backlog">
      <div className="fw-bold text-md mb-20">Daily Tickets</div>
      <div className="panel panel--secondary">
        <Chart
          width={'100%'}
          height={'600px'}
          chartType="ComboChart"
          loader={
            <PageSpinner className="page-spinner--dashboard-ticket-backlog" />
          }
          data={[['Month', 'Informasi', 'Keluhan', 'Total'], ...data]}
          options={{
            vAxis: { title: 'Total Tickets' },
            hAxis: { title: 'Date' },
            seriesType: 'bars',
            isStacked: true,
            series: { 2: { type: 'line' } },
            backgroundColor: '#fafafa',
          }}
          rootProps={{ 'data-testid': '1' }}
        />
      </div>
    </div>
  );
}

export default DailyTicket;
