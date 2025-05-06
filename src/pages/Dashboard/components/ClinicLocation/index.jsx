/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Bar } from "@ant-design/charts";

import { connect } from "react-redux";
// import { PageSpinner } from "components/PageSpinner";
import { getClinicReport as getClinicReportAction } from "store/action/ClinicReportAction";
import { useClinicReport } from "pages/Dashboard/hook";
import api from "api/index";
import _ from "lodash";
import { PageSpinner } from "components/PageSpinner";
import {Tooltip} from "antd";
import {InfoCircleOutlined} from "@ant-design/icons";

const colorMap = {
  Open: "#F96D63",
  "In Progress": "#F9C463",
  Escalate: "#F9C463",
  Feedback: "#E7F963",
  "Follow Up": "#90F963",
  Closed: "#BE0D1E",
};

export function ClinicLocation({ isLoading, dateFilter }) {
  const containerMaxHeight = 679;
  const maxYAxisSteps = 100;
  const toolTip =
      "Mengetahui jumlah ticket yang sedang di assign ke masing-masing klinik";

  const {
    getClinicReportList,
    clinicReport,
    resetStatus: resetStatusClinicReport,
  } = useClinicReport();

  const { getClinicReport } = clinicReport;

  const decideChartHeight = (items = [], itemPx = 56) => {
    const expectedHeight = items.length * itemPx;
    return expectedHeight;
  };

  const decideContainerYStyle = (chartHeight) => {
    if (chartHeight > containerMaxHeight) {
      return {
        overflowY: "auto",
        height: "679px",
        overflowX: "auto",
      };
    }
    return {
      overflowX: "auto",
    };
  };

  const decideYAxisTicks = (items) => {
    const maxVal = _.maxBy(items, "allCount")?.allCount;
    let ticks = _.range(0, maxYAxisSteps + 5, 5);
    if (maxVal > maxYAxisSteps) {
      ticks = _.range(0, maxVal + 5, 5);
    }
    return ticks;
  };

  const clinicLocation = !_.isEmpty(
    getClinicReport?.data?.dashboardClinicLocation
  )
    ? getClinicReport?.data?.dashboardClinicLocation.map((value) => {
        return {
          ...value,
          type: "Clinic Location",
        };
      })
    : [];

  const chartHeight = decideChartHeight(clinicLocation, 56);
  const containerYStyle = decideContainerYStyle(chartHeight);
  const ticks = decideYAxisTicks(clinicLocation);

  const remappingDataChart = clinicLocation.flatMap((item) => [
    {
      clinicName: `${item.clinicName}\nSLA Average: ${item.averageSlaDesc}`,
      status: "Open",
      value: item.openCount,
    },
    {
      clinicName: `${item.clinicName}\nSLA Average: ${item.averageSlaDesc}`,
      status: "In Progress",
      value: item.inProgressCount,
    },
    {
      clinicName: `${item.clinicName}\nSLA Average: ${item.averageSlaDesc}`,
      status: "Escalate",
      value: item.escalateCount,
    },
    {
      clinicName: `${item.clinicName}\nSLA Average: ${item.averageSlaDesc}`,
      status: "Feedback",
      value: item.feedbackCount,
    },
    {
      clinicName: `${item.clinicName}\nSLA Average: ${item.averageSlaDesc}`,
      status: "Follow Up",
      value: item.followUpCount,
    },
    {
      clinicName: `${item.clinicName}\nSLA Average: ${item.averageSlaDesc}`,
      status: "Closed",
      value: item.closedCount,
    },
  ]);

  const config = {
    data: remappingDataChart,
    isStack: true,
    isGroup: false,
    xField: "value",
    yField: "clinicName",
    seriesField: "status",
    color: ({ status }) => colorMap[status] || "#1890ff",
    label: {
      formatter: (datum) => {
        return datum.value > 0 ? datum.value : "";
      },
      position: "middle",
      style: { fill: "#fff", fontSize: 12 },
    },
    tooltip: {
      formatter: (datum) => ({
        name: datum.status,
        value: datum.value,
      }),
    },
    barWidthRatio: 0.7,
  };

  useEffect(() => {
    getClinicReportList(dateFilter);
  }, [dateFilter]);

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

  return (
    <div className="mb-40 complaint-rate">
      <div className="fw-bold text-md mb-20">
        Clinic Location{" "}
        <Tooltip title={toolTip}>
          <InfoCircleOutlined />
        </Tooltip>
      </div>
      <div className="panel panel--secondary" style={containerYStyle}>
        {isLoading ? (
          <PageSpinner className="page-spinner--dashboard-complaint-rate" />
        ) : (
          <Bar
            {...config}
            autoFit={false}
            height={chartHeight}
            meta={{
              allCount: {
                ticks,
              },
            }}
          />
        )}
      </div>
    </div>
  );
}

const mapStateToProps = ({ getClinicReport }) => ({ getClinicReport });

export default connect(mapStateToProps, { getClinicReportAction })(
  ClinicLocation
);
