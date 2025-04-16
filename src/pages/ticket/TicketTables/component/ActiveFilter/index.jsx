import React from 'react';
import { Button } from 'antd';
import { isEmpty, isArray, uniqBy } from 'lodash';
import PropTypes from 'prop-types';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import { getTicketList } from 'store/action/TicketAction';
// import { teamList } from 'store/reducer/TeamReducer';
import { getCategoryList } from 'store/action/CategoryAction';
import { getTeamList } from 'store/action/TeamAction';

export const ActiveFilter = ({
  activeFilterData,
  setActiveFilter,
  setShowFilter,
  ticketList,
  categoryList,
  teamList,
}) => {
  const { currentElements } = ticketList;

  const removeEachFilter = (param, value) => (e) => {
    e.preventDefault();

    switch (param) {
      case 'number':
        setActiveFilter({
          ...activeFilterData,
          number: activeFilterData.number.filter(
            (numberValue) => numberValue !== value
          ),
        });
        setShowFilter(false);
        break;
      case 'agent':
        setActiveFilter({
          ...activeFilterData,
          agent: activeFilterData.agent.filter(
            (agentValue) => agentValue !== value
          ),
        });
        setShowFilter(false);
        break;
      case 'category':
        setActiveFilter({
          ...activeFilterData,
          category: activeFilterData.category.filter(
            (categoryValue) => categoryValue !== value
          ),
        });
        setShowFilter(false);
        break;
      case 'subcategory1':
        setActiveFilter({
          ...activeFilterData,
          subcategory1: activeFilterData.subcategory1.filter(
            (subCategory1Value) => subCategory1Value !== value
          ),
        });
        setShowFilter(false);
        break;
      case 'subcategory2':
        setActiveFilter({
          ...activeFilterData,
          subcategory2: activeFilterData.subcategory2.filter(
            (subCategory2Value) => subCategory2Value !== value
          ),
        });
        setShowFilter(false);
        break;
      default:
        break;
    }
  };

  const agentList =
    !isEmpty(teamList) &&
    teamList.currentElements.map((value) => ({
      label: value.users.length !== 0 ? value.users[0].name : [],
      value: value.users.length !== 0 ? value.users[0].id : [],
    }));

  const filteredAgentList =
    !isEmpty(teamList) &&
    agentList.filter(function (obj) {
      return obj.label.length !== 0;
    });

  const subCategory2Data =
    !isEmpty(categoryList[0]) &&
    categoryList[0].subcategories.map((value) => ({
      label: value.subcategories[0].name,
      value: value.subcategories[0].id,
    }));

  const subCategory2List = uniqBy(subCategory2Data, JSON.stringify);

  return (
    <div className="active-filter d-flex">
      {!isEmpty(activeFilterData.number) &&
        activeFilterData.number.map((value, index) => (
          <div className="d-flex active-filter__item mr-10" key={index}>
            {!isEmpty(ticketList) &&
              !isEmpty(currentElements) &&
              currentElements.map((numberValue) => (
                <>
                  {value === numberValue.number ? (
                    <div className="mr-10 text-sm">{numberValue.number}</div>
                  ) : (
                    ''
                  )}
                </>
              ))}
            <Button
              className="active-filter__btn-close"
              onClick={removeEachFilter('number', value)}>
              <CloseOutlined className="anticon--small" />
            </Button>
          </div>
        ))}
      {!isEmpty(activeFilterData.agent) &&
        isArray(activeFilterData.agent) &&
        activeFilterData.agent.map((value, index) => (
          <div className="d-flex active-filter__item mr-10" key={index}>
            {!isEmpty(filteredAgentList) &&
              filteredAgentList.map((agentValue) => (
                <>
                  {value === agentValue.value ? (
                    <div className="mr-10 text-sm">{agentValue.label}</div>
                  ) : (
                    ''
                  )}
                </>
              ))}
            <Button
              className="active-filter__btn-close"
              onClick={removeEachFilter('agent', value)}>
              <CloseOutlined className="anticon--small" />
            </Button>
          </div>
        ))}
      {!isEmpty(activeFilterData.category) &&
        activeFilterData.category.map((value, index) => (
          <div className="d-flex active-filter__item mr-10" key={index}>
            {!isEmpty(categoryList) &&
              categoryList.map((categoryValue) => (
                <>
                  {value == categoryValue.id ? (
                    <div className="mr-10 text-sm">{categoryValue.name}</div>
                  ) : (
                    ''
                  )}
                </>
              ))}
            <Button
              className="active-filter__btn-close"
              onClick={removeEachFilter('category', value)}>
              <CloseOutlined className="anticon--small" />
            </Button>
          </div>
        ))}
      {!isEmpty(activeFilterData.subcategory1) &&
        activeFilterData.subcategory1.map((value, index) => (
          <div className="d-flex active-filter__item mr-10" key={index}>
            {!isEmpty(categoryList[0].subcategories) &&
              categoryList[0].subcategories.map((subCategory1Value) => (
                <>
                  {value == subCategory1Value.id ? (
                    <div className="mr-10 text-sm">
                      {subCategory1Value.name}
                    </div>
                  ) : (
                    ''
                  )}
                </>
              ))}
            <Button
              className="active-filter__btn-close"
              onClick={removeEachFilter('subcategory1', value)}>
              <CloseOutlined className="anticon--small" />
            </Button>
          </div>
        ))}
      {!isEmpty(activeFilterData.subcategory2) &&
        activeFilterData.subcategory2.map((value, index) => (
          <div className="d-flex active-filter__item mr-10" key={index}>
            {!isEmpty(subCategory2List) &&
              subCategory2List.map((subCategory2Value) => (
                <>
                  {value == subCategory2Value.value ? (
                    <div className="mr-10 text-sm">
                      {subCategory2Value.label}
                    </div>
                  ) : (
                    ''
                  )}
                </>
              ))}
            <Button
              className="active-filter__btn-close"
              onClick={removeEachFilter('subcategory2', value)}>
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

const mapStateToProps = ({ ticketList, categoryList, teamList }) => ({
  ticketList,
  categoryList,
  teamList,
});

export default connect(mapStateToProps, {
  getTicketList,
  getCategoryList,
  getTeamList,
})(ActiveFilter);
