import React from 'react';
import { Button } from 'antd';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import { getRoleList } from 'store/action/RoleAction';
import { getTeamList } from 'store/action/TeamAction';

export const ActiveFilter = ({
  activeFilterData,
  setActiveFilter,
  setShowFilter,
  teamList,
  roleList,
}) => {
  const { currentElements } = roleList;

  const removeEachFilter = (param, value) => (e) => {
    e.preventDefault();

    switch (param) {
      case 'role':
        setActiveFilter({
          ...activeFilterData,
          role: activeFilterData.role.filter(
            (roleValue) => roleValue !== value
          ),
        });
        setShowFilter(false);
        break;
      case 'status':
        setActiveFilter({
          ...activeFilterData,
          isActive: activeFilterData.isActive.filter(
            (statusValue) => statusValue !== value
          ),
        });
        setShowFilter(false);
        break;
      case 'team':
        setActiveFilter({
          ...activeFilterData,
          team: activeFilterData.team.filter(
            (teamValue) => teamValue !== value
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
      {!isEmpty(activeFilterData.role) &&
        activeFilterData.role.map((value, index) => (
          <div className="d-flex active-filter__item mr-10" key={index}>
            {!isEmpty(roleList) &&
              !isEmpty(currentElements) &&
              currentElements.map((roleValue) => (
                <>
                  {value === roleValue.id ? (
                    <div className="mr-10 text-sm">{roleValue.name}</div>
                  ) : (
                    ''
                  )}
                </>
              ))}
            <Button
              className="active-filter__btn-close"
              onClick={removeEachFilter('role', value)}>
              <CloseOutlined className="anticon--small" />
            </Button>
          </div>
        ))}
      {!isEmpty(activeFilterData.team) &&
        activeFilterData.team.map((value, index) => (
          <div className="d-flex active-filter__item mr-10" key={index}>
            {!isEmpty(teamList) &&
              !isEmpty(teamList.currentElements) &&
              teamList.currentElements.map((teamValue) => (
                <>
                  {value === teamValue.id ? (
                    <div className="mr-10 text-sm">{teamValue.name}</div>
                  ) : (
                    ''
                  )}
                </>
              ))}
            <Button
              className="active-filter__btn-close"
              onClick={removeEachFilter('team', value)}>
              <CloseOutlined className="anticon--small" />
            </Button>
          </div>
        ))}
      {!isEmpty(activeFilterData.isActive) &&
        activeFilterData.isActive.map((value, index) => (
          <div className="d-flex active-filter__item mr-10" key={index}>
            <div className="mr-10 text-sm">
              {value ? 'Active' : 'Not Active'}
            </div>
            <Button
              className="active-filter__btn-close"
              onClick={removeEachFilter('status', value)}>
              <CloseOutlined className="anticon--small" />
            </Button>
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

const mapStateToProps = ({ roleList, teamList }) => ({
  roleList,
  teamList,
});

export default connect(mapStateToProps, { getRoleList, getTeamList })(
  ActiveFilter
);
