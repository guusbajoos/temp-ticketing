/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Bar } from "@ant-design/charts";

import { connect } from "react-redux";
import { isEmpty } from "lodash";

import { getReportDashboard } from "store/action/ReportAction";
import { PageSpinner } from "components/PageSpinner";
import _ from "lodash";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

const colorMap = {
  Open: "#F96D63",
  "In Progress": "#F9C463",
  Escalate: "#F9C463",
  Feedback: "#E7F963",
  "Follow Up": "#90F963",
  Closed: "#BE0D1E",
};

export function TeamCapacity({ dashboardReport, isLoading }) {
  const [chartHeight, setChartHeight] = useState(400);
  const [chartContainerStyle, setChartContainerStyle] = useState({});
  const [yAxisTicks, setYAxisTicks] = useState([]);
  const containerMaxHeight = 679;
  const maxYAxisSteps = 100;
  const toolTip =
    "Mengetahui jumlah ticket yang sedang di assign ke masing-masing agent";

  useEffect(() => {
    if (!isEmpty(dashboardReport.ticketCapacities)) {
      const chartHeight = decideChartHeight(teamCapacitiies);
      const containerYStyle = decideContainerYStyle(chartHeight);
      const ticks = decideYAxisTicks(dashboardReport.ticketCapacities);
      setYAxisTicks(ticks);
      setChartHeight(chartHeight);
      setChartContainerStyle(containerYStyle);
    }
  }, [dashboardReport]);

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
    const maxVal = _.maxBy(items, "capacity").capacity;
    let ticks = _.range(0, maxYAxisSteps + 5, 5);
    if (maxVal > maxYAxisSteps) {
      ticks = _.range(0, maxVal + 5, 5);
    }
    return ticks;
  };

  const teamCapacitiies = !isEmpty(dashboardReport.ticketCapacities)
    ? dashboardReport.ticketCapacities.map((value) => {
        return {
          ...value,
          type: "Ticket Capacity",
        };
      })
    : [];

  const dataChart = !isEmpty(teamCapacitiies)
    ? teamCapacitiies.sort(function (a, b) {
        if (a.capacity < b.capacity) {
          return 1;
        }
        return -1;
      })
    : [];

  const remappingDataChart = dataChart.flatMap((item) => [
    {
      agentName: `${item.agentName}\nSLA Average: ${item.averageSlaDesc}`,
      status: "Open",
      value: item.openCapacity,
    },
    {
      agentName: `${item.agentName}\nSLA Average: ${item.averageSlaDesc}`,
      status: "In Progress",
      value: item.inProgressCapacity,
    },
    {
      agentName: `${item.agentName}\nSLA Average: ${item.averageSlaDesc}`,
      status: "Escalate",
      value: item.escalateCapacity,
    },
    {
      agentName: `${item.agentName}\nSLA Average: ${item.averageSlaDesc}`,
      status: "Feedback",
      value: item.feedbackCapacity,
    },
    {
      agentName: `${item.agentName}\nSLA Average: ${item.averageSlaDesc}`,
      status: "Follow Up",
      value: item.followUpCapacity,
    },
    {
      agentName: `${item.agentName}\nSLA Average: ${item.averageSlaDesc}`,
      status: "Closed",
      value: item.closedCapacity,
    },
  ]);

  const config = {
    data: remappingDataChart,
    isStack: true,
    xField: "value",
    yField: "agentName",
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

  return (
    <div className="mb-40 complaint-rate">
      <div className="mb-20 fw-bold text-md">
        Agent Capacity{" "}
        <Tooltip title={toolTip}>
          <InfoCircleOutlined />
        </Tooltip>
      </div>
      <div className="panel panel--secondary" style={chartContainerStyle}>
        {isLoading ? (
          <PageSpinner className="page-spinner--dashboard-complaint-rate" />
        ) : (
          <Bar
            {...config}
            autoFit={false}
            height={chartHeight}
            meta={{
              capacity: {
                ticks: yAxisTicks,
              },
            }}
          />
        )}
      </div>
    </div>
  );
}

const mapStateToProps = ({ dashboardReport }) => ({ dashboardReport });

export default connect(mapStateToProps, { getReportDashboard })(TeamCapacity);
