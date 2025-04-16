/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import { Card, Layout, message, Typography, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'

import {
    getReportDashboard,
    getReportDashboardByType,
} from 'store/action/ReportAction'
import { getSummaryUnassignedTickets } from 'store/action/TicketAction'
import { getUserById } from 'store/action/UserAction'
import {checkPrivileges, queryStringify, removeEmptyAttributes} from '../../utils'
import { useOuterClickNotifier, usePrevious } from '../../utils/hooks'

import DailyTicket from './components/DailyTicket'
import InteractionVsComplaintRate from './components/InteractionVsComplaintRate'
import SubCategory from './components/SubCategory'
import { DatePeriod } from './components/DatePeriod'
import Tickets from './components/Tickets'
import './style.scss'
import { getTeamList } from 'store/action/TeamAction'
import TeamSelector from './components/TeamSelector'
import { isEqual } from 'lodash'
import TeamCapacity from './components/TeamCapacity'

import ReportApi from 'api/report'
import { InfoCircleOutlined } from '@ant-design/icons'
import { ClinicLocation } from './components/ClinicLocation'
import clinicReport from 'api/clinicReport'

const { Content } = Layout

// redux userById calling for setting privileges, how to implement? find out example in other component
export function DashboardList({
    getSummaryUnassignedTickets,
    getReportDashboard,
    getTeamList,
    summaryUnassignedTickets,
    userById
}) {
    const navigate = useNavigate()
    const [userShow, setUserShow] = useState(false)
    const innerRef = useRef(null)
    const handleUserShow = () => {
        localStorage.setItem('notification_unassigned', false)
        setUserShow(!userShow)
    }
    const [overviewData, setOverviewData] = useState([])
    const [dailyTickets, setDailyTickets] = useState([])
    const [weeklyTickets, setWeeklyTickets] = useState({
        percentage: [],
        data: [],
    })
    const [isLoadingPage, setIsLoadingPage] = useState(true)

    const [activeFilter, setActiveFilter] = useState({
        minDate: moment().startOf('week').format('YYYY-MM-DD'),
        maxDate: moment().endOf('week').format('YYYY-MM-DD'),
    })
    const prevActiveFilter = usePrevious(activeFilter)
    const viewDashboardAgentCapacity = checkPrivileges(userById, 41);

    async function getReportDashboardData(activeFilterValue) {
        try {
            setIsLoadingPage(true)

            await getReportDashboard(
                queryStringify(
                    removeEmptyAttributes({
                        ...activeFilterValue,
                    })
                )
            )
        } catch (err) {
            return
        } finally {
            setIsLoadingPage(false)
        }
    }

    async function getSummaryUnassignedTicketsData() {
        try {
            await getSummaryUnassignedTickets(localStorage.getItem('user_id'))
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
        }
    }

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

    const fetchReportDashboardBy = async (type) => {
        if (type === 'daily') {
            let infoTemp = 0
            let complaintTemp = 0

            const minDate = activeFilter.minDate || ''
            const maxDate = activeFilter.maxDate || ''
            const params = `minDate=${minDate}&maxDate=${maxDate}`
            const { data } = await ReportApi.getReportDashboardByType(type, params)

            const result = data.dashboardDaily.map((item) => [
                item.theDate,
                item.infoCount,
                item.complaintCount,
                item.allCount,
            ])

            data.dashboardDaily.forEach((item) => {
                infoTemp += item.infoCount
                complaintTemp += item.complaintCount
            })

            const overviewResult = [
                [`Informasi: ${infoTemp}`, infoTemp],
                [`Keluhan: ${complaintTemp}`, complaintTemp],
            ]

            setDailyTickets(result)
            setOverviewData(overviewResult)
        } else {
            const minDate = moment().startOf('month').format('YYYY-MM-DD')
            const maxDate = moment().endOf('month').format('YYYY-MM-DD')
            const params = `minDate=${minDate}&maxDate=${maxDate}`
            const { data } = await ReportApi.getReportDashboardByType(type, params)

            const result = data.dashboardWeekly.map((item) => [
                item.labelMonth,
                item.infoCount,
                item.complaintCount,
            ])

            const resultPercentage = data.dashboardWeekly.map((item) => {
                return {
                    text: item.labelMonth || '',
                    value: (item.complaintCount / item.allCount) * 100 || 0,
                }
            })

            setWeeklyTickets({
                percentage: resultPercentage,
                data: result,
            })
        }
    }

    const handleClickNotification = (status) => {
        if (status === 'assign') {
            localStorage.setItem('notification_unassigned', false)
            return navigate('/unassigned-tickets')
        } else {
            localStorage.setItem('notification_unassigned', false)
            setUserShow(false)
        }
    }

    useEffect(() => {
        if (!isEqual(prevActiveFilter, activeFilter)) {
            getReportDashboardData({
                ...activeFilter,
            })

            fetchReportDashboardBy('daily')
        }
    }, [activeFilter, prevActiveFilter])

    useEffect(() => {
        fetchReportDashboardBy('daily')
        fetchReportDashboardBy('weekly')
        getSummaryUnassignedTicketsData()
        getTeamListData()
    }, [])

    // useOuterClickNotifier(handleUserShow, innerRef)

    return (
        <Content className="dashboard">
            <div className="wrapper__notification" ref={innerRef}>
                {localStorage.getItem('notification_unassigned') === 'true' ? (
                    <div
                        className={userShow ? '' : 'notification'}
                        onClick={handleUserShow}>
                        <Card
                            style={{ width: '30%' }}
                            bodyStyle={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0px 6px',
                            }}>
                            <InfoCircleOutlined
                                style={{
                                    color: '#FAAD14',
                                    marginBottom: '30px',
                                }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>
                                    <Typography.Title level={5}>
                                        Unassigned Tickets
                                    </Typography.Title>
                                    <Typography.Paragraph>
                                        There are{' '}
                                        {
                                            summaryUnassignedTickets?.data
                                                ?.totalMyTeamUnassignedTickets
                                        }{' '}
                                        unassigned tickets in your team. You need to assign them now
                                    </Typography.Paragraph>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        gap: '0px 6px',
                                    }}>
                                    <Button onClick={() => handleClickNotification('later')}>
                                        Later
                                    </Button>
                                    <Button
                                        onClick={() => handleClickNotification('assign')}
                                        type="primary">
                                        Assign
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : null}
                <div>
                    <div className="fw-bold text-md mb-40 dashboard__title panel">
                        Dashboard
                    </div>
                    <div className="panel panel--secondary">
                        <DatePeriod
                            setActiveFilter={setActiveFilter}
                            activeFilter={activeFilter}
                        />
                        <TeamSelector
                            setActiveFilter={setActiveFilter}
                            activeFilter={activeFilter}
                        />
                    </div>
                    <Tickets isLoading={isLoadingPage} />
                    <SubCategory overview={overviewData} isLoading={isLoadingPage} />
                    {/* <TeamCapacity isLoading={isLoadingPage} /> */}
                    {viewDashboardAgentCapacity && (<TeamCapacity isLoading={isLoadingPage} />)}
                    <ClinicLocation isLoading={isLoadingPage} dateFilter={activeFilter}/>
                    <DailyTicket data={dailyTickets} isLoading={isLoadingPage} />
                    <InteractionVsComplaintRate
                        data={weeklyTickets}
                        isLoading={isLoadingPage}
                    />
                </div>
            </div>
        </Content>
    )
}

const mapStateToProps = ({
    dashboardReport,
    dashboardReportByType,
    userById,
    teamList,
    summaryUnassignedTickets,
}) => ({
    dashboardReport,
    dashboardReportByType,
    userById,
    teamList,
    summaryUnassignedTickets,
})

export default connect(mapStateToProps, {
    getSummaryUnassignedTickets,
    getReportDashboard,
    getReportDashboardByType,
    getUserById,
    getTeamList,
})(DashboardList)
