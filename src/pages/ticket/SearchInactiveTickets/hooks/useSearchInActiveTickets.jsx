/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import { queryStringify } from '../../../../utils'
import TicketApi from 'api/ticket'
import { useNavigate } from 'react-router-dom'

export default function useSearchInActiveTickets() {
    const navigate = useNavigate()
    const [loadingPage, setLoadingPage] = useState(true)
    const [dataSearchInactiveTickets, setDataSearchInactiveTickets] = useState(
        []
    )
    const [activeFilter, setActiveFilter] = useState({
        status: 'CLOSED',
        keyword: '',
    })
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    })

    async function getDataSearchInactiveTickets(params) {
        setLoadingPage(true)
        try {
            const { data } = await TicketApi.getSearchInActiveTickets(
                queryStringify(params)
            )
            setDataSearchInactiveTickets(data.currentElements)
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: 200,
                },
            })
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
        if (dataSearchInactiveTickets.length > 0) {
            let params = {
                page: tableParams.pagination.current,
                size: tableParams.pagination.pageSize,
                status: activeFilter.status,
                keyword: activeFilter.keyword,
            }
            getDataSearchInactiveTickets(params)
        }
    }, [tableParams.pagination.current, tableParams.pagination.pageSize])

    return {
        dataSearchInactiveTickets,
        loadingPage,
        setLoadingPage,
        getDataSearchInactiveTickets,
        activeFilter,
        setActiveFilter,
        tableParams,
        setTableParams,
    }
}
