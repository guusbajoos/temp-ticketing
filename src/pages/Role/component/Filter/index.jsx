import React from 'react';
import { Row, Col, Button } from 'antd';
import PropTypes from 'prop-types';

import MultiselectDropdown from 'components/MultiselectDropdown';

export const Filter = ({
  resetFilter,
  innerRef,
  activeFilter,
  onRoleChange,
  onStationChange,
  roleOptions,
  stationOptions,
}) => {
  return (
    <div className="filter" ref={innerRef}>
      <Row type="flex" gutter={20} className="mb-15">
        <Col xs={12} type="flex" align="start">
          <div className="text-base">
            <strong>Filters</strong>
          </div>
        </Col>
        <Col xs={12} type="flex" align="end">
          <Button onClick={resetFilter} type="link">
            Reset
          </Button>
        </Col>
      </Row>

      <Row gutter={20}>
        <Col xs={12} className="mb-20">
          <MultiselectDropdown
            placeHolder={'Select Role'}
            onChange={onRoleChange}
            options={roleOptions}
            selectValue={activeFilter.roleName}
          />
        </Col>
        <Col xs={12} className="mb-20">
          <MultiselectDropdown
            placeHolder={'Select Station'}
            onChange={onStationChange}
            options={stationOptions}
            selectValue={activeFilter.stationName}
          />
        </Col>
      </Row>
    </div>
  );
};

Filter.propTypes = {
  resetFilter: PropTypes.func,
  activeFilter: PropTypes.object,
};

export default Filter;
