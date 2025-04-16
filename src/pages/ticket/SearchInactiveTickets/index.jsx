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
} from 'antd'
import './index.scss'
import { Content } from 'antd/lib/layout/layout'
import useSearchInActiveTickets from './hooks/useSearchInActiveTickets'
import { Columns } from './constant/column'
import { useLocation } from 'react-router-dom'

export function SearchInactiveTickets() {
    const location = useLocation()
    const { pathname } = location
    const { COLUMNS } = Columns(pathname)
    const {
        dataSearchInactiveTickets,
        loadingPage,
        getDataSearchInactiveTickets,
        activeFilter,
        setActiveFilter,
        tableParams,
        setTableParams,
    } = useSearchInActiveTickets()

    const [statusSubmit, setStatusSubmit] = useState(false)

    const handleTableChange = (pagination, filters, sorter) => {
        setStatusSubmit(true)
        setTableParams({
            pagination,
            filters,
            ...sorter,
        })
    }

    const handleOnKeyPressSearch = (value) => {
        const payload = {
            page: tableParams.pagination.current,
            size: tableParams.pagination.pageSize,
            status: activeFilter.status,
            keyword: value,
        }
        getDataSearchInactiveTickets(payload)
        setStatusSubmit(true)
    }

    const handleOnlickSearch = () => {
        const payload = {
            page: tableParams.pagination.current,
            size: tableParams.pagination.pageSize,
            status: activeFilter.status,
            keyword: activeFilter.keyword,
        }
        getDataSearchInactiveTickets(payload)
        setStatusSubmit(true)
    }

    const handleChangeStatus = (value) => {
        const payload = {
            page: tableParams.pagination.current,
            size: tableParams.pagination.pageSize,
            keyword: activeFilter.keyword,
            status: value,
        }
        getDataSearchInactiveTickets(payload)
    }

    return (
        <Layout className="wrap-table-global">
            <Content>
                <div className="panel-search-inactive-tickets">
                    <div className="panel">
                        <Row
                            gutter={20}
                            type="flex"
                            className="table-global__row"
                            style={{ margin: '0px 10px 20px 10px' }}>
                            <Col xs={24} style={{ width: '100%' }}>
                                <strong className="text-md table-global__title">
                                    Search Inactive Tickets
                                </strong>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignIems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            margin: '10px 0px',
                                        }}>
                                        <Input.Search
                                            placeholder={'Search Ticket Here...'}
                                            size="large"
                                            style={{
                                                '.ant-input-group-addon': { display: 'none' },
                                            }}
                                            allowClear
                                            onChange={(e) => {
                                                setActiveFilter({
                                                    ...activeFilter,
                                                    keyword: e.target.value,
                                                })
                                            }}
                                            onSearch={(value) => handleOnKeyPressSearch(value)}
                                        />
                                        <Select
                                            defaultValue="CLOSED"
                                            style={{ width: '150px', margin: '0px 8px' }}
                                            onChange={(e) => handleChangeStatus(e)}
                                            options={[
                                                {
                                                    value: 'CLOSED',
                                                    label: 'CLOSED',
                                                },
                                                {
                                                    value: 'DROPPED',
                                                    label: 'DROPPED',
                                                },
                                                {
                                                    value: 'ALL',
                                                    label: 'ALL',
                                                },
                                            ]}
                                        />
                                    </div>
                                    <Button
                                        className="mt-5"
                                        type="primary"
                                        onClick={handleOnlickSearch}>
                                        Submit
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                        <Table
                            rowKey={(record) => record.number}
                            dataSource={!statusSubmit ? [] : dataSearchInactiveTickets}
                            columns={COLUMNS}
                            pagination={!statusSubmit ? [] : tableParams.pagination}
                            loading={
                                !statusSubmit
                                    ? false
                                    : {
                                        tip: 'Loading...',
                                        spinning: loadingPage,
                                    }
                            }
                            onChange={handleTableChange}
                        />
                    </div>
                </div>
            </Content>
        </Layout>
    )
}

export default SearchInactiveTickets
