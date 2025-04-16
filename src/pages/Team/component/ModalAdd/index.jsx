import React, { useState } from 'react'
import { Modal, Input, Form, Button, message } from 'antd'
import { useNavigate } from 'react-router'
import { connect } from 'react-redux'

import TeamApi from 'api/team'
import { setCreateEditMessage } from '../../../../utils'
import { getTeamList } from 'store/action/TeamAction'

export const ModalAddData = ({

    showModalAddData,
    handleHideModalAddData,
    getTeamList,
    setShowModalAddData,
    setActiveFilter,
    activeFilter,
}) => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [form] = Form.useForm()

    async function getTeamListData() {
        try {
            await getTeamList()
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

    const handleSubmitAddData = async (values) => {
        try {
            setIsLoading(true)
            let theResponse

            theResponse = await TeamApi.addTeam(values.team_name)

            navigate('/team')

            setCreateEditMessage(
                theResponse.data,
                'Success Inserting Team Data',
                'Error Inserting Team Data!'
            )
            form.resetFields()
            getTeamListData({ ...activeFilter, page: 1, size: 8 })
            setActiveFilter({
                ...activeFilter,
                page: 1,
                size: 8,
            })
            setShowModalAddData(false)
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

    return (
        <Modal
            title="Add New Team"
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
                form={form}
                layout="vertical"
                id="myForm"
                onFinish={handleSubmitAddData}>
                <Form.Item
                    label="Team Name"
                    name="team_name"
                    rules={[{ required: true }]}>
                    <Input size="large" placeholder="Team Name" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const mapStateToProps = ({ teamList }) => ({
    teamList,
})

export default connect(mapStateToProps, { getTeamList })(ModalAddData)
