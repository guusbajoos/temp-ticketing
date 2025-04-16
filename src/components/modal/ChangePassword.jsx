/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import Modal from 'antd/lib/modal/Modal'
import { Row, Col, Form, Input, Button, message } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import AuthenticationAPI from 'api/authentication'
import { useNavigate } from 'react-router-dom'
export default function ChangePassword({ open, setOpen }) {
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [form] = Form.useForm()
    const navigate = useNavigate()

    const handleOk = async (values) => {
        try {
            const payloads = {
                userId: localStorage.getItem('user_id'),
                ...values,
            }
            setConfirmLoading(true)
            await AuthenticationAPI.changePassword(payloads)
            message.success(
                'The password has been successfully changed, please login again'
            )
            setTimeout(() => {
                form.resetFields()
                setConfirmLoading(false)
                setOpen(false)


                localStorage.clear()
                sessionStorage.clear()
                navigate('/')
            }, 3000)
        } catch (error) {
            if (error.response.data.message === 'CURRENT PASSWORD NOT VALID') {
                setConfirmLoading(false)
                message.error('Old Password wrong!')
            }
        }
    }

    const handlePasswordChange = (value) => {
        const fieldName = Object.keys(value)[0]
        if (fieldName === 'passwordNew') {
            form.setFieldValue('passwordConfirmation', '')
        }
    }

    const handleCancel = () => {
        setOpen(false)
    }

    return (
        <Modal
            title="Change Password Account"
            onCancel={handleCancel}
            open={open}
            footer={[
                <Button
                    key="submit"
                    htmlType="submit"
                    type="primary"
                    loading={confirmLoading}
                    form="modal-change-password">
                    Submit
                </Button>,
            ]}
            cancelButtonProps={{ style: { display: 'none' } }}
            confirmLoading={confirmLoading}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleOk}
                onValuesChange={handlePasswordChange}
                id="modal-change-password">
                <Row>
                    <Col span={24}>
                        <Form.Item
                            label="Old Password"
                            name="passwordOld"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your old password!',
                                },
                            ]}>
                            <Input.Password
                                size="large"
                                placeholder="Input old password"
                                id="passwordOld"
                                prefix={<LockOutlined />}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            label="New Password"
                            name="passwordNew"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your new password!',
                                },
                                {
                                    message: 'Password must be more than 4 characters',
                                    validator: (_, value) => {
                                        const validateWords = value?.split('').length
                                        if (validateWords >= 4) {
                                            return Promise.resolve()
                                        } else {
                                            return Promise.reject('Some message here')
                                        }
                                    },
                                },
                            ]}>
                            <Input.Password
                                size="large"
                                placeholder="Input New password"
                                id="passwordNew"
                                prefix={<LockOutlined />}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            label="Confirm Password"
                            name="passwordConfirmation"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your confirm password!',
                                },
                                {
                                    message: 'new password doesn’t match',
                                    validator: (_, value) => {
                                        const passwordNew = form.getFieldValue('passwordNew')
                                        if (value !== passwordNew) {
                                            return Promise.reject('Some message here')
                                        } else {
                                            return Promise.resolve()
                                        }
                                    },
                                },
                            ]}>
                            <Input.Password
                                size="large"
                                placeholder="Input Confirm password"
                                id="passwordConfirmation"
                                prefix={<LockOutlined />}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}
