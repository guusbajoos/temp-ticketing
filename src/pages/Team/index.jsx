/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import { Layout, message, Modal, Tooltip } from 'antd'
import { SelectOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { isEqual, isEmpty } from 'lodash'

import TableGlobal from 'components/Table'
import { getUserById } from 'store/action/UserAction'
import { getTeamList } from 'store/action/TeamAction'
import TeamApi from 'api/team'
import { queryStringify, removeEmptyAttributes, checkPrivileges } from '../../utils'
import { usePrevious } from 'utils/hooks'

import ModalAddData from './component/ModalAdd'
import { useNavigate } from 'react-router-dom'

const { Content } = Layout
const { confirm } = Modal

export function TeamList({ teamList, getTeamList, userById }) {
    const navigate = useNavigate()
    const [editTable, setEditTable] = useState(false)
    const [showFilter, setShowFilter] = useState(false)
    const innerRef = useRef(null)
    const [activeFilter, setActiveFilter] = useState({
        name: [],
        page: 1,
        size: 10,
    })
    //   // const { handleRefreshToken } = useContext(AuthenticationContext);
    const [isSearchChange, setIsSearchChange] = useState(false)
    const [showInput, setShowInput] = useState(false)
    const prevShowInput = usePrevious(showInput)
    const prevSearchChange = usePrevious(isSearchChange)
    const [loadingPage, setLoadingPage] = useState(true)
    const [rowSelected, setRowSelected] = useState([])
    const [showModalAddData, setShowModalAddData] = useState(false)
    const prevActiveFilter = usePrevious(activeFilter)
    const { currentElements, totalElements, totalPage } = teamList

    const createTeam = checkPrivileges(userById, 11)
    const deleteTeam = checkPrivileges(userById, 13)
    const editTeam = checkPrivileges(userById, 12)

    const onTableChange = async (pagination, filters, sorter) => {
        setActiveFilter({
            ...activeFilter,
            ...(!isEmpty(sorter) && !isEmpty(sorter.order)
                ? {
                    sort: sorter
                        ? `${sorter.columnKey}${sorter.order === 'ascend'
                            ? ',ASC'
                            : sorter.order === 'descend'
                                ? ',DESC'
                                : ''
                        }`
                        : ``,
                }
                : {
                    sort: '',
                }),
            page: pagination.current,
            size: pagination.pageSize,
        })
    }

    useEffect(() => {
        if (!isEqual(prevActiveFilter, activeFilter)) {
            getTeamListData(activeFilter)
        }
    }, [activeFilter, prevActiveFilter])

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
                getTeamListData({ ...activeFilter, page: 1, size: 10 })
            }
        }
    }, [isSearchChange, showInput])

    async function getTeamListData(activeFilterValue) {
        try {
            setLoadingPage(true)

            await getTeamList(
                queryStringify(
                    removeEmptyAttributes({
                        ...activeFilterValue,
                    })
                )
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

    const handleEditTable = () => {
        setEditTable(!editTable)
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelected(selectedRows)
        },
    }

    const onInputChange = (value) => {
        const convertValue = value
        setIsSearchChange(true)
        getTeamListData(
            convertValue
                ? { ...activeFilter, name: [convertValue], page: 1, size: 10 }
                : { ...activeFilter, page: 1, size: 10 }
        )

        // setActiveFilter({
        //     ...activeFilter,
        //     name: convertValue ? [convertValue] : '',
        //     page: 1,
        //     size: 10,
        // })
    }

    const handleDeleteRow = async () => {
        const getTeamId = rowSelected.map((value) => value.id)
        const getTeamName = rowSelected.map((value) => value.name)
        const getTeamIdToString = getTeamId.join(',')
        const getTeamNameToString = getTeamName.join(',')

        confirm({
            title: `Are you sure delete this team data?`,
            okText: 'Yes',
            okType: 'danger',
            width: 520,
            content: `If you click "Yes", then team data with name ${getTeamNameToString} will be deleted`,
            cancelText: 'No',
            onOk() {
                async function deletingRole() {
                    try {
                        await TeamApi.deleteTeamList(getTeamIdToString)
                        getTeamListData({ ...activeFilter, page: 1, size: 10 })
                        setActiveFilter({
                            ...activeFilter,
                            page: 1,
                            size: 10,
                        })
                        setRowSelected([])
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
                deletingRole()
            },
            onCancel() { },
        })
    }

    const handleHideModalAddData = () => {
        setShowModalAddData(false)
    }

    const handleShowModalAddData = () => {
        setShowModalAddData(true)
    }

    // const handleOnRowPathname = (record) => {
    //   return editTeam ? `/team/edit?id=${record.id}` : `/team`;
    // };

    const tableColumns = [
        {
            title: 'Team',
            key: 'name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            ...(editTeam && {
                title: 'Action',
                render: (row) => (
                    <Tooltip title="Open in New Tab">
                        <a
                            href={`team/edit?id=${row.id}`}
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
                <TableGlobal
                    usePagination
                    tableName={'List of Teams'}
                    inputPlaceholder={'Search Team Here...'}
                    onInputChange={onInputChange}
                    paginationPage={activeFilter.page}
                    paginationSize={activeFilter.size}
                    onTableChange={onTableChange}
                    originalData={!isEmpty(teamList) ? currentElements : []}
                    totalPage={!isEmpty(teamList) ? totalPage : 0}
                    totalData={!isEmpty(teamList) ? totalElements : 0}
                    csvName={'team-list.csv'}
                    exportCsvIsExist={false}
                    addDataTable={createTeam ? true : false}
                    isFilter={false}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    tableColumns={tableColumns}
                    editTable={editTable}
                    handleEditTable={handleEditTable}
                    editableTable={deleteTeam ? true : false}
                    activeFilterComponent={<></>}
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                    innerRef={innerRef}
                    handleShowAddData={handleShowModalAddData}
                    // onRowPathname={handleOnRowPathname}
                    rowSelection={rowSelection}
                    isSearch
                    recordKey={(record) => record.id}
                    rowSelected={rowSelected}
                    handleDeleteRow={handleDeleteRow}
                    showInput={showInput}
                    setShowInput={setShowInput}
                    isLoading={loadingPage}
                />

                <ModalAddData
                    showModalAddData={showModalAddData}
                    handleHideModalAddData={handleHideModalAddData}
                    setShowModalAddData={setShowModalAddData}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                />
            </Content>
        </Layout>
    )
}

const mapStateToProps = ({ teamList, userById }) => ({
    teamList,
    userById,
})

export default connect(mapStateToProps, { getTeamList, getUserById })(TeamList)
