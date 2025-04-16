/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Col, Row, DatePicker } from "antd";
import moment from "moment";

import SelectDropdown from "components/SelectDropdown";

import { datePeriodOptions } from "../../helper";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export function DatePeriod({ setActiveFilter, activeFilter }) {
  const [selectedDatePeriod, setSelectedDatePeriod] = useState("Today");

  const onDatePeriodChange = (value) => {
    setSelectedDatePeriod(value);

    if (value === "Today") {
      setActiveFilter({
        ...activeFilter,
        minDate: moment().startOf("day").format("YYYY-MM-DD"),
        maxDate: moment().endOf("day").format("YYYY-MM-DD"),
      });
    } else if (value === "This Week") {
      setActiveFilter({
        ...activeFilter,
        minDate: moment().subtract(6, "days").format("YYYY-MM-DD"),
        maxDate: moment().format("YYYY-MM-DD"),
      });
    } else if (value === "Last 7 Days") {
      setActiveFilter({
        ...activeFilter,
        minDate: moment().subtract(6, "days").format("YYYY-MM-DD"),
        maxDate: moment().format("YYYY-MM-DD"),
      });
    } else if (value === "Last 30 Days") {
      setActiveFilter({
        ...activeFilter,
        minDate: moment().subtract(29, "days").format("YYYY-MM-DD"),
        maxDate: moment().format("YYYY-MM-DD"),
      });
    } else if (value === "Last 3 Months") {
      setActiveFilter({
        ...activeFilter,
        minDate: moment()
          .subtract(3, "month")
          .startOf("month")
          .format("YYYY-MM-DD"),
        maxDate: moment().format("YYYY-MM-DD"),
      });
    } else if (value === "This Month") {
      setActiveFilter({
        ...activeFilter,
        minDate: moment().startOf("month").format("YYYY-MM-DD"),
        maxDate: moment().endOf("month").format("YYYY-MM-DD"),
      });
    } else if (value === "This Year") {
      setActiveFilter({
        ...activeFilter,
        minDate: moment().startOf("year").format("YYYY-MM-DD"),
        maxDate: moment().endOf("year").format("YYYY-MM-DD"),
      });
    } else {
      setActiveFilter({
        ...activeFilter,
        maxDate: moment().format("YYYY-MM-DD"),
        minDate: moment().format("YYYY-MM-DD"),
      });
    }
  };

  const parseMinDate = activeFilter?.minDate?.split("-").join("/");
  const parseMaxDate = activeFilter?.maxDate?.split("-").join("/");

  return (
    <div className="mb-40">
      <div className="fw-bold text-base mb-20">Date Period</div>
      <Row gutter={20}>
        <Col span={6}>
          <SelectDropdown
            options={datePeriodOptions}
            onChange={onDatePeriodChange}
            placeHolder={"Select date period"}
            value={selectedDatePeriod}
          />
        </Col>
        {selectedDatePeriod === "Custom Range" && (
          <>
            <Col span={6}>
              <RangePicker
                size="large"
                format="YYYY-MM-DD"
                defaultValue={[
                  dayjs(parseMinDate, "YYYY/MM/DD"),
                  dayjs(parseMaxDate, "YYYY/MM/DD"),
                ]}
                onChange={(_, dateString) => {
                  const [minDate, maxDate] = dateString;
                  setActiveFilter({
                    ...activeFilter,
                    minDate: dayjs(minDate).format("YYYY-MM-DD"),
                    maxDate: dayjs(maxDate).format("YYYY-MM-DD"),
                  });
                }}
              />
            </Col>
          </>
        )}
      </Row>
    </div>
  );
}

export default DatePeriod;
