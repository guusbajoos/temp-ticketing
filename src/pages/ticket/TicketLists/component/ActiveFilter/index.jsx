/**
 * DEPRECATED / NOT USED
 * added by github @rafifuadyrata, 4 February 2022
 */
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { isArray, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import { getTicketList } from 'store/action/TicketAction';
import { getCategoryList } from 'store/action/CategoryAction';
import { getTeamList } from 'store/action/TeamAction';
import { ticketStatusList } from '../../../helper';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export const ActiveFilter = ({
  activeFilterData,
  setActiveFilter,
  setShowFilter,
  categoryList,
  teamList,
}) => {
  const { currentElements } = teamList;
  const [flattenCategories, setFlattenCategories] = useState([]);

  const removeEachFilter = (param, value) => (e) => {
    e.preventDefault();

    switch (param) {
      case 'team-filter':
        setActiveFilter({
          ...activeFilterData,
          team: activeFilterData.team.filter(
            (teamValue) => teamValue !== value
          ),
        });
        setShowFilter(false);
        break;
      case 'agent-filter':
        setActiveFilter({
          ...activeFilterData,
          agent: activeFilterData.agent.filter(
            (agentValue) => agentValue !== value
          ),
        });
        setShowFilter(false);
        break;
      case 'status-filter':
        setActiveFilter({
          ...activeFilterData,
          status: activeFilterData.status.filter(
            (statusValue) => statusValue !== value
          ),
        });
        setShowFilter(false);
        break;
      case 'category-filter':
        setActiveFilter({
          ...activeFilterData,
          category: activeFilterData.category.filter(
            (categoryValue) => categoryValue !== value
          ),
        });
        setShowFilter(false);
        break;
      case 'subcategory1-filter':
        setActiveFilter({
          ...activeFilterData,
          subcategory1: activeFilterData.subcategory1.filter(
            (subCategory1Value) => subCategory1Value !== value
          ),
        });
        setShowFilter(false);
        break;
      case 'subcategory2-filter':
        setActiveFilter({
          ...activeFilterData,
          subcategory2: activeFilterData.subcategory2.filter(
            (subCategory2Value) => subCategory2Value !== value
          ),
        });
        setShowFilter(false);
        break;
      case 'minDate-filter':
        setActiveFilter({
          ...activeFilterData,
          minDate: '',
        });
        setShowFilter(false);
        break;
      case 'maxDate-filter':
        setActiveFilter({
          ...activeFilterData,
          maxDate: '',
        });
        setShowFilter(false);
        break;
      default:
        break;
    }
  };

  const agentList =
    !isEmpty(teamList) &&
    currentElements.map((value) => ({
      label: value.users.length !== 0 ? value.users[0].name : [],
      value: value.users.length !== 0 ? value.users[0].id : [],
    }));

  const filteredAgentList =
    !isEmpty(teamList) &&
    agentList.filter(function (obj) {
      return obj.label.length !== 0;
    });

  const subCategory1Data =
    !isEmpty(flattenCategories) &&
    flattenCategories.filter(function (fc) {
      return fc.level === 1;
    });

  const subCategory2Data =
    !isEmpty(flattenCategories) &&
    flattenCategories.filter(function (fc) {
      return fc.level === 2;
    });

  useEffect(() => {
    /**
     * Construct flatten category with the following props
     * {
     *     id:
     *     name:
     *     level
     * }
     * then we filter unique by ID
     */
    if (!isEmpty(categoryList)) {
      let compiled = [];
      let s = [];
      for (const [key, value] of Object.entries(categoryList)) {
        const obj = {
          id: value.id,
          name: value.name,
          level: value.level,
        };
        if (!isEmpty(value.subcategories)) {
          s.push(value.subcategories);
        }
        compiled.push(obj);
      }

      while (!isEmpty(s)) {
        const item = s.pop();
        for (const [key, value] of Object.entries(item)) {
          const obj = {
            id: value.id,
            name: value.name,
            level: value.level,
          };
          if (!isEmpty(value.subcategories)) {
            s.push(value.subcategories);
          }
          compiled.push(obj);
        }
      }

      const uniqueCompiled = _.uniqBy(compiled, 'id');
      setFlattenCategories(uniqueCompiled);
    }
  }, [categoryList]);

  return (
    <div className="active-filter d-flex" key={uuidv4()}>
      {!isEmpty(activeFilterData.team) &&
        isArray(activeFilterData.team) &&
        activeFilterData.team.map((value, index) => (
          <div className="d-flex  active-filter__item mr-10" key={uuidv4()}>
            {!isEmpty(currentElements) &&
              currentElements.map((teamValue) => (
                <>
                  {value == teamValue.id ? (
                    <div className="mr-10 text-sm" key={uuidv4()}>
                      {teamValue.name}
                    </div>
                  ) : (
                    ''
                  )}
                </>
              ))}
            <Button
              className="active-filter__btn-close"
              onClick={removeEachFilter('team-filter', value)}
              key={uuidv4()}>
              <CloseOutlined className="anticon--small" />
            </Button>
          </div>
        ))}
      {!isEmpty(activeFilterData.agent) &&
        isArray(activeFilterData.agent) &&
        activeFilterData.agent.map((value, index) => (
          <div className="d-flex active-filter__item mr-10" key={uuidv4()}>
            {!isEmpty(currentElements) &&
              filteredAgentList.map((agentValue) => (
                <>
                  {value == agentValue.value ? (
                    <div className="mr-10 text-sm" key={uuidv4()}>
                      {agentValue.label}
                    </div>
                  ) : (
                    ''
                  )}
                </>
              ))}
            <Button
              key={uuidv4()}
              className="active-filter__btn-close"
              onClick={removeEachFilter('agent-filter', value)}>
              <CloseOutlined className="anticon--small" />
            </Button>
          </div>
        ))}
      {!isEmpty(activeFilterData.status) &&
        activeFilterData.status.map((value, index) => (
          <div className="d-flex active-filter__item mr-10" key={uuidv4()}>
            {!isEmpty(ticketStatusList) &&
              ticketStatusList.map((ticketStatusValue) => (
                <>
                  {value == ticketStatusValue.value ? (
                    <div className="mr-10 text-sm" key={uuidv4()}>
                      {ticketStatusValue.label}
                    </div>
                  ) : (
                    ''
                  )}
                </>
              ))}
            <Button
              key={uuidv4()}
              className="active-filter__btn-close"
              onClick={removeEachFilter('status-filter', uuidv4())}>
              <CloseOutlined className="anticon--small" />
            </Button>
          </div>
        ))}
      {!isEmpty(activeFilterData.category) &&
        activeFilterData.category.map((value, index) => (
          <div className="d-flex active-filter__item mr-10" key={uuidv4()}>
            {!isEmpty(categoryList) &&
              categoryList.map((categoryValue) => (
                <>
                  {value == categoryValue.id ? (
                    <div className="mr-10 text-sm" key={uuidv4()}>
                      {categoryValue.name}
                    </div>
                  ) : (
                    ''
                  )}
                </>
              ))}
            <Button
              key={uuidv4()}
              className="active-filter__btn-close"
              onClick={removeEachFilter('category-filter', value)}>
              <CloseOutlined className="anticon--small" />
            </Button>
          </div>
        ))}
      {!isEmpty(activeFilterData.subcategory1) &&
        activeFilterData.subcategory1.map((value, index) => (
          <div className="d-flex active-filter__item mr-10" key={uuidv4()}>
            {!isEmpty(subCategory1Data) &&
              subCategory1Data.map((v) => (
                <>
                  {value == v.id ? (
                    <div className="mr-10 text-sm" key={uuidv4()}>
                      {v.name}
                    </div>
                  ) : (
                    ''
                  )}
                </>
              ))}
            <Button
              key={uuidv4()}
              className="active-filter__btn-close"
              onClick={removeEachFilter('subcategory1-filter', value)}>
              <CloseOutlined className="anticon--small" />
            </Button>
          </div>
        ))}
      {!isEmpty(activeFilterData.subcategory2) &&
        activeFilterData.subcategory2.map((value, index) => (
          <div className="d-flex active-filter__item mr-10" key={uuidv4()}>
            {!isEmpty(subCategory2Data) &&
              subCategory2Data.map((v) => (
                <>
                  {value == v.id ? (
                    <div className="mr-10 text-sm" key={uuidv4()}>
                      {v.name}
                    </div>
                  ) : (
                    ''
                  )}
                </>
              ))}
            <Button
              key={uuidv4()}
              className="active-filter__btn-close"
              onClick={removeEachFilter('subcategory2-filter', value)}>
              <CloseOutlined className="anticon--small" />
            </Button>
          </div>
        ))}
      {!isEmpty(activeFilterData.minDate) && (
        <div className="d-flex active-filter__item mr-10" key={uuidv4()}>
          <div className="mr-10 text-sm" key={uuidv4()}>
            {activeFilterData.minDate}
            <Button
              key={uuidv4()}
              className="active-filter__btn-close"
              onClick={removeEachFilter('minDate-filter')}>
              <CloseOutlined className="anticon--small" />
            </Button>
          </div>
        </div>
      )}
      {!isEmpty(activeFilterData.maxDate) && (
        <div className="d-flex active-filter__item mr-10" key={uuidv4()}>
          <div className="mr-10 text-sm" key={uuidv4()}>
            {activeFilterData.maxDate}
            <Button
              key={uuidv4()}
              className="active-filter__btn-close"
              onClick={removeEachFilter('maxDate-filter')}>
              <CloseOutlined className="anticon--small" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

ActiveFilter.propTypes = {
  activeFilterData: PropTypes.object,
  setActiveFilter: PropTypes.func,
  setFilterShow: PropTypes.func,
};

const mapStateToProps = ({ categoryList, teamList }) => ({
  categoryList,
  teamList,
});

export default connect(mapStateToProps, {
  getTicketList,
  getCategoryList,
  getTeamList,
})(ActiveFilter);
