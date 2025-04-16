/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { Row, Col, Button, DatePicker, Form } from 'antd'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'
import moment from 'moment'
import './index.scss'
import SelectDropdown from 'components/SelectDropdown'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
const { RangePicker } = DatePicker

import MultiselectDropdown from 'components/MultiselectDropdown'
import { getTicketList } from 'store/action/TicketAction'
import { getCategoryList } from 'store/action/CategoryAction'
import { getTeamList } from 'store/action/TeamAction'
import { convertOptions } from '../../../../../utils'
import {
    ticketStatusList,
    datePeriodFilterOptions,
    filterSelectedCategory,
} from '../../../helper'
import { useEffect } from 'react'
import api from 'api/index'
import { useBusiness, useClinicLocation } from './hooks'
import { Select } from 'antd'

export const Filter = ({
    setIsTicketStatus,
    resetFilter,
    activeFilter,
    setActiveFilter,
    categoryList,
    teamList,
    onTeamChange,
    onBusinesChange,
    onClinicNameChange,
    onAgentChange,
    onTicketStatusChange,
    onCategoryChange,
    onSubCategory1Change,
    onSubCategory2Change,
    show,
}) => {
    const dateNow = new Date(Date.now())
    const year = dateNow.getFullYear()
    const month = dateNow.getMonth() + 1
    const monthFormat = month.toString().padStart(2, '0')

    const date = dateNow.getDate().toString().padStart(2, '0')

    const [minDate, setMinDate] = useState(`${year}/${monthFormat}/${date}`)
    const [maxDate, setMaxDate] = useState(`${year}/${monthFormat}/${date}`)
    const { currentElements } = teamList
    const [selectedDatePeriod, setSelectedDatePeriod] = useState('')
    const [disableFilterDate, setDisableFilterDate] = useState(true)
    const [selectedSubCategory1, setSelectedSubCategory1] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [form] = Form.useForm()

    function disabledDate(current) {
        return current && current > moment().endOf('day')

    }

    const selectedTeamAgent =
        !isEmpty(teamList) &&
        teamList.currentElements.filter((val) => {
            return activeFilter?.teamId?.includes(val?.id?.toString())
        })

    let agentList = []
    !isEmpty(selectedTeamAgent) &&
        selectedTeamAgent.map((value) => {
            value.users.map((val) => {
                agentList.push({
                    label: val.name,
                    value: val.id,
                })
            })
        })

    const filteredAgentList = agentList.filter(function (obj) {
        return obj.label.length !== 0
    })

    const { getBusinessList, business, resetStatus } =
    useBusiness();

  const {getBusiness} = business

  useEffect(() => {
    getBusinessList()
  }, [])

  useEffect(() => {
    if (getBusiness.status === "FAILED") {
      api.error({
        message: getBusiness.error.message,
        description: getBusiness.error.description,
        duration: 3,
      });
      resetStatus();
    }
  }, [getBusiness.status]);

  const { getClinicLocationList, clinicLocation, resetStatus: resetStatusClinicLocation } =
    useClinicLocation();

  const {getClinicLocation} = clinicLocation

  useEffect(() => {
    getClinicLocationList({
      page: 1,
      size: Number.MAX_SAFE_INTEGER,
      sort: "clinicName,ASC",
    })
  }, [])

  useEffect(() => {
    if (getClinicLocation.status === "FAILED") {
      api.error({
        message: getClinicLocation.error.message,
        description: getClinicLocation.error.description,
        duration: 3,
      });
      resetStatusClinicLocation();
    }
  }, [getClinicLocation.status]);

    const categorySelectedArray = filterSelectedCategory(
        categoryList,
        selectedCategory,
        null,
        'category'
    )

    const subCategory1Array = !isEmpty(categorySelectedArray)
        ? categorySelectedArray[0].subcategories
        : []

    const subCategory1SelectedArray = filterSelectedCategory(
        subCategory1Array,
        selectedSubCategory1,
        null,
        'subCategory1'
    )

    const subCategory2Array = !isEmpty(subCategory1SelectedArray)
        ? subCategory1SelectedArray[0].subcategories
        : []

    const handleFormValuesChange = (changedValues) => {
        const formFieldName = Object.keys(changedValues)[0]

        if (formFieldName === 'category') {
            setSelectedCategory(changedValues[formFieldName])
            form.setFieldsValue({ sub_category_1: undefined })
        }

        if (formFieldName === 'sub_category_1') {
            setSelectedSubCategory1(changedValues[formFieldName])
            form.setFieldsValue({ sub_category_2: undefined })
        }

        if (formFieldName === 'urgency') {
            form.setFieldsValue({
                due_date:
                    changedValues[formFieldName] === 'HIGH'
                        ? moment().add(5, 'days')
                        : moment().add(3, 'days'),
            })
        }
    }

    const onDatePeriodFilterChange = (value) => {
        setSelectedDatePeriod(value)

        if (value === '7 Days') {
            setDisableFilterDate(true)
            const weeks = moment().subtract(6, 'days').format('YYYY/MM/DD')
            setMinDate(weeks)
            setMaxDate(`${year}/${monthFormat}/${date}`)
            setActiveFilter({
                ...activeFilter,
                minDate: moment().subtract(6, 'days').format('YYYY-MM-DD'),
                maxDate: moment().format('YYYY-MM-DD'),
            })
        } else if (value === '1 Month') {
            setDisableFilterDate(true)
            const months = moment().subtract(29, 'days').format('YYYY/MM/DD')
            setMinDate(months)
            setMaxDate(`${year}/${monthFormat}/${date}`)
            setActiveFilter({
                ...activeFilter,
                minDate: moment().subtract(29, 'days').format('YYYY-MM-DD'),
                maxDate: moment().format('YYYY-MM-DD'),
            })
        } else if (value === '1 Year') {
            setDisableFilterDate(true)
            const years = moment().subtract(1, 'years').format('YYYY/MM/DD')
            setMinDate(years)
            setMaxDate(`${year}/${monthFormat}/${date}`)
            setActiveFilter({
                ...activeFilter,
                minDate: moment().subtract(1, 'years').format('YYYY-MM-DD'),
                maxDate: moment().format('YYYY-MM-DD'),
            })
        } else {
            setDisableFilterDate(false)
            setActiveFilter({
                ...activeFilter,
                maxDate: `${year}-${monthFormat}-${date}`,
                minDate: `${year}-${monthFormat}-${date}`,
            })
        }
    }

    const decideDisplay = (show) => {
        if (show) {
            return 'block'
        }
        return 'none'
    }
    return (
        <div
            className="filter custom-filter"
            style={{ display: decideDisplay(show) }}>
            <Row type="flex" gutter={20} className="mb-15">
                <Col xs={12} type="flex" align="start">
                    <div className="text-base">
                        <strong>Filters</strong>
                    </div>
                </Col>
                <Col xs={12} type="flex" align="end">
                    <Button
                        onClick={() => {
                            setDisableFilterDate(true)
                            setMinDate(`${year}/${monthFormat}/${date}`)
                            setMaxDate(`${year}/${monthFormat}/${date}`)
                            setIsTicketStatus({
                                status: "",
                                condition: false
                            })
                            setSelectedDatePeriod('')
                            localStorage.removeItem('filter_status')
                            resetFilter()
                            form.resetFields()
                        }}
                        type="link">
                        Reset
                    </Button>
                </Col>
            </Row>
            <Form form={form} onValuesChange={handleFormValuesChange} id={'tickets'}>
                <Row gutter={20}>
                    <Col xs={8}>
                        <Form.Item name="team_name" className="mb-20">
                            <SelectDropdown
                                isSearch
                                placeHolder={'Team Name'}
                                onChange={onTeamChange}
                                options={
                                    !isEmpty(teamList)
                                        ? convertOptions(currentElements, 'name', 'id')
                                        : []
                                }
                                defaultValue={activeFilter?.teamId}
                                value={activeFilter?.teamId}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={8}>
                        <Form.Item name="agent_name" className="mb-20">
                            <SelectDropdown
                                isSearch
                                placeHolder={'Agent Name'}
                                onChange={onAgentChange}
                                disabled={activeFilter?.teamId?.length < 0}
                                options={!isEmpty(teamList) ? filteredAgentList : []}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={8}>
                        <Form.Item name="status_name" className="mb-20">
                            <SelectDropdown
                                placeHolder={'Ticket Status'}
                                onChange={onTicketStatusChange}
                                options={convertOptions(ticketStatusList, 'label', 'value')}
                                value={activeFilter?.status}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={8}>
                    <Form.Item
              name="businessUnit"
              rules={[{ required: true, message: "Please select Business Unit" }]}
            >
              <Select
                className="mb-10"
                showSearch
                filterOption={(input, option) => {
                  return (
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
                options={
                  !isEmpty(getBusiness.data)
                    ? convertOptions(getBusiness.data, "name", "name")
                    : []
                }
                placeholder={"Select Business Unit"}
                onChange={onBusinesChange}
              />
            </Form.Item>
                    </Col>
                    <Col xs={8}>
                    <Form.Item
              name="clinicName"
              rules={[{ required: true, message: "Please select Clinic Name" }]}
            >
              <Select
                className="mb-10"
                showSearch
                filterOption={(input, option) => {
                  return (
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
                options={
                  !isEmpty(getClinicLocation.data.currentElements)
                    ? convertOptions(getClinicLocation.data.currentElements, "clinicName", "clinicName")
                    : []
                }
                placeholder={"Select Clinic Name"}
                onChange={onClinicNameChange}
              />
            </Form.Item>
                    </Col>
                </Row>

                <Row gutter={20}>
                    <Col xs={8}>
                        <Form.Item name="category">
                            <SelectDropdown
                                placeHolder={'Main Category'}
                                onChange={onCategoryChange}
                                options={
                                    !isEmpty(categoryList)
                                        ? convertOptions(categoryList, 'name', 'id')
                                        : []
                                }
                                value={activeFilter?.categoryId}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={8}>
                        <Form.Item name="sub_category_1">
                            <SelectDropdown
                                placeHolder={'Sub Category 1'}
                                onChange={onSubCategory1Change}
                                options={
                                    !isEmpty(subCategory1Array)
                                        ? convertOptions(subCategory1Array, 'name', 'id')
                                        : []
                                }
                                disabled={isEmpty(activeFilter?.categoryId)}
                                value={activeFilter?.subCategory1Id}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={8}>
                        <Form.Item name="sub_category_2">
                            <SelectDropdown
                                placeHolder={'Sub Category 2'}
                                onChange={onSubCategory2Change}
                                options={
                                    !isEmpty(subCategory2Array)
                                        ? convertOptions(subCategory2Array, 'name', 'id')
                                        : []
                                }
                                disabled={isEmpty(activeFilter?.subCategory1Id)}
                                selectValue={activeFilter?.subCategory2Id}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Row gutter={20}>
                <Col xs={8} className="mb-20">
                    <SelectDropdown
                        placeHolder="Filter Created Date &amp; Time"
                        onChange={onDatePeriodFilterChange}
                        options={datePeriodFilterOptions}

                        value={selectedDatePeriod}
                    />
                </Col>
                <Col xs={16} className="mb-20">
                    <RangePicker
                        size="large"
                        allowClear={false}
                        disabled={disableFilterDate}
                        disabledDate={disabledDate}
                        // defaultValue={[dayjs(minDate, 'YYYY/MM/DD'), dayjs(maxDate, 'YYYY/MM/DD')]}
                        value={[dayjs(minDate, "YYYY/MM/DD"), dayjs(maxDate, "YYYY/MM/DD")]}
                        onChange={(_, dateString) => {
                            const [minDate, maxDate] = dateString
                            setMinDate(dayjs(minDate).format('YYYY-MM-DD'))
                            setMaxDate(dayjs(maxDate).format('YYYY-MM-DD'))
                            setActiveFilter({
                                ...activeFilter,
                                minDate: dayjs(minDate).format('YYYY-MM-DD'),
                                maxDate: dayjs(maxDate).format('YYYY-MM-DD'),
                            })
                        }}
                        format={'YYYY/MM/DD'}
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

const mapStateToProps = ({ ticketList, categoryList, teamList }) => ({
    ticketList,
    categoryList,
    teamList,
})

export default connect(mapStateToProps, {
    getTicketList,
    getCategoryList,
    getTeamList,
})(Filter)
