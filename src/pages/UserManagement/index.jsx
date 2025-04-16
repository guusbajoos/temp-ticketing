/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useContext } from 'react'
import { Layout, message, Modal, Tooltip } from 'antd'
import { SelectOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { isEqual, isEmpty } from 'lodash'

import TableGlobal from 'components/Table'
// import { AuthenticationContext } from 'contexts/Authentication'
import UserApi from 'api/user'
import { queryStringify, removeEmptyAttributes, checkPrivileges } from '../../utils'
import { usePrevious } from 'utils/hooks'
import { getRoleList } from 'store/action/RoleAction'
import { getUserById, getUserList } from 'store/action/UserAction'
import { getTeamList } from 'store/action/TeamAction'

import ActiveFilter from './component/ActiveFilter'
import Filter from './component/Filter'
import { headerCsv } from './helper'
import ModalAddData from './component/ModalAdd'
import { useNavigate } from 'react-router-dom'

const { Content } = Layout
const { confirm } = Modal

export function UserManagementList({
    userList,
    getUserList,
    getTeamList,
    getRoleList,
    userById,
}) {
    const navigate = useNavigate()
    const [editTable, setEditTable] = useState(false)
    const [showFilter, setShowFilter] = useState(false)
    const innerRef = useRef(null)

    const [isSearchChange, setIsSearchChange] = useState(false)
    const [showInput, setShowInput] = useState(false)
    const prevShowInput = usePrevious(showInput)
    const prevSearchChange = usePrevious(isSearchChange)
    const { currentElements, totalElements, totalPage } = userList

    const [activeFilter, setActiveFilter] = useState({
        keyword: [],
        role: [],
        isActive: [],
        team: [],
        sort: '',
        page: 1,
        size: 10,
    })

    // const { handleRefreshToken } = useContext(AuthenticationContext);
    const [rowSelected, setRowSelected] = useState([])
    const [showModalAddData, setShowModalAddData] = useState(false)
    const [loadingPage, setLoadingPage] = useState(true)
    const prevActiveFilter = usePrevious(activeFilter)

    const resetFilter = () => {
        setActiveFilter({})
    }

    const createUser = checkPrivileges(userById, 3)
    const deleteUser = checkPrivileges(userById, 5)
    const editUser = checkPrivileges(userById, 4)

    useEffect(() => {
        if (!isEqual(prevActiveFilter, activeFilter)) {
            getUserListData({
                ...activeFilter,
                page: '',
                size: '',
            })
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
                getUserListData({ ...activeFilter, keyword: [], page: 1, size: 10 })
            }
        }
    }, [isSearchChange, showInput])

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

    async function getRoleListData() {
        await getRoleList(
            queryStringify(
                removeEmptyAttributes({
                    page: 1,
                    size: Number.MAX_SAFE_INTEGER,
                    sort: 'name,ASC',
                })
            )
        )
    }

    useEffect(() => {
        getRoleListData()
    }, [])

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

    useEffect(() => {
        getTeamListData()
    }, [])

    const onRoleChange = (checkedValues) => {
        setActiveFilter({
            ...activeFilter,
            role: checkedValues,
        })
    }

    const onStatusChange = (checkedValues) => {
        setActiveFilter({
            ...activeFilter,
            isActive: [checkedValues],
        })
    }

    const onTeamChange = (checkedValues) => {
        setActiveFilter({
            ...activeFilter,
            team: checkedValues,
        })
    }

    async function getUserListData(activeFilterValue) {
        try {
            setLoadingPage(true)

            await getUserList(
                queryStringify(
                    removeEmptyAttributes({
                        ...activeFilterValue,
                    })
                )
            )
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

        getUserListData(
            convertValue
                ? { ...activeFilter, keyword: [convertValue], page: 1, size: 10 }
                : { ...activeFilter, page: 1, size: 10 }
        )

        setActiveFilter({
            ...activeFilter,
            keyword: convertValue ? [convertValue] : '',
            page: 1,
            size: 10,
        })
    }

    const handleDeleteRow = async () => {
        const getUserId = rowSelected.map((value) => value.id)
        const getUserName = rowSelected.map((value) => value.name)
        const getUserIdToString = getUserId.join(',')
        const getUserNameToString = getUserName.join(',')

        confirm({
            title: `Are you sure delete this user data?`,
            okText: 'Yes',
            okType: 'danger',
            width: 520,
            content: `If you click "Yes", then user data with name ${getUserNameToString} will be deleted`,
            cancelText: 'No',
            onOk() {
                async function deletingRole() {
                    try {
                        await UserApi.deleteUserList(getUserIdToString)
                        getUserListData({ ...activeFilter, page: 1, size: 10 })
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
    //   return editUser
    //     ? `/user-management/edit?id=${record.id}`
    //     : `/user-management`;
    // };

    const activeFilterComponent = () => {
        return (
            <ActiveFilter
                setShowFilter={setShowFilter}
                activeFilterData={activeFilter}
                setActiveFilter={setActiveFilter}
            />
        )
    }

    const filterComponent = () => {
        return (
            <Filter
                resetFilter={resetFilter}
                activeFilter={activeFilter}
                innerRef={innerRef}
                onStatusChange={onStatusChange}
                onTeamChange={onTeamChange}
                onRoleChange={onRoleChange}
            />
        )
    }

    const tableColumns = [
        {
            title: 'User Name',
            key: 'name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Email',
            key: 'email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'Status',
            key: 'isActive',
            render: (row) => (row['isActive'] ? 'Active' : 'Not Active'),
            sorter: (a, b) => a.isActive - b.isActive,
        },
        {
            ...(editUser && {
                title: 'Action',
                render: (row) => (
                    <Tooltip title="Open in New Tab">
                        <a
                            href={`user-management/edit?id=${row.id}`}
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
                    tableName={'User Management'}
                    inputPlaceholder={'Search User Here...'}
                    paginationPage={activeFilter.page}
                    paginationSize={activeFilter.size}
                    headerCsv={headerCsv}
                    originalData={!isEmpty(userList) ? currentElements : []}
                    csvName={'user-list.csv'}
                    exportCsvIsExist={true}
                    addDataTable={createUser ? true : false}
                    isFilter={true}
                    onInputChange={onInputChange}
                    totalPage={!isEmpty(userList) ? totalPage : 0}
                    totalData={!isEmpty(userList) ? totalElements : 0}
                    tableColumns={tableColumns}
                    // isReload={true}
                    editTable={editTable}
                    handleEditTable={handleEditTable}
                    editableTable={deleteUser ? true : false}
                    activeFilterComponent={activeFilterComponent()}
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                    innerRef={innerRef}
                    onTableChange={onTableChange}
                    handleShowAddData={handleShowModalAddData}
                    filterComponent={filterComponent()}
                    isSearch={true}
                    // onRowPathname={handleOnRowPathname}
                    rowSelection={rowSelection}
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

const mapStateToProps = ({ userList, userById }) => ({
    userList,
    userById,
})

export default connect(mapStateToProps, {
    getUserList,
    getRoleList,
    getTeamList,
    getUserById,
})(UserManagementList)
