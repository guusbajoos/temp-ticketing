import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

import './styles/index.scss';

export const MultiselectDropdown = ({
  onChange,
  placeHolder,
  options,
  selectValue,
  disabled,
}) => {
  const { Option } = Select;

  return (
    <div className="multiselect-dropdown">
      <Select
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        disabled={disabled}
        mode="multiple"
        showArrow
        style={{ width: '100%' }}
        onChange={onChange}
        placeholder={placeHolder}
        value={selectValue}
        size="large"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        tokenSeparators={[',']}>
        {options.map((value, index) => (
          <Option value={value.value} key={index}>
            {value.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

MultiselectDropdown.propTypes = {
  onChange: PropTypes.func,
  placeHolder: PropTypes.string,
  options: PropTypes.array,
  selectValue: PropTypes.array,
  disabled: PropTypes.string,
};

MultiselectDropdown.defaultProps = {
  options: [],
};

export default MultiselectDropdown;
