/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react'
import { Form, Tooltip, Button, Input, Row, Col, message } from 'antd'

import { connect } from 'react-redux'
import { CheckCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash'

import UserApi from 'api/user'
import DetailLayout from 'components/detail-layout/DetailReadOnly'
import SelectDropdown from 'components/SelectDropdown'
import { PageSpinner } from 'components/PageSpinner'
import { getRoleList } from 'store/action/RoleAction'
import { getUserById } from 'store/action/UserAction'
import { getTeamList } from 'store/action/TeamAction'
import {
    convertOptions,
    setCreateEditMessage,
    queryStringify,
    removeEmptyAttributes,
    stringToBoolean,
} from '../../utils'

import { statusOptions } from './helper'
import { v4 as uuidv4 } from 'uuid'
import { validateTeamRoleSelect } from './component/teamRoleSelect/helper/validate'
import {
    buildSelectID,
    buildTeamAndRole,
    SelectType,
    stringSelectID,
} from './component/teamRoleSelect/helper/roleteam'
import { renderSelectBox } from './component/teamRoleSelect/helper/selectbox'

import { useNavigate } from 'react-router-dom'
export function EditUserManagement({
    // userById,
    getTeamList,
    roleList,
    getRoleList,

    teamList,
}) {
    const navigate = useNavigate()
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    const [loadingPage, setLoadingPage] = useState(true)
    // const { handleRefreshToken } = useContext(AuthenticationContext);
    const [isLoadingButton, setIsLoadingButton] = useState(false)
    const [userIdData, setUserIdData] = useState({})
    const [rolesByTeam, setRolesByTeam] = useState(new Map())
    const [isTeamSelected, setIsTeamSelected] = useState(false)
    const [roleBySelectedTeam, setRoleBySelectedTeam] = useState({})
    const [teamRoleSelectBox, setTeamRoleSelectBox] = useState([])
    const [deletedTeamRoleRows, setDeletedTeamRoleRows] = useState('')
    const [addedTeamRoleRows, setAddedTeamRoleRows] = useState('')
    const [validationTeamRoleSelectBox, setValidationTeamRoleSelectBox] =
        useState({})
    const [validateTeamRoleSelectBox, setValidateTeamRoleSelectBox] = useState(
        {}
    )

    const [form] = Form.useForm()

    useEffect(() => {
        if (!isEmpty(userIdData.roles) && rolesByTeam.size > 0) {
            let obj = {}
            userIdData.roles.forEach(function (userRole) {
                if (!isEmpty(userRole.teams)) {
                    userRole.teams.forEach(function (team) {
                        const rbt = rolesByTeam.get(team.name)
                        const roleSelectID = 'role_select_id__' + team.id
                        obj[roleSelectID] = rbt.roles
                    })
                }
            })
            setRoleBySelectedTeam({ ...obj })
        }
    }, [userIdData, rolesByTeam])

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

    useEffect(() => {
        getTeamListData()
    }, [])

    useEffect(() => {
        if (!isEmpty(teamList.currentElements) && !isEmpty(roleList)) {
            let mappedRolesByTeam = new Map()
            teamList.currentElements.forEach(function (team) {
                roleList.currentElements.forEach(function (role) {
                    if (!isEmpty(role.teams)) {
                        role.teams.forEach(function (teamByRole) {
                            if (teamByRole.name === team.name) {
                                if (mappedRolesByTeam.has(teamByRole.name)) {
                                    let cur = mappedRolesByTeam.get(teamByRole.name)
                                    cur.roles.push(role)
                                    mappedRolesByTeam.set(teamByRole.name, cur)
                                } else {
                                    mappedRolesByTeam.set(teamByRole.name, {
                                        roles: [role],
                                        teamDetail: team,
                                    })
                                }
                            }
                        })
                    }
                })
            })
            setRolesByTeam(mappedRolesByTeam)
        }
    }, [teamList, roleList])

    async function getRoleListData() {
        await getRoleList(
            queryStringify(
                removeEmptyAttributes({
                    page: 1,
                    size: Number.MAX_SAFE_INTEGER,
                    sort: 'name,ASC',
                })
            )
        )
    }

    useEffect(() => {
        if (validateTeamRoleSelectBox) {
            // iterate over all the select box
            const objValidation = validateTeamRoleSelect(teamRoleSelectBox, form)
            setValidationTeamRoleSelectBox({
                ...validationTeamRoleSelectBox,
                ...objValidation,
            })
        }
    }, [validateTeamRoleSelectBox])

    useEffect(() => {
        /**
         * filter deleted
         * @type {*[]}
         */
        const filtered = teamRoleSelectBox.filter(function (item) {
            return item.team.selectID != deletedTeamRoleRows
        })

        setTeamRoleSelectBox(filtered)

        setValidateTeamRoleSelectBox({ id: uuidv4() })
    }, [deletedTeamRoleRows])

    useEffect(() => {
        const teamSelectID = buildSelectID(addedTeamRoleRows, SelectType.team)
        const roleSelectID = buildSelectID(addedTeamRoleRows, SelectType.role)

        const newSelects = {
            team: {
                id: !isEmpty(teamList.currentElements)
                    ? convertOptions(teamList.currentElements, 'id')
                    : null,
                selectID: teamSelectID,
                options: !isEmpty(teamList.currentElements)
                    ? convertOptions(teamList.currentElements, 'name')
                    : [],
            },
            role: {
                id: !isEmpty(roleBySelectedTeam[stringSelectID(roleSelectID)])
                    ? convertOptions(
                        roleBySelectedTeam[stringSelectID(roleSelectID)],
                        'id'
                    )
                    : null,
                selectID: roleSelectID,
                options: !isEmpty(roleBySelectedTeam[stringSelectID(roleSelectID)])
                    ? convertOptions(
                        roleBySelectedTeam[stringSelectID(roleSelectID)],
                        'name'
                    )
                    : [],
            },
        }

        setTeamRoleSelectBox([...teamRoleSelectBox, newSelects])

        setValidateTeamRoleSelectBox({ id: uuidv4() })
    }, [addedTeamRoleRows])

    useEffect(() => {
        setTeamRoleSelectBox(
            renderSelectBox(
                userIdData.roles,
                rolesByTeam,
                teamList,
                isTeamSelected,
                roleBySelectedTeam
            )
        )
        setValidateTeamRoleSelectBox({ id: uuidv4() })
    }, [userIdData, rolesByTeam])

    useEffect(() => {
        getRoleListData()
    }, [])

    //Don't use redux getUserById for this component, because redux getUserById is used for privilege, and it has been called.
    const getUserByIdData = useCallback(async () => {
        try {
            setLoadingPage(true)
            const { data } = await UserApi.getUserById(id)
            setUserIdData(data)
        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    // handleRefreshToken();
                } else {
                    const errMessage = err.response.data.message
                    message.error(errMessage)
                }
            }
        } finally {
            setLoadingPage(false)
        }
    }, [])

    useEffect(() => {
        getUserByIdData()
    }, [])

    if (loadingPage) {
        return <PageSpinner />
    }

    const handleSubmitEditData = async (values) => {
        const teamAndRoles = buildTeamAndRole(teamRoleSelectBox, form)
        try {
            setIsLoadingButton(true)
            let theResponse

            theResponse = await UserApi.updatePartialUser(
                id,
                values.user_name,
                values.email,
                values.password,
                stringToBoolean(values.status),
                teamAndRoles
            )

            navigate('/user-management')

            setCreateEditMessage(
                theResponse.data,
                'Success Updating User Data',
                'Error Updating User Data!'
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
            setIsLoadingButton(false)
        }
    }

    const onFormChanges = (changedValues) => {
        const formFieldName = Object.keys(changedValues)[0]
        const selectTeam = teamRoleSelectBox.find(function (item) {
            return item.team.selectID === formFieldName
        })
        const selectRole = teamRoleSelectBox.find(function (item) {
            return item.role.selectID === formFieldName
        })

        /**
         * if field team is selected
         */
        if (!isEmpty(selectTeam) && !isEmpty(selectTeam.role)) {
            form.setFieldsValue({
                [selectTeam.role.selectID]: undefined,
            })
            const k = form.getFieldValue(formFieldName)
            // set the data
            let obj = {}
            obj[stringSelectID(selectTeam.role.selectID)] = rolesByTeam.has(k)
                ? rolesByTeam.get(k).roles
                : []
            setIsTeamSelected(true)
            setRoleBySelectedTeam({ ...roleBySelectedTeam, ...obj })
        } else if (!isEmpty(selectRole)) {
            setValidateTeamRoleSelectBox({ id: uuidv4() })
        }
    }

    const onTeamRoleDeleteRow = (teamSelectID) => () => {
        setDeletedTeamRoleRows(teamSelectID)
    }

    const onAddTeamRoleRow = () => {
        setAddedTeamRoleRows(uuidv4())
    }

    return (
        <>
            {!isEmpty(userIdData) && (
                <DetailLayout
                    detailName={userIdData.name}
                    className={'edit-detail edit-form'}
                    detailComponent={
                        <Form
                            onFinish={handleSubmitEditData}
                            layout="vertical"
                            form={form}
                            initialValues={{
                                user_name: userIdData.name,
                                email: userIdData.email,
                                password: userIdData.password,
                                status: userIdData.isActive.toString(),
                            }}
                            onValuesChange={onFormChanges}>
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
                                <Col span={12}>
                                    <Form.Item
                                        label="User Name"
                                        name="user_name"
                                        rules={[{ required: true }]}>
                                        <Input size="large" placeholder={'Insert User Name'} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Password" name="password">
                                        <Input.Password
                                            size="large"
                                            placeholder={'Insert Password'}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[{ required: true, type: 'email' }]}>
                                        <Input size="large" placeholder={'Insert Email'} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Status"
                                        name="status"
                                        rules={[{ required: true }]}>
                                        <SelectDropdown
                                            options={statusOptions}
                                            placeHolder={'Select Status'}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={20}>
                                <Col
                                    span={12}
                                    className={'fw-bold'}
                                    style={{
                                        color: '#5B5C5D',
                                        fontSize: '20px',
                                        fontFamily: 'roboto',
                                        textAlign: 'justify',
                                    }}>
                                    Team Access List
                                </Col>
                            </Row>
                            <Row gutter={20} style={{ marginTop: '15px' }}>
                                <Col span={12}>
                                    <Button
                                        icon={<PlusOutlined />}
                                        size={'large'}
                                        onClick={onAddTeamRoleRow}>
                                        Add Team & Role
                                    </Button>
                                </Col>
                            </Row>
                            {teamRoleSelectBox.map(function (item, index) {
                                return (
                                    <Row
                                        gutter={20}
                                        style={{ marginTop: '15px' }}
                                        key={Math.random().toString(36).substr(2, 5)}>
                                        <Col
                                            key={Math.random().toString(36).substr(2, 5)}
                                            span={12}>
                                            <Form.Item
                                                key={item.team.selectID}
                                                fieldKey={item.team.selectID}
                                                label="Team"
                                                name={item.team.selectID}
                                                rules={[{ required: true }]}
                                                initialValue={item.team.initialValue}>
                                                <SelectDropdown
                                                    options={item.team.options}
                                                    placeHolder={'Select Team'}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col
                                            key={Math.random().toString(36).substr(2, 5)}
                                            span={12}>
                                            <Form.Item
                                                key={item.role.selectID}
                                                fieldKey={item.role.selectID}
                                                label="Role"
                                                name={item.role.selectID}
                                                rules={[{ required: true }]}
                                                initialValue={
                                                    !isTeamSelected ? item.role.initialValue : undefined
                                                }
                                                validateStatus={
                                                    !isEmpty(
                                                        validationTeamRoleSelectBox[item.role.selectID]
                                                    )
                                                        ? validationTeamRoleSelectBox[item.role.selectID]
                                                            .status
                                                        : undefined
                                                }
                                                help={
                                                    !isEmpty(
                                                        validationTeamRoleSelectBox[item.role.selectID]
                                                    )
                                                        ? validationTeamRoleSelectBox[item.role.selectID]
                                                            .help
                                                        : undefined
                                                }>
                                                <SelectDropdown
                                                    placeHolder={'Select Role'}
                                                    options={
                                                        !isEmpty(
                                                            roleBySelectedTeam[
                                                            stringSelectID(item.role.selectID)
                                                            ]
                                                        )
                                                            ? convertOptions(
                                                                roleBySelectedTeam[
                                                                stringSelectID(item.role.selectID)
                                                                ],
                                                                'name'
                                                            )
                                                            : []
                                                    }
                                                    withoutOnchange={true}
                                                />
                                            </Form.Item>
                                        </Col>
                                        {teamRoleSelectBox.length > 1 ? (
                                            <Col span={24}>
                                                <Button
                                                    danger
                                                    type={'primary'}
                                                    style={{ float: 'right' }}
                                                    onClick={onTeamRoleDeleteRow(item.team.selectID)}>
                                                    Delete Row
                                                </Button>
                                            </Col>
                                        ) : undefined}
                                    </Row>
                                )
                            })}
                        </Form>
                    }
                />
            )}
        </>
    )
}

const mapStateToProps = ({ userById, teamList, roleList }) => ({
    userById,
    teamList,
    roleList,
})

export default connect(mapStateToProps, { getUserById, getTeamList, getRoleList })(
    EditUserManagement
)
