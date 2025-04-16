import React, { useState } from 'react'
import { Modal, Input, Form, Button, message, Checkbox, Col, Row } from 'antd'
import { useNavigate } from 'react-router'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'
import { getRoleList } from 'store/action/RoleAction'
import { getTeamList } from 'store/action/TeamAction'
import RoleApi from 'api/role'
import {
    setCreateEditMessage,
    queryStringify,
    removeEmptyAttributes,
    convertOptions,
    splitArr,
} from '../../../../utils'

import {
    userManagementOptions,
    roleManagementOptions,
    teamManagementOptions,
    ticketOptions,
    getValueJoinAllOptions,
    ticketColumnOptions,
    RecentClosedTicketPageOptions,
    SearchInActiveTicketOptions,
    TicketCategoriesManagementOptions,
} from '../../helper'

import '../../styles/index.scss'
import SelectDropdown from '../../../../components/SelectDropdown'
import { teamsToPropCollection } from '../../../Team/helper'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

export const ModalAddData = ({

    showModalAddData,
    handleHideModalAddData,
    setShowModalAddData,
    getRoleList,
    setActiveFilter,
    activeFilter,
    teamList,
}) => {
    const navigate = useNavigate()
    const [isLoadingButton, setIsLoadingButton] = useState(false)
    const [checkedList, setCheckedList] = useState([])
    const [indeterminate, setIndeterminate] = useState(false)
    const [checkAll, setCheckAll] = useState(false)
    const [form] = Form.useForm()
    const [removedChecked, setRemovedChecked] = useState([])
    const [addedChecked, setAddedChecked] = useState([])
    const [roleItemsDeterminateState, setRoleItemsDeterminateState] = useState(
        {}
    )

    async function getRoleListData(param) {
        try {
            await getRoleList(
                queryStringify(
                    removeEmptyAttributes({
                        ...param,
                    })
                )
            )
        } catch (err) {
            if (err.response) {
                const errMessage = err.response.data.message
                message.error(errMessage)
            } else {
                message.error('Tidak dapat menghubungi server, cek koneksi')
                localStorage.clear()
                sessionStorage.clear()
                navigate('/')
            }
        } finally {
            // setLoadingPage(false);
        }
    }

    const onChange = (list) => {
        let removed = _.difference(checkedList, list)
        let added = _.difference(list, checkedList)
        /**
         * Apply rule
         **/
        const includedChecked = _.union(
            ticketColumnOptions.map(function (tc) {
                return tc.value
            }),
            RecentClosedTicketPageOptions.map(function (at) {
                return at.value
            }),
            SearchInActiveTicketOptions.map(function (dt) {
                return dt.value
            })
        ).flat()

        const mustIncluded = list
            .map(function (item) {
                if (item === 14) {
                    return includedChecked
                } else {
                    return []
                }
            })
            .filter(function (item) {
                return item.length > 0
            })
            .flat()

        let newList = _.union(list, mustIncluded)

        if (!isEmpty(removed)) {
            if (removed[0] === 14) {
                removed = _.union(removed, removedChecked, includedChecked)
            } else {
                removed = _.union(removed, removedChecked)
            }
            newList = newList.filter(function (item) {
                return !_.includes(removed, item)
            })
            const newAdded = addedChecked.filter(function (item) {
                return !_.includes(removed, item)
            })
            setRemovedChecked(removed)
            setAddedChecked(newAdded)
        } else if (!isEmpty(added)) {
            const addedItem = added
            added = _.union(added, addedChecked)
            if (addedItem[0] === 14) {
                added = _.union(addedItem, includedChecked)
            }
            const newRemoved = removedChecked.filter(function (item) {
                return !_.includes(added, item)
            })
            newList = _.union(added, newList)
            newList = newList.filter(function (item) {
                return !_.includes(newRemoved, item)
            })
            setAddedChecked(added)
            setRemovedChecked(newRemoved)
        }

        // find items included in newList
        // to determine determinate state of checkbox `viewAllTickets`
        const finalIncluded = newList.filter(function (item) {
            return _.includes(includedChecked, item)
        })
        const viewAllTickets = ticketOptions.find(function (topt) {
            return topt.value === 14
        })
        const newState = {}
        newState[viewAllTickets.determinatePropKey] =
            !!finalIncluded.length && finalIncluded.length < includedChecked.length
        if (!isEmpty(viewAllTickets)) {
            setRoleItemsDeterminateState({
                ...roleItemsDeterminateState,
                ...newState,
            })
        }

        setCheckedList(newList)
        setIndeterminate(
            !!newList.length && newList.length < getValueJoinAllOptions.length
        )
        setCheckAll(newList.length === getValueJoinAllOptions.length)
    }

    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? getValueJoinAllOptions : [])
        setIndeterminate(false)
        setCheckAll(e.target.checked)
    }

    const handleSubmitAddData = async (values) => {
        const checkedListToObjectArray = checkedList.map((value) => ({
            id: value,
        }))

        const teams = teamsToPropCollection(
            [
                {
                    id: parseInt(values.mdl_role_add__team),
                },
            ],
            'id',
            (id) => {
                return parseInt(id)
            }
        )

        try {
            setIsLoadingButton(true)
            let theResponse

            theResponse = await RoleApi.addRole(
                values.role_name,
                checkedListToObjectArray,
                teams
            )

            navigate('/role')

            setCreateEditMessage(
                theResponse.data,
                'Success Inserting Role Data',
                'Error Inserting Role Data!'
            )

            getRoleListData({ ...activeFilter, page: 1, size: 8 })
            setActiveFilter({
                ...activeFilter,
                page: 1,
                size: 8,
            })
            setCheckAll(false)
            setCheckedList([])
            setIndeterminate(false)
            setShowModalAddData(false)
            form.resetFields()
        } catch (err) {
            if (err.response) {
                const errMessage = err.response.data.message
                message.error(errMessage)
            } else {
                message.error('Tidak dapat menghubungi server, cek koneksi')
                localStorage.clear()
                sessionStorage.clear()
                navigate('/')
            }
        } finally {
            setIsLoadingButton(false)
        }
    }

    return (
        <Modal
            title="Add New Role"
            centered
            visible={showModalAddData}
            onCancel={handleHideModalAddData}
            footer={[
                <Button key="back" onClick={handleHideModalAddData}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    htmlType="submit"
                    type="primary"
                    form="myForm"
                    loading={isLoadingButton}>
                    Save
                </Button>,
            ]}>
            <Form
                layout="vertical"
                id="myForm"
                form={form}
                className="role-form"
                onFinish={handleSubmitAddData}>
                <Form.Item
                    label="Role Name"
                    name="role_name"
                    rules={[{ required: true }]}>
                    <Input size="large" placeholder="Role Name" />
                </Form.Item>
                <Form.Item
                    label="Team Name"
                    name="mdl_role_add__team"
                    rules={[{ required: true, message: 'Please select team!' }]}>
                    <SelectDropdown
                        options={
                            !isEmpty(teamList) && !isEmpty(teamList.currentElements)
                                ? convertOptions(teamList.currentElements, 'name', 'id')
                                : []
                        }
                        placeHolder={'Select Team'}
                    />
                </Form.Item>
                <Form.Item
                    label="Access Feature Lists"
                    name="access_feature"
                    rules={[{ required: isEmpty(checkedList) ? true : false }]}>
                    <Checkbox
                        indeterminate={indeterminate}
                        onChange={onCheckAllChange}
                        checked={checkAll}>
                        All Features on Ticketing System
                    </Checkbox>
                </Form.Item>
                <Checkbox.Group value={checkedList} onChange={onChange}>
                    <Form.Item label="Dashboard">
                        <Checkbox value={1}>View Dashboard</Checkbox>
                        <br/>
                        <Checkbox value={41}>View Dashboard Agent Capacity</Checkbox>
                    </Form.Item>
                    <Form.Item label="User Management">
                        {userManagementOptions.map((value, index) => (
                            <React.Fragment>
                                <Checkbox value={value.value} key={index}>
                                    {value.label}
                                </Checkbox>
                                <br />
                            </React.Fragment>
                        ))}
                    </Form.Item>
                    <Form.Item label="Role Management">
                        {roleManagementOptions.map((value, index) => (
                            <React.Fragment>
                                <Checkbox value={value.value} key={index}>
                                    {value.label}
                                </Checkbox>
                                <br />
                            </React.Fragment>
                        ))}
                    </Form.Item>
                    <Form.Item label="Team Management">
                        {teamManagementOptions.map((value, index) => (
                            <React.Fragment>
                                <Checkbox value={value.value} key={index}>
                                    {value.label}
                                </Checkbox>
                                <br />
                            </React.Fragment>
                        ))}
                    </Form.Item>
                    <Form.Item label="Ticket Categories Management">
                        {TicketCategoriesManagementOptions.map((value, index) => (
                            <React.Fragment>
                                <Checkbox value={value.value} key={index}>
                                    {value.label}
                                </Checkbox>
                                <br />
                            </React.Fragment>
                        ))}
                    </Form.Item>
                    <Form.Item label="Ticket Feature">
                        <Row gutter={20} style={{ width: '600px', marginTop: '5px' }}>
                            {_.chunk(ticketOptions, 5).map((value) => {
                                const data = value.map(function (e) {
                                    return (
                                        <React.Fragment>
                                            <br />
                                            <Checkbox
                                                value={e.value}
                                                key={uuidv4()}
                                                indeterminate={_.get(
                                                    roleItemsDeterminateState,
                                                    e.determinatePropKey,
                                                    false
                                                )}>
                                                {e.label}
                                            </Checkbox>
                                            <br />
                                        </React.Fragment>
                                    )
                                })
                                return (
                                    <React.Fragment>
                                        <br />
                                        <Col span={10} key={uuidv4()}>
                                            {data}
                                        </Col>
                                        <br />
                                    </React.Fragment>
                                )
                            })}
                        </Row>
                    </Form.Item>
                    <Form.Item label="Ticket Column">
                        <Row gutter={20} style={{ width: '600px' }}>
                            {splitArr(2)(ticketColumnOptions).map((value) => {
                                const data = value.map(function (e) {
                                    return (
                                        <React.Fragment>
                                            <Checkbox value={e.value} key={uuidv4()}>
                                                {e.label}
                                            </Checkbox>
                                            <br />
                                        </React.Fragment>
                                    )
                                })
                                return (
                                    <Col style={{ marginTop: '10px' }} span={10} key={uuidv4()}>
                                        {data}
                                    </Col>
                                )
                            })}
                        </Row>
                    </Form.Item>
                    {/* <Form.Item label="Archived Ticket Page">
            {RecentClosedTicketPageOptions.map((value, index) => (
            <React.Fragment>
                <Checkbox value={value.value} key={index}>
                  {value.label}
                </Checkbox>
                <br />
              </React.Fragment>
            ))}
          </Form.Item>
          <Form.Item label="Deleted Ticket Page">
            {SearchInActiveTicketOptions.map((value, index) => (
            <React.Fragment>
                <Checkbox value={value.value} key={index}>
                  {value.label}
                </Checkbox>
                <br />
              </React.Fragment>
            ))}
          </Form.Item> */}
                </Checkbox.Group>
            </Form>
        </Modal>
    )
}

const mapStateToProps = ({ roleList, teamList }) => ({
    roleList,
    teamList,
})

export default connect(mapStateToProps, { getRoleList, getTeamList })(ModalAddData)
