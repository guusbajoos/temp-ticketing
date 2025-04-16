/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from 'react'
import { Layout, Button, Row, Col } from 'antd'
import { startCase } from 'lodash'
import { connect } from 'react-redux'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DownOutlined,
    UserOutlined,
    LogoutOutlined,
    LockOutlined,
} from '@ant-design/icons'

import { useOuterClickNotifier } from 'utils/hooks'
import { toggleSidebar } from 'store/action/component-action/ToggleSidebarAction'
import ModalChangePassword from 'components/modal/ChangePassword'
const { Header } = Layout

export function HeaderComponent({ isSidebarClose, toggleSidebar }) {
    const [showModalChangePassword, setShowModalChangePassword] = useState(false)
    const [userShow, setUserShow] = useState(false)
    const innerRef = useRef(null)
    const handleUserShow = () => {
        setUserShow(!userShow)
    }

    const toggleCollapsed = () => {
        toggleSidebar(!isSidebarClose)
    }

    const handleLogout = () => {
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = '/'
    }

    // useOuterClickNotifier(handleUserShow, innerRef)

    return (
        <Header className="header">
            <Row>
                <Col span={12}>
                    <Button onClick={toggleCollapsed}>
                        {React.createElement(
                            isSidebarClose ? MenuUnfoldOutlined : MenuFoldOutlined
                        )}
                    </Button>
                </Col>
                <Col span={12} type="flex" align="end">
                    <Button onClick={handleUserShow} type="text" style={{ backgroundColor: "transparent", border: "none" }}>
                        <div className="d-flex align-items-center">
                            <UserOutlined className="mr-5" />
                            <div className="fw-medium mr-5">
                                {localStorage.getItem('user_name') === null
                                    ? 'Username'
                                    : startCase(localStorage.getItem('user_name'))}
                            </div>
                            <DownOutlined className="anticon--small" />
                        </div>
                    </Button>
                </Col>
            </Row>
            {userShow && (
                <div className="header__user-content">
                    <Button
                        type="text"
                        style={{ backgroundColor: "transparent", border: "none" }}
                        className="d-flex align-items-center"
                        onClick={() => setShowModalChangePassword(true)}
                    >
                        <LockOutlined className="mr-10" />
                        Change Password
                    </Button>
                    <Button
                        type="text"
                        style={{ backgroundColor: "transparent", border: "none", margin: "8px 0px" }}
                        onClick={handleLogout}
                        className="d-flex align-items-center">

                        <LogoutOutlined className="mr-10" />
                        Logout
                    </Button>
                </div>
            )}
            <ModalChangePassword
                open={showModalChangePassword}
                setOpen={setShowModalChangePassword}
            />
        </Header>
    )
}

const mapStateToProps = ({ isSidebarClose }) => ({
    isSidebarClose,
})

export default connect(mapStateToProps, { toggleSidebar })(HeaderComponent)
