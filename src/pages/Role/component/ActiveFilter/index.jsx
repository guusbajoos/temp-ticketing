import React from 'react';
import { Button } from 'antd';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

export const ActiveFilter = ({
  activeFilterData,
  setActiveFilter,
  setShowFilter,
}) => {
  const removeEachFilter = (param, value) => (e) => {
    e.preventDefault();

    switch (param) {
      case 'role':
        setActiveFilter({
          ...activeFilterData,
          roleName: activeFilterData.roleName.filter((role) => role !== value),
        });
        setShowFilter(false);
        break;
      case 'station':
        setActiveFilter({
          ...activeFilterData,
          stationName: activeFilterData.stationName.filter(
            (station) => station !== value
          ),
        });
        setShowFilter(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="active-filter d-flex">
      {!isEmpty(activeFilterData.roleName) &&
        activeFilterData.roleName.map((value, index) => (
          <div className="d-flex active-filter__item mr-10" key={index}>
            <div className="mr-10 text-sm">{value}</div>
            <Button
              className="active-filter__btn-close"
              icon="close"
              size="small"
              onClick={removeEachFilter('role', value)}
            />
          </div>
        ))}
      {!isEmpty(activeFilterData.stationName) &&
        activeFilterData.stationName.map((value, index) => (
          <div className="d-flex active-filter__item mr-10" key={index}>
            <div className="mr-10 text-sm">{value}</div>
            <Button
              className="active-filter__btn-close"
              icon="close"
              size="small"
              onClick={removeEachFilter('station', value)}
            />
          </div>
        ))}
    </div>
  );
};

ActiveFilter.propTypes = {
  activeFilterData: PropTypes.object,
  setActiveFilter: PropTypes.func,
  setFilterShow: PropTypes.func,
};

export default ActiveFilter;
