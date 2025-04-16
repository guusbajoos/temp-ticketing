/* eslint-disable react/prop-types */
import { Row, Typography } from "antd";
import { useLocation } from "react-router-dom";
import CSATSummaryItems from "./CSATSummaryItems";
import QueryString from "qs";

export default function CSATSummary({
  handleFilterSummary,
  data,
  classNameSelectedCard,
  setClassNameSelectedCard,
}) {
  const location = useLocation();
  const queryParams = location.search.split("?").join("");
  const { summary } = QueryString.parse(queryParams);

  const summaryList = [
    {
      index: 1,
      titleSummary: "Good",
      data: data?.data.totalGood,
      color: "#6fcf97",
    },
    {
      index: 2,
      titleSummary: "Bad",
      data: data?.data.totalBad,
      color: "#FF004D",
    },
    {
      index: 3,
      titleSummary: "Response",
      data: data?.data.totalResponse,
      color: "#7fd6f5",
    },
  ];

  return (
    <div className="mb-20">
      <Typography.Title level={4}>Summary</Typography.Title>
      <Row gutter={16}>
        {summaryList.map((list) => (
          <CSATSummaryItems
            handleQueryParamsSummary={handleFilterSummary}
            isClickable
            paramsSummary={summary}
            key={list.index}
            countSummary={list.data}
            color={list.color}
            titleSummary={list.titleSummary}
            classNameSelectedCard={classNameSelectedCard}
            setClassNameSelectedCard={setClassNameSelectedCard}
          />
        ))}
      </Row>
      <Row gutter={16}>
        {data && data?.data.totalOffered !== 0 && (
          <CSATSummaryItems
            countSummary={data?.data.totalOffered}
            isClickable={false}
            color={"#3D3B40"}
            titleSummary="Offered"
          />
        )}
        {data && data?.data.percentageResponseRate !== 0 && (
          <CSATSummaryItems
            countSummary={`${data?.data.percentageResponseRate}%`}
            isClickable={false}
            color={"#3D3B40"}
            titleSummary="Response Rate"
          />
        )}
        {data && data?.data.percentageGoodRate !== 0 && (
          <CSATSummaryItems
            countSummary={`${data?.data.percentageGoodRate}%`}
            isClickable={false}
            color={"#3D3B40"}
            titleSummary="Good Rate"
          />
        )}
      </Row>
    </div>
  );
}
