/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { Col, Row, DatePicker } from "antd";
import moment from "moment";
import SelectDropdown from "components/SelectDropdown";
import { periodOptions } from "./constant";
import { useNavigate } from "react-router-dom";
import QueryString from "qs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

export function CSATDatePeriod({
  setActiveFilter,
  activeFilter,
  historyParams,
  setIsStatusCSATTable,
}) {
  const parseParams = QueryString.parse(historyParams);
  const [selectedDatePeriod, setSelectedDatePeriod] = useState("Yesterday");
  const navigate = useNavigate();

  const onDatePeriodChange = async (value) => {
    setIsStatusCSATTable(true);
    setSelectedDatePeriod(value);

    let minDate, maxDate;

    switch (value) {
      case "Yesterday":
        minDate = moment().subtract(1, "days").format("YYYY-MM-DD");
        maxDate = minDate;
        break;
      case "This Week":
      case "Last 7 Days":
        minDate = moment().subtract(6, "days").format("YYYY-MM-DD");
        maxDate = moment().format("YYYY-MM-DD");
        break;
      case "Last 30 Days":
        minDate = moment().subtract(29, "days").format("YYYY-MM-DD");
        maxDate = moment().format("YYYY-MM-DD");
        break;
      case "Last 3 Months":
        minDate = moment()
          .subtract(3, "months")
          .startOf("month")
          .format("YYYY-MM-DD");
        maxDate = moment().format("YYYY-MM-DD");
        break;
      case "This Month":
        minDate = moment().startOf("month").format("YYYY-MM-DD");
        maxDate = moment().endOf("month").format("YYYY-MM-DD");
        break;
      case "This Year":
        minDate = moment().startOf("year").format("YYYY-MM-DD");
        maxDate = moment().endOf("year").format("YYYY-MM-DD");
        break;
      default:
        minDate = maxDate = moment().format("YYYY-MM-DD");
    }

    setActiveFilter({
      ...activeFilter,
      minDate,
      maxDate,
    });

    const newValueParamsPeriod = {
      ...parseParams,
      minDate,
      maxDate,
    };

    const summaryParam =
      newValueParamsPeriod["?summary"] !== undefined
        ? `?summary=${newValueParamsPeriod["?summary"]}`
        : "?summary=RESPONSE";

    const withoutSummaryParams = {
      minDate: newValueParamsPeriod.minDate,
      maxDate: newValueParamsPeriod.maxDate,
      businessId: newValueParamsPeriod.businessId,
    };

    const params = `${summaryParam}&${QueryString.stringify(
      withoutSummaryParams
    )}`;

    navigate(params, { replace: true });
  };

  const parseMinDate = activeFilter?.minDate?.split("-").join("/");
  const parseMaxDate = activeFilter?.maxDate?.split("-").join("/");

  return (
    <div className="mb-40">
      <div className="fw-bold text-base mb-20">Date Period</div>
      <Row gutter={20}>
        <Col span={12}>
          <SelectDropdown
            options={periodOptions}
            onChange={onDatePeriodChange}
            placeHolder={"Select date period"}
            value={selectedDatePeriod}
          />
        </Col>
        {selectedDatePeriod === "Custom Range" && (
          <>
            <Col span={12}>
              <RangePicker
                size="large"
                format="YYYY-MM-DD"
                defaultValue={[
                  dayjs(parseMinDate, "YYYY/MM/DD"),
                  dayjs(parseMaxDate, "YYYY/MM/DD"),
                ]}
                onChange={(_, dateString) => {
                  setIsStatusCSATTable(true);
                  const [minDate, maxDate] = dateString;
                  const newValueParamsPeriod = {
                    ...parseParams,
                    minDate: dayjs(minDate).format("YYYY-MM-DD"),
                    maxDate: dayjs(maxDate).format("YYYY-MM-DD"),
                  };
                  setActiveFilter({
                    ...activeFilter,
                    minDate: dayjs(minDate).format("YYYY-MM-DD"),
                    maxDate: dayjs(maxDate).format("YYYY-MM-DD"),
                  });
                  navigate(
                    `?summary=${newValueParamsPeriod["?summary"]}&minDate=${newValueParamsPeriod.minDate}&maxDate=${newValueParamsPeriod.maxDate}&businessId=${newValueParamsPeriod.businessId}`,
                    { replace: true }
                  );
                }}
              />
            </Col>
          </>
        )}
      </Row>
    </div>
  );
}

export default CSATDatePeriod;
