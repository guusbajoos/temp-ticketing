/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Row, Col, Button } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';

import MultiselectDropdown from 'components/MultiselectDropdown';
import { getTicketList } from 'store/action/TicketAction';
import { getCategoryList } from 'store/action/CategoryAction';
import { getTeamList } from 'store/action/TeamAction';
import { convertOptions, uniqBy } from 'utils';

export const Filter = ({
  resetFilter,
  innerRef,
  activeFilter,
  ticketList,
  categoryList,
  teamList,
  onNumberChange,
  onCategoryChange,
  onAssignChange,
  onSubCategory1Change,
  onSubCategory2Change,
}) => {
  const { currentElements } = ticketList;

  const subCategory2List = categoryList[0].subcategories.map((value) => ({
    label: value.subcategories[0].name,
    value: value.subcategories[0].id,
  }));

  const agentList = teamList.currentElements.map((value) => ({
    label: value.users.length !== 0 ? value.users[0].name : [],
    value: value.users.length !== 0 ? value.users[0].id : [],
  }));

  const filteredAgentList = agentList.filter(function (obj) {
    return obj.label.length !== 0;
  });

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
            placeHolder={'Ticket Number'}
            onChange={onNumberChange}
            options={
              !isEmpty(ticketList)
                ? convertOptions(currentElements, 'number')
                : []
            }
            selectValue={activeFilter.number}
          />
        </Col>
        <Col xs={12} className="mb-20">
          <MultiselectDropdown
            placeHolder={'Assigned To'}
            onChange={onAssignChange}
            options={!isEmpty(teamList) ? filteredAgentList : []}
            selectValue={activeFilter.agent}
          />
        </Col>
      </Row>
      <Row gutter={20}>
        <Col xs={12} className="mb-20">
          <MultiselectDropdown
            placeHolder={'Top Category'}
            onChange={onCategoryChange}
            options={
              !isEmpty(categoryList)
                ? convertOptions(categoryList, 'name', 'id')
                : []
            }
            selectValue={activeFilter.category}
          />
        </Col>
        <Col xs={12} className="mb-20">
          <MultiselectDropdown
            placeHolder={'Sub Category 1'}
            onChange={onSubCategory1Change}
            options={
              !isEmpty(categoryList)
                ? convertOptions(categoryList[0].subcategories, 'name', 'id')
                : []
            }
            selectValue={activeFilter.subcategory1}
          />
        </Col>
      </Row>
      <Row gutter={20}>
        <Col xs={12} className="mb-20">
          <MultiselectDropdown
            placeHolder={'Sub Category 2'}
            onChange={onSubCategory2Change}
            options={
              !isEmpty(categoryList)
                ? uniqBy(subCategory2List, JSON.stringify)
                : []
            }
            selectValue={activeFilter.subcategory2}
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

const mapStateToProps = ({ ticketList, categoryList, teamList }) => ({
  ticketList,
  categoryList,
  teamList,
});

export default connect(mapStateToProps, {
  getTicketList,
  getCategoryList,
  getTeamList,
})(Filter);
