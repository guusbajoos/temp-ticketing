/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useContext } from 'react'
import { Layout, message, Tooltip, Input } from 'antd'
import { connect } from 'react-redux'
import { isEqual, isEmpty } from 'lodash'
import TableGlobal from 'components/Table'
// import { AuthenticationContext } from 'contexts/Authentication'

import moment from 'moment'
import {
    getTicketListV2,
    getRecentClosedTickets,
    getSearchInActiveTickets,
} from 'store/action/TicketAction'
import { getTeamList } from 'store/action/TeamAction'
import { usePrevious } from 'utils/hooks'
import { getUserList, getUserById } from 'store/action/UserAction'
import { queryStringify, removeEmptyAttributes } from 'utils'
import './index.scss'
import SearchInactiveTickets from './component/SearchInActiveTickets'
import { SelectOutlined } from '@ant-design/icons'
import { useSearchInactiveTickets } from './hooks/useSearchInactiveTickets'
import { useLocation, useNavigate } from 'react-router-dom'

const { Content } = Layout

export function TicketTable({
    ticketRecentClosed,
    getRecentClosedTickets,
    ticketListSearchInActive,
    getSearchInActiveTickets,
}) {
    const navigate = useNavigate()
    const location = useLocation()
    // const { handleRefreshToken } = useContext(AuthenticationContext);
    const { pathname } = location

    const [activeFilter, setActiveFilter] = useState({
        page: 1,
        size: 10,
        status: 'CLOSED',
        keyword: '',
    })

    const [editTable, setEditTable] = useState(false)
    const [showFilter, setShowFilter] = useState(false)
    const innerRef = useRef(null)
    const [statusSubmit, setStatusSubmit] = useState(false)

    const [isSearchChange, setIsSearchChange] = useState(false)
    const [showInput, setShowInput] = useState(false)
    const prevShowInput = usePrevious(showInput)
    const prevSearchChange = usePrevious(isSearchChange)

    let { currentElements: data } = ticketRecentClosed
    let {
        currentElements: dataSearchInActiveTicket,
        totalElements: totalElementSearchInActiveTicket,
        totalPage: totalPageSearchInActiveTicket,
    } = ticketListSearchInActive
    const RECENTCLOSEDTICKETS = pathname.includes('recent-closed-tickets')
    const SEARCHINACTIVETICKETS = pathname.includes('search-inactive-tickets')
    const [resultKeyword, setResultKeyword] = useState('')

    const [rowSelected, setRowSelected] = useState([])
    const [loadingPage, setLoadingPage] = useState(false)
    //   const prevActiveFilter = usePrevious(activeFilter);
    const [limit, setLimit] = useState(10)

    const editTicket = true

    const onTableChange = async (pagination, filters, sorter) => {
        setActiveFilter({
            ...activeFilter,
            page: pagination.current,
            size: pagination.pageSize,
            resultKeyword,
        })
    }

    async function getRecentClosedTicketsData(size) {
        try {
            setLoadingPage(true)
            await getRecentClosedTickets(size)
        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    //   // handleRefreshToken();
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

    async function getSearchInActiveTicketsData(keyword, status, page, size) {
        try {
            setLoadingPage(true)

            await getSearchInActiveTickets(
                queryStringify({
                    page: activeFilter.page,
                    size: activeFilter.size,
                    status: status,
                    keyword: resultKeyword,
                    //   sort: 'closed_at,DESC',
                })
            )
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

    useEffect(() => {
        if (pathname.includes('recent-closed-tickets')) {
            getRecentClosedTicketsData(limit)
        } else if (pathname.includes('search-inactive-tickets')) {
            if (statusSubmit) {
                getSearchInActiveTicketsData(resultKeyword, activeFilter.status)
            }
            return () => {
                setLoadingPage(false)
            }
        }
    }, [limit, activeFilter])

    useEffect(() => {
        if (!isEqual(prevShowInput, showInput)) {
            if (showInput) {
                setIsSearchChange(false)
            }
        }
    }, [showInput])

    useEffect(() => {
        if (
            !isEqual(prevSearchChange, isSearchChange) ||
            !isEqual(prevShowInput, showInput)
        ) {
            if (!showInput && isSearchChange) {
                getSearchInActiveTicketsData(resultKeyword, activeFilter.status, 1, 10)
            }
        }
    }, [isSearchChange, showInput])

    const handleEditTable = () => {
        setEditTable(!editTable)
    }

    const handleChangeStatus = async (val) => {
        setActiveFilter({
            ...activeFilter,
            status: val,
        })
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelected(selectedRows)
        },
    }

    const onSearchChange = async (value) => {
        setLoadingPage(true)
        setStatusSubmit(true)
        await getSearchInActiveTickets(
            queryStringify({
                page: activeFilter.page,
                size: activeFilter.size,
                status: activeFilter.status,
                keyword: value,
            })
        )
        setLoadingPage(false)
    }

    const onInputChange = async (value) => {
        const convertValue = value
        setResultKeyword(convertValue)
    }

    const handleOnlickSearch = () => {
        setStatusSubmit(true)
        setIsSearchChange(true)
        if (resultKeyword === '') {
            message.info(`Show All Ticket Status ${activeFilter.status}`)
            getSearchInActiveTicketsData(
                resultKeyword,
                activeFilter.status,
                activeFilter.page,
                activeFilter.size
            )
        } else {
            getSearchInActiveTicketsData(
                resultKeyword,
                activeFilter.status,
                activeFilter.page,
                activeFilter.size
            )
        }
    }

    const generateTitle = () => {
        if (pathname.includes('recent-closed-tickets')) {
            return 'Recent Closed Tickets'
        } else if (pathname.includes('search-inactive-tickets')) {
            return 'Search Inactive Tickets'
        }
    }

    const tableColumns = [
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
                {pathname.includes('recent-closed-tickets') && (
                    <TableGlobal
                        tableName={generateTitle()}
                        inputPlaceholder={'Search Ticket Here...'}
                        originalData={!isEmpty(ticketRecentClosed) ? data : []}
                        isFilter={false}
                        onInputChange={onInputChange}
                        tableColumns={tableColumns}
                        isSearch={false}
                        editTable={editTable}
                        handleEditTable={handleEditTable}
                        showFilter={showFilter}
                        setShowFilter={setShowFilter}
                        innerRef={innerRef}
                        onTableChange={onTableChange}
                        rowSelection={rowSelection}
                        recordKey={(record) => record.id}
                        rowSelected={rowSelected}
                        showInput={showInput}
                        setShowInput={setShowInput}
                        exportCsvIsExist={false}
                        isLoading={loadingPage}
                        isFilterSearchSelect={SEARCHINACTIVETICKETS}
                        isFilterSizeLimit={RECENTCLOSEDTICKETS}
                        limit={limit}
                        setLimit={setLimit}
                        usePagination={false}
                    />
                )}
            </Content>
        </Layout>
    )
}

const mapStateToProps = ({
    ticketRecentClosed,
    ticketListSearchInActive,
    userById,
    userList,
    teamList,
}) => ({
    ticketRecentClosed,
    ticketListSearchInActive,
    userById,
    userList,
    teamList,
})

export default connect(mapStateToProps, {
    getTicketListV2,
    getSearchInActiveTickets,
    getRecentClosedTickets,
    getTeamList,
    getUserList,
    getUserById,
})(TicketTable)
