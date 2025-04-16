/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { PageSpinner } from 'components/PageSpinner';
import { getClinicReport as getClinicReportAction } from 'store/action/ClinicReportAction';
import { useClinicReport } from 'pages/Dashboard/hook';
import api from 'api/index';
import Chart from 'react-google-charts';


export function ClinicLocation({  isLoading, dateFilter }) {
  const [mappedData, setMappedData] = useState([])

  const { getClinicReportList, clinicReport, resetStatus: resetStatusClinicReport } =
    useClinicReport();

  const {getClinicReport} = clinicReport

  useEffect(() => {
    getClinicReportList(dateFilter)
  }, [dateFilter])

  useEffect(() => {
    if (getClinicReport.status === "FAILED") {
      api.error({
        message: getClinicReport.error.message,
        description: getClinicReport.error.description,
        duration: 3,
      });
      resetStatusClinicReport();
    }
  }, [getClinicReport.status]);

  useEffect(() => {
    if(getClinicReport.status === 'SUCCESS'){
      setMappedData(
        getClinicReport.data?.dashboardClinicLocation?.map(item => {
          return [
            item.clinicName, item.openCount, item.inProgressCount, item.escalateCount, item.feedbackCount, item.closedCount, item.followUpCount
          ]
        })
      )
    }
  }, [getClinicReport.status])

  return (
    <div className="mb-40 complaint-rate">
      <div className="fw-bold text-md mb-20">Clinic Location</div>
      <div className="panel panel--secondary">
        <Chart
          width={'100%'}
          height={'600px'}
          chartType="ComboChart"
          loader={
            <PageSpinner className="page-spinner--dashboard-ticket-backlog" />
          }
          data={[['Clinic Name', 'Open', 'On Progress', 'Escalate', 'Feedback', 'Close', 'Followup'], ...mappedData]}
          options={{
            vAxis: { title: 'Total Tickets' },
            hAxis: { title: 'Clinic Location' },
            seriesType: 'bars',
            isStacked: true,
            backgroundColor: '#fafafa',
          }}
          rootProps={{ 'data-ticket': '1' }}
        />

        {/* <div className="complaint-rate">
          <p>Complaint Rate</p>
          {data.percentage.map((item, index) => (
            <div key={index}>
              <div>
                {item.text}: {item.value}%
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}

const mapStateToProps = ({ getClinicReport }) => ({ getClinicReport });

export default connect(mapStateToProps, {  getClinicReportAction })(ClinicLocation)
