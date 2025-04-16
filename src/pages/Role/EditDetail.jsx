/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import {
    Form,
    Tooltip,
    Button,
    Input,
    Row,
    Col,
    Checkbox,
    message,
    Divider,
} from 'antd'

import { connect } from 'react-redux'
import { CheckCircleOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash'

import { getRoleById } from 'store/action/RoleAction'
import { getUserById } from 'store/action/UserAction'
import { getTeamList } from 'store/action/TeamAction'
import DetailLayout from 'components/detail-layout/DetailReadOnly'
import { PageSpinner } from 'components/PageSpinner'
// import { AuthenticationContext } from 'contexts/Authentication'
import RoleApi from 'api/role'
import {
    convertOptions,
    queryStringify,
    removeEmptyAttributes,
    setCreateEditMessage,
} from '../../utils'

import {
    userManagementOptions,
    roleManagementOptions,
    teamManagementOptions,
    ticketOptions,
    getValueJoinAllOptions,
    initialSelectValueRoleTeam,
    ticketColumnOptions,
    RecentClosedTicketPageOptions,
    SearchInActiveTicketOptions,
    TicketCategoriesManagementOptions,
} from './helper'
import SelectDropdown from '../../components/SelectDropdown'
import { teamsToPropCollection } from '../Team/helper'
import Title from 'antd/lib/typography/Title'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import { useNavigate } from 'react-router-dom'

// redux userById calling for setting privileges, how to implement? find out example in other component
export function EditRole({
    getRoleById,
    roleById,

    getTeamList,
    teamList,
}) {
    const navigate = useNavigate()
    const [checkedList, setCheckedList] = useState([])
    const [indeterminate, setIndeterminate] = useState(false)
    const [checkAll, setCheckAll] = useState(false)
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    const [loadingPage, setLoadingPage] = useState(true)
    //   // const { handleRefreshToken } = useContext(AuthenticationContext);
    const [isLoadingButton, setIsLoadingButton] = useState(false)
    const [removedChecked, setRemovedChecked] = useState([])
    const [addedChecked, setAddedChecked] = useState([])
    const [roleItemsDeterminateState, setRoleItemsDeterminateState] = useState(
        {}
    )
    const userId = localStorage.getItem('user_id')

    useEffect(() => {
        async function getRoleByIdData() {
            try {
                setLoadingPage(true)
                await getRoleById(id)
            } catch (err) {
                if (err.response) {
                    if (err.response.status === 401) {
                        // handleRefreshToken();
                    } else {
                        const errMessage = err.response.data.message
                        message.error(errMessage)
                    }
                } else {
                    message.error('Tidak dapat menghubungi server, cek koneksi')
                    localStorage.clear()
                    sessionStorage.clear()
                    navigate('/')
                }
            } finally {
                setLoadingPage(false)
            }
        }

        getRoleByIdData()
        getTeamListData()
    }, [])

    useEffect(() => {
        if (!isEmpty(roleById) && !isEmpty(roleById.privileges)) {
            const privilegesId = roleById.privileges.map((value) => value.id)
            setCheckedList(privilegesId)
            setIndeterminate(true)
        }
    }, [roleById])

    async function getTeamListData() {
        await getTeamList(
            queryStringify(
                removeEmptyAttributes({
                    page: 1,
                    size: Number.MAX_SAFE_INTEGER,
                    sort: 'name,ASC',
                })
            )
        )
    }

    if (loadingPage) {
        return <PageSpinner />
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

    const getUserId = async () => {
        await getUserById(userId)
    }

    const handleSubmitEditData = async (values) => {
        const checkedListArrayToObjArray = checkedList.map((value) => ({
            id: value,
        }))

        const teams = teamsToPropCollection(
            [
                {
                    id: parseInt(values.edit_detail__team),
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

            theResponse = await RoleApi.updateRole(
                id,
                values.role_name,
                checkedListArrayToObjArray,
                teams
            )
            getUserId()
            navigate('/role')
            setCreateEditMessage(
                theResponse.data,
                'Success Updating Role Data',
                'Error Updating Role Data!'
            )

            // // getSimulationDesignListData();
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
        <>
            {!isEmpty(roleById) && (
                <DetailLayout
                    detailName={roleById.name}
                    className={'edit-detail edit-form'}
                    detailComponent={
                        <Form
                            onFinish={handleSubmitEditData}
                            layout="vertical"
                            className="role-form"
                            initialValues={{
                                role_name: roleById.name,
                                edit_detail__team: initialSelectValueRoleTeam(roleById),
                            }}>
                            <Form.Item className="edit-detail__submit">
                                <Tooltip title="Submit">
                                    <Button
                                        size="large"
                                        htmlType="submit"
                                        icon={<CheckCircleOutlined />}
                                        loading={isLoadingButton}
                                    />
                                </Tooltip>
                            </Form.Item>
                            <Row gutter={20}>
                                <Col span={6}>
                                    <Form.Item
                                        label="Role"
                                        name="role_name"
                                        rules={[{ required: true }]}>
                                        <Input size="large" placeholder={'Insert Role Name'} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        label="Team"
                                        name="edit_detail__team"
                                        rules={[{ required: true }]}>
                                        <SelectDropdown
                                            options={
                                                !isEmpty(teamList) && !isEmpty(teamList.currentElements)
                                                    ? convertOptions(
                                                        teamList.currentElements,
                                                        'name',
                                                        'id'
                                                    )
                                                    : []
                                            }
                                            placeHolder={'Select Team'}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={20}>
                                <Col span={12}>
                                    <Title level={5}>
                                        <span style={{ color: '#ff0000' }}>*</span>&nbsp;Access
                                        Feature Lists
                                    </Title>
                                    <Divider
                                        className={'role-form__divider'}
                                        style={{ margin: '10px 0' }}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={20}>
                                <Col span={12}>
                                    <Form.Item
                                        label="All Features On Ticketing System"
                                        name="access_feature"
                                        rules={[{ required: isEmpty(checkedList) ? true : false }]}>
                                        <Checkbox
                                            indeterminate={indeterminate}
                                            onChange={onCheckAllChange}
                                            checked={checkAll}>
                                            All Features
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Checkbox.Group value={checkedList} onChange={onChange}>
                                <Row gutter={24} style={{ width: '1000px' }}>
                                    <Col span={4}>
                                        <Form.Item label="Dashboard">
                                            <Checkbox value={1}>View Dashboard</Checkbox>
                                            <br/>
                                            <Checkbox value={41}>View Dashboard Agent Capacity</Checkbox>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item label="User Management">
                                            {userManagementOptions.map((value) => (
                                                <React.Fragment>
                                                    <br />
                                                    <Checkbox value={value.value} key={uuidv4()}>
                                                        {value.label}
                                                    </Checkbox>
                                                    <br />
                                                </React.Fragment>
                                            ))}
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item label="Role Management">
                                            {roleManagementOptions.map((value) => (
                                                <React.Fragment>
                                                    <br />
                                                    <Checkbox value={value.value} key={uuidv4()}>
                                                        {value.label}
                                                    </Checkbox>
                                                    <br />
                                                </React.Fragment>
                                            ))}
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item label="Team Management">
                                            {teamManagementOptions.map((value) => (
                                                <React.Fragment>
                                                    <br />
                                                    <Checkbox value={value.value} key={uuidv4()}>
                                                        {value.label}
                                                    </Checkbox>
                                                    <br />
                                                </React.Fragment>
                                            ))}
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item label="Ticket Category Management">
                                            {TicketCategoriesManagementOptions.map((value) => (
                                                <React.Fragment>
                                                    <br />
                                                    <Checkbox value={value.value} key={uuidv4()}>
                                                        {value.label}
                                                    </Checkbox>
                                                    <br />
                                                </React.Fragment>
                                            ))}
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Row gutter={24} style={{ width: '600px' }}>
                                            <Col span={10}>
                                                <Form.Item label="Ticket Feature">
                                                    {ticketOptions.map((value) => (
                                                        <React.Fragment>
                                                            <br />
                                                            <Checkbox
                                                                value={value.value}
                                                                key={uuidv4()}
                                                                indeterminate={_.get(
                                                                    roleItemsDeterminateState,
                                                                    value.determinatePropKey,
                                                                    false
                                                                )}>
                                                                {value.label}
                                                            </Checkbox>
                                                            <br />
                                                        </React.Fragment>
                                                    ))}
                                                </Form.Item>
                                            </Col>
                                            <Col span={10}>
                                                <Form.Item label="Ticket Column">
                                                    {ticketColumnOptions.map((value) => (
                                                        <React.Fragment>
                                                            <br />
                                                            <Checkbox value={value.value} key={uuidv4()}>
                                                                {value.label}
                                                            </Checkbox>
                                                            <br />
                                                        </React.Fragment>
                                                    ))}
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                    {/* <Col span={8}>
                    <Form.Item label="Recent Closed Ticket Page">
                      {RecentClosedTicketPageOptions.map((value) => (
                        <React.Fragment>
                          <Checkbox value={value.value} key={uuidv4()}>
                            {value.label}
                          </Checkbox>
                          <br />
                        </React.Fragment>
                      ))}
                    </Form.Item>
                    <Form.Item label="Search InActive Ticket Page">
                      {SearchInActiveTicketOptions.map((value) => (
                        <React.Fragment>
                          <Checkbox value={value.value} key={uuidv4()}>
                            {value.label}
                          </Checkbox>
                          <br />
                        </React.Fragment>
                      ))}
                    </Form.Item>
                  </Col> */}
                                </Row>
                            </Checkbox.Group>
                        </Form>
                    }
                />
            )}
        </>
    )
}

const mapStateToProps = ({ roleById, teamList }) => ({ roleById, teamList })

export default connect(mapStateToProps, { getRoleById, getUserById, getTeamList })(EditRole)
