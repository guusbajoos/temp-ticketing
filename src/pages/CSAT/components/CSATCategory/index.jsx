import { useNavigate } from "react-router-dom";

import QueryString from "qs";

import { Form } from "antd";

import SelectDropdown from "components/SelectDropdown";
import { isEmpty } from "lodash";
import { convertOptions } from "utils/index";

const CSATCategory = ({
  activeFilter,
  setActiveFilter,
  historyParams,
  businessOptions,
}) => {
  const parseParams = QueryString.parse(historyParams);

  const navigate = useNavigate();

  const onChangeBusiness = (value) => {
    setActiveFilter({ ...activeFilter, businessId: value });

    const queryParams =
      Object.values(parseParams).length > 0 ? parseParams : activeFilter;

    const newValueParams = {
      ...queryParams,
      businessId: value,
    };

    const summaryParam =
      newValueParams["?summary"] !== undefined
        ? `?summary=${newValueParams["?summary"]}`
        : "?summary=RESPONSE";

    const withoutSummaryParams = {
      minDate: newValueParams.minDate,
      maxDate: newValueParams.maxDate,
      businessId: newValueParams.businessId,
    };

    const params = `${summaryParam}&${QueryString.stringify(
      withoutSummaryParams
    )}`;

    navigate(params, { replace: true });
  };

  return (
    <div className="mb-40">
      <div className="fw-bold text-base mb-20">Category</div>
      <Form.Item name="category">
        <SelectDropdown
          placeHolder={"Main Category"}
          onChange={onChangeBusiness}
          options={
            isEmpty(businessOptions)
              ? []
              : convertOptions(businessOptions, "name", "id")
          }
          // value={activeFilter.businessId}
        />
      </Form.Item>
    </div>
  );
};

export default CSATCategory;
