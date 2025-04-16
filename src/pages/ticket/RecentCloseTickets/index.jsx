/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { SelectOutlined } from '@ant-design/icons'
import {
    Row,
    Col,
    Layout,
    message,
    Tooltip,
    Table,
    Input,
    Select,
    Button,
    Typography,
} from 'antd'
import './index.scss'
import TicketApi from 'api/ticket'
import moment from 'moment'
import { Content } from 'antd/lib/layout/layout'
import { isEmpty } from 'lodash'
import { useLocation, useNavigate } from 'react-router-dom'

export default function RecentCloseTickets() {
    const location = useLocation()
    const navigate = useNavigate()
    const { pathname } = location
    const editTicket = true
    const [recentCloseTickets, setRecentCloseTickets] = useState([])
    const [size, setSize] = useState(10)
    const [loadingPage, setLoadingPage] = useState(true)

    const getDataRecentCloseTickets = async (params) => {
        setLoadingPage(true)
        try {
            const { data } = await TicketApi.getRecentClosedTickets(params)
            setRecentCloseTickets(data?.currentElements)
            setLoadingPage(false)
        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {


                    localStorage.clear()
                    sessionStorage.clear()
                    navigate('/')
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

    useEffect(() => {
        getDataRecentCloseTickets(size)
    }, [size])

    const COLUMNS = [
        {
            title: 'Ticket Number',
            key: 'ticket number',
            dataIndex: 'number',
            sorter: (a, b) => {
                const { number } = a
                const { number: num } = b
                const numA = number.split('-').slice(-1)
                const numB = num.split('-').slice(-1)
                const resultA = numA.map((valA) => parseInt(valA))[0]
                const resultB = numB.map((valB) => parseInt(valB))[0]
                return resultA - resultB
            },
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
        {
            title: 'Title',
            key: 'title',
            dataIndex: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Patient Name',
            key: 'patient_name',
            dataIndex: 'patient_name',
            sorter: (a, b) => a.patient_name.localeCompare(b.patient_name),
        },
        {
            title: 'Created Date',
            key: 'created_at',
            dataIndex: 'created_at',
            sorter: (a, b) => a.created_at.localeCompare(b.created_at),
            render: (created_at) =>
                moment(created_at)
                    .tz('Asia/Jakarta')
                    .format('DD MMMM YYYY - HH:mm:ss A'),
        },
        {
            title: 'Closed Date',
            key: 'closed_at',
            dataIndex: 'closed_at',
            sorter: (a, b) => a.closed_at.localeCompare(b.closed_at),
            render: (closed_at) =>
                moment(closed_at)
                    .tz('Asia/Jakarta')
                    .format('DD MMMM YYYY - HH:mm:ss A'),
        },
        {
            ...(editTicket && {
                title: 'Action',
                render: (row) => (
                    <Tooltip title="Open in New Tab">
                        <a
                            href={`${pathname}/edit?id=${row.number}`}
                            rel="noopener noreferrer"
                            target="_blank">
                            <SelectOutlined style={{ transform: 'rotate(90deg)' }} />
                        </a>
                    </Tooltip>
                ),
            }),
        },
    ]

    return (
        <Layout className="wrap-table-global">
            <Content>
                <div className="panel-search-inactive-tickets">
                    <div className="panel">
                        <Row
                            gutter={20}
                            type="flex"
                            style={{ margin: '0px 10px 20px 10px' }}>
                            <Col xs={24} style={{ width: '100%' }}>
                                <strong className="text-md table-global__title">
                                    Recent Closed Tickets
                                </strong>
                            </Col>
                        </Row>
                        <Row
                            justify={'start'}
                            style={{ alignItems: 'center', margin: '0px 20px 20px 20px' }}>
                            <Col className="gutter-row" span={2}>
                                <span style={{ display: 'block' }} level={5}>
                                    Select Total Ticket:
                                </span>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Select
                                    defaultValue={10}
                                    style={{
                                        width: 65,
                                    }}
                                    onChange={(value) => setSize(value)}
                                    options={[
                                        {
                                            value: 10,
                                            label: 10,
                                        },
                                        {
                                            value: 20,
                                            label: 20,
                                        },
                                        {
                                            value: 50,
                                            label: 50,
                                        },
                                    ]}
                                />
                            </Col>
                        </Row>
                        <Table
                            rowKey={(record) => record.number}
                            dataSource={
                                !isEmpty(recentCloseTickets) ? recentCloseTickets : []
                            }
                            columns={COLUMNS}
                            pagination={false}
                            loading={{
                                tip: 'Loading...',
                                spinning: loadingPage,
                            }}
                        />
                    </div>
                </div>
            </Content>
        </Layout>
    )
}
