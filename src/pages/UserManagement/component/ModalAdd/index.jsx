/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Modal, Input, Form, Button, message } from 'antd'
import { useNavigate } from 'react-router'
import { connect } from 'react-redux'
import { getUserList } from 'store/action/UserAction'
import UserApi from 'api/user'
import RoleApi from 'api/role'
import { getRoleList } from 'store/action/RoleAction'
import { getTeamList } from 'store/action/TeamAction'
import SelectDropdown from 'components/SelectDropdown'
import {
    setCreateEditMessage,
    queryStringify,
    removeEmptyAttributes,
} from '../../../../utils'

export const ModalAddData = ({

    getUserList,
    showModalAddData,
    handleHideModalAddData,
    setShowModalAddData,
    setActiveFilter,
    activeFilter,
    teamList,
}) => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [form] = Form.useForm()
    const [isTeamSelected, setIsTeamSelected] = useState(false)
    const [teams, setTeams] = useState([])
    const [roles, setRoles] = useState([])

    async function getUserListData(param) {
        try {
            await getUserList(
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
            // setIsLoading(false);
        }
    }

    const handleSubmitAddData = async (values) => {
        const teamName = teams.find((item) => item.value === Number(values.team))
        const roleName = roles.find((item) => item.value === Number(values.role))

        try {
            setIsLoading(true)
            let theResponse

            theResponse = await UserApi.addUser(
                values.user_name,
                values.email,
                values.password,
                roleName.label,
                teamName.label
            )

            navigate('/user-management')

            setCreateEditMessage(
                theResponse.data,
                'Success Inserting User Data',
                'Error Inserting User Data!'
            )

            getUserListData({ ...activeFilter, page: 1, size: 8 })
            setActiveFilter({
                ...activeFilter,
                page: 1,
                size: 8,
            })
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
            setIsLoading(false)
        }
    }

    const onSelectedTeamChange = async (teamId) => {
        setIsTeamSelected(true)
        form.setFieldsValue({ role: undefined })

        const { data } = await RoleApi.getByTeam(teamId)

        const mapRole = data.map((item) => ({
            value: item.id,
            label: item.name,
        }))

        setRoles(mapRole)
    }

    useEffect(() => {
        if (teamList && teamList.currentElements) {
            const mapTeam = teamList.currentElements.map((item) => ({
                value: item.id,
                label: item.name,
            }))

            setTeams(mapTeam)
        }
    }, [teamList])

    return (
        <Modal
            title="Add New User"
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
                    loading={isLoading}>
                    Ok
                </Button>,
            ]}>
            <Form
                layout="vertical"
                form={form}
                id="myForm"
                onFinish={handleSubmitAddData}>
                <Form.Item
                    label="User Name"
                    name="user_name"
                    rules={[{ required: true }]}>
                    <Input size="large" placeholder="Input User Name" />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: 'email' }]}>
                    <Input size="large" placeholder="Input Email" />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true }]}>
                    <Input.Password size="large" placeholder="Input Password" />
                </Form.Item>
                <Form.Item label="Team" name="team" rules={[{ required: true }]}>
                    <SelectDropdown
                        options={teams}
                        placeHolder={'Select Team'}
                        withoutOnchange={true}
                        onChange={onSelectedTeamChange}
                    />
                </Form.Item>
                <Form.Item label="Role" name="role" rules={[{ required: true }]}>
                    <SelectDropdown
                        options={roles}
                        placeHolder={'Select Role'}
                        disabled={!isTeamSelected}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const mapStateToProps = ({ roleList, teamList, userList }) => ({
    roleList,
    teamList,
    userList,
})

export default connect(mapStateToProps, { getRoleList, getTeamList, getUserList })(
    ModalAddData
)
