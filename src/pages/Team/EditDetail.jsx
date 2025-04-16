/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react'
import { Form, Tooltip, Button, Input, Row, Col, message } from 'antd'

import { connect } from 'react-redux'
import { CheckCircleOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash'

import { getTeamById } from 'store/action/TeamAction'
import { getUserById } from 'store/action/UserAction'
import DetailLayout from 'components/detail-layout/DetailReadOnly'
import { PageSpinner } from 'components/PageSpinner'
// import { AuthenticationContext } from 'contexts/Authentication'
import TeamApi from 'api/team'
import { setCreateEditMessage } from '../../utils'
import { useNavigate } from 'react-router-dom'

// redux userById calling for setting privileges, how to implement? find out example in other component
export function EditTeam({ getTeamById, teamById, userById }) {
    const navigate = useNavigate()
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    const [loadingPage, setLoadingPage] = useState(true)
    const [isLoadingButton, setIsLoadingButton] = useState(false)
    // const { handleRefreshToken } = useContext(AuthenticationContext);

    useEffect(() => {
        async function getTeamByIdData() {
            try {
                setLoadingPage(true)
                await getTeamById(id)
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

        getTeamByIdData()
    }, [])

    if (loadingPage) {
        return <PageSpinner />
    }

    const handleSubmitEditData = async (values) => {
        try {
            setIsLoadingButton(true)
            let theResponse

            theResponse = await TeamApi.updateTeam(id, values.team_name)

            navigate('/team')

            setCreateEditMessage(
                theResponse.data,
                'Success Updating User Data',
                'Error Updating User Data!'
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
            {!isEmpty(teamById) && (
                <DetailLayout
                    detailName={teamById.name}
                    className={'edit-detail edit-form'}
                    detailComponent={
                        <Form
                            layout="vertical"
                            onFinish={handleSubmitEditData}
                            initialValues={{
                                team_name: teamById.name,
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
                                <Col span={24}>
                                    <Form.Item
                                        label="Team Name"
                                        name="team_name"
                                        rules={[{ required: true }]}>
                                        <Input size="large" placeholder={'Insert Team Name'} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    }
                />
            )}
        </>
    )
}

const mapStateToProps = ({ teamById, userById }) => ({ teamById, userById })

export default connect(mapStateToProps, { getTeamById, getUserById })(EditTeam)
