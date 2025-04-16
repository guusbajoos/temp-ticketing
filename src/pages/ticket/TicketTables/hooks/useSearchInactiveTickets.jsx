import { message } from 'antd'
import TicketApi from 'api/ticket'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { queryStringify } from 'utils'

export function useSearchInactiveTickets() {
    const navigate = useNavigate()
    const [activeFilter, setActiveFilter] = useState({
        page: 1,
        size: 10,
        status: 'CLOSED',
        keyword: '',
    })
    const [loadingPage, setLoadingPage] = useState(false)
    const [searchInactiveTickets, setSearchInactiveTickets] = useState([])
    const [totalElements, setTotalElements] = useState(0)
    const [totalPage, setTotalPage] = useState(0)

    async function getSearchInActiveTicketsData() {
        setLoadingPage(true)
        try {
            const { data } = await TicketApi.getSearchInActiveTickets(
                queryStringify({
                    page: activeFilter?.page,
                    size: activeFilter?.size,
                    status: activeFilter?.status,
                    keyword: activeFilter?.keyword,
                })
            )
            setTotalElements(data?.totalElements)
            setTotalPage(data?.totalPage)
            setSearchInactiveTickets(data?.currentElements)
            setLoadingPage(false)
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

    useEffect(() => {
        getSearchInActiveTicketsData()
    }, [activeFilter])

    return {
        searchInactiveTickets,
        SIAT_totalElements: totalElements,
        SIAT_totalPage: totalPage,
        SIAT_loadingPage: loadingPage,
        refetch_SearchInActiveTickets: getSearchInActiveTicketsData(),
    }
}
