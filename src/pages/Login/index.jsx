import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Layout, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import AuthenticationApi from 'api/authentication'
import './style.scss'
const { Content } = Layout

export function LoginPage() {
    const navigate = useNavigate()

    const [loadingButton, seLoadingButton] = useState(false)
    async function handleLogin(payload) {
        try {
            seLoadingButton(true)
            const { data } = await AuthenticationApi.login(payload)

            const NOTIF_1DAY = true
            if (data) {
                localStorage.setItem('isAuthenticated', true)
                localStorage.setItem('access_token', data.accessToken)
                localStorage.setItem('refresh_token', data.refreshToken)
                localStorage.setItem('user_name', data.user.name)
                localStorage.setItem('user_id', data.user.id)
                localStorage.setItem('notification_unassigned', NOTIF_1DAY)
                navigate('/dashboard')
                window.location.reload()
            }
        } catch (err) {
            if (err.response.status === 400) {
                message.error("USER NOT FOUND")
            } else {
                message.error(err.response.data.message)
            }
        } finally {
            seLoadingButton(false)
        }
    }


    const handleSubmit = (values) => {
        handleLogin(values)
    }


    return (
        <Content className="login">
            <div className="login__form-wrapper">
                <div className="login__logo-container">
                    <img
                        src={`/img/logo/logo-red.png`}
                        alt="Rata Logo"
                        className="mb-45 login__logo-img"
                    />
                </div>
                <Form onFinish={handleSubmit} className="login-form" layout="vertical">
                    <Form.Item label="Email" name="email">
                        <Input placeholder="Input your E-mail..." size="large" />
                    </Form.Item>

                    <Form.Item label="Password" name="password">
                        <Input
                            type="password"
                            placeholder="Input your Password..."
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            // type="danger"
                            htmlType="submit"
                            loading={loadingButton}
                            size="large"
                            style={{ color: 'white', border: 'transparent' }}
                            className="login__submit-btn mt-20 text-white">
                            <div className="fw-bold text-sm">Log in</div>
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Content>
    )
}

export default LoginPage
