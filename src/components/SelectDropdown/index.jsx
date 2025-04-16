import React from "react";
import PropTypes from "prop-types";
import { Select, Badge } from "antd";

import "./styles/index.scss";
import { isEmpty } from "lodash";

export const SelectDropdown = ({
  placeHolder,
  options,
  onChange,
  value,
  disabled,
  selectedIcon,
  defaultValue,
  className = "multiselect-dropdown",
  isSearch,
  isBadgeStatus = false,
  backgroundStatus,
}) => {
  const { Option } = Select;

  return (
    <div className={className}>
      {isSearch ? (
        <Select
          size="large"
          showSearch
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          value={!isEmpty(value) ? value : undefined}
          defaultValue={defaultValue}
          placeholder={placeHolder}
          optionFilterProp="children"
          onChange={onChange}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={options}
        />
      ) : (
        <Select
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          optionLabelProp="label"
          placeholder={placeHolder}
          onChange={onChange}
          value={!isEmpty(value) ? value : undefined}
          disabled={disabled}
          size={"large"}
          defaultValue={defaultValue}
        >
          {options.map((data, index) => (
            <Option
              key={index}
              value={data.value}
              label={
                <React.Fragment>
                  {isBadgeStatus ? (
                    <Badge className={backgroundStatus}>
                      <div
                        className={`badge-bullet ${backgroundStatus}-bullet`}
                      ></div>
                      {!isEmpty(selectedIcon) ? selectedIcon : undefined}
                      &nbsp;&nbsp;
                      {data.label}
                    </Badge>
                  ) : (
                    <React.Fragment>
                      {!isEmpty(selectedIcon) ? selectedIcon : undefined}
                      &nbsp;&nbsp;
                      {data.label}
                    </React.Fragment>
                  )}
                </React.Fragment>
              }
            >
              {data.label}
            </Option>
          ))}
        </Select>
      )}
    </div>
  );
};

SelectDropdown.propTypes = {
  onChange: PropTypes.func,
  placeHolder: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.string,
};

SelectDropdown.defaultProps = {
  options: [],
  disabled: false,
};

export default SelectDropdown;
