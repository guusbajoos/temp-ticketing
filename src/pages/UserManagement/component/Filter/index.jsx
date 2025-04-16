/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Row, Col, Button } from 'antd'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'

import MultiselectDropdown from 'components/MultiselectDropdown'
import SelectDropdown from 'components/SelectDropdown'
import { getRoleList } from 'store/action/RoleAction'
import { getTeamList } from 'store/action/TeamAction'
import { convertOptions } from '../../../../utils'

import { statusOptions } from '../../helper'

export const Filter = ({
    resetFilter,
    innerRef,
    activeFilter,
    teamList,
    roleList,
    onStatusChange,
    onTeamChange,
    onRoleChange,
}) => {
    const { currentElements } = roleList

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
                    <SelectDropdown
                        onChange={onStatusChange}
                        options={statusOptions}
                        placeHolder={'Select Status'}
                        value={activeFilter.isActive}
                    />
                </Col>
                <Col xs={12} className="mb-20">
                    <MultiselectDropdown
                        placeHolder={'Select Role'}
                        onChange={onRoleChange}
                        options={
                            !isEmpty(roleList) && !isEmpty(currentElements)
                                ? convertOptions(currentElements, 'name', 'id')
                                : []
                        }
                        selectValue={activeFilter.role}
                    />
                </Col>
                <Col xs={12} className="mb-20">
                    <MultiselectDropdown
                        placeHolder={'Select Team'}
                        onChange={onTeamChange}
                        options={
                            !isEmpty(teamList) && !isEmpty(teamList.currentElements)
                                ? convertOptions(teamList.currentElements, 'name', 'id')
                                : []
                        }
                        selectValue={activeFilter.team}
                    />
                </Col>
            </Row>
        </div>
    )
}

Filter.propTypes = {
    resetFilter: PropTypes.func,
    activeFilter: PropTypes.object,
}

const mapStateToProps = ({ roleList, teamList }) => ({
    roleList,
    teamList,
})

export default connect(mapStateToProps, { getRoleList, getTeamList })(Filter)
