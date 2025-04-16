/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useContext } from 'react'
import { Layout, message, Modal, Tooltip } from 'antd'
import { SelectOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { isEqual, isEmpty } from 'lodash'

import RoleApi from 'api/role'
import TableGlobal from 'components/Table'
import { getRoleList } from 'store/action/RoleAction'
import { queryStringify, removeEmptyAttributes, checkPrivileges } from '../../utils'
import { usePrevious } from '../../utils/hooks'
// import { AuthenticationContext } from 'contexts/Authentication'
import { getUserById } from 'store/action/UserAction'

import ModalAddData from './component/ModalAdd'
import { getTeamList } from '../../store/action/TeamAction'
import { useNavigate } from 'react-router-dom'

const { Content } = Layout
const { confirm } = Modal

export function RoleList({
    roleList,
    getRoleList,
    userById,
    getTeamList,
    getUserById,
}) {
    const navigate = useNavigate()
    const [editTable, setEditTable] = useState(false)
    const [showFilter, setShowFilter] = useState(false)
    const innerRef = useRef(null)
    const [activeFilter, setActiveFilter] = useState({
        name: [],
        page: 1,
        size: 10,
    })
    // const { handleRefreshToken } = useContext(AuthenticationContext);
    const [loadingPage, setLoadingPage] = useState(true)
    const [rowSelected, setRowSelected] = useState([])
    const [showModalAddData, setShowModalAddData] = useState(false)
    const prevActiveFilter = usePrevious(activeFilter)
    const [isSearchChange, setIsSearchChange] = useState(false)
    const [showInput, setShowInput] = useState(false)
    const prevShowInput = usePrevious(showInput)
    const prevSearchChange = usePrevious(isSearchChange)

    const { currentElements, totalElements, totalPage } = roleList

    const createRole = checkPrivileges(userById, 11)
    const deleteRole = checkPrivileges(userById, 13)
    const editRole = checkPrivileges(userById, 12)
    const userId = localStorage.getItem('user_Id')

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
            getRoleListData(activeFilter)
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
                getRoleListData({ ...activeFilter, page: 1, size: 10 })
            }
        }
    }, [isSearchChange, showInput])

    async function getRoleListData(activeFilterValue) {
        try {
            setLoadingPage(true)

            await getRoleList(
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

    async function getUserId() {
        await getUserById(localStorage.getItem('user_id'))
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

    useEffect(() => {
        getTeamListData()
        getUserId()
    }, [])

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
        getRoleListData(
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
        const getRoleId = rowSelected.map((value) => value.id)
        const getRoleName = rowSelected.map((value) => value.name)
        const getRoleIdToString = getRoleId.join(',')
        const getRoleNameToString = getRoleName.join(',')

        confirm({
            title: `Are you sure delete this role data?`,
            okText: 'Yes',
            okType: 'danger',
            width: 520,
            content: `If you click "Yes", then role data with name ${getRoleNameToString} will be deleted`,
            cancelText: 'No',
            onOk() {
                async function deletingRole() {
                    try {
                        await RoleApi.deleteRoleList(getRoleIdToString)
                        getRoleListData({ ...activeFilter, page: 1, size: 10 })
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
    //   return editRole ? `/role/edit?id=${record.id}` : '/role';
    // };

    const tableColumns = [
        {
            title: 'Role',
            key: 'name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Team',
            key: 'team',
            render: function (record) {
                if (!isEmpty(record.teams)) {
                    return record.teams[0].name
                }
                return ''
            },
        },
        {
            ...(editRole && {
                title: 'Action',
                render: (row) => (
                    <Tooltip title="Open in New Tab">
                        <a
                            href={`role/edit?id=${row.id}`}
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
                    tableName={'List of Roles'}
                    inputPlaceholder={'Search Role Here...'}
                    paginationPage={activeFilter.page}
                    paginationSize={activeFilter.size}
                    onTableChange={onTableChange}
                    originalData={!isEmpty(roleList) ? currentElements : []}
                    totalPage={!isEmpty(roleList) ? totalPage : 0}
                    totalData={!isEmpty(roleList) ? totalElements : 0}
                    csvName={'role-list.csv'}
                    exportCsvIsExist={false}
                    onInputChange={onInputChange}
                    addDataTable={createRole ? true : false}
                    isFilter={false}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    tableColumns={tableColumns}
                    editTable={editTable}
                    handleEditTable={handleEditTable}
                    editableTable={deleteRole ? true : false}
                    activeFilterComponent={<></>}
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                    innerRef={innerRef}
                    isSearch
                    handleShowAddData={handleShowModalAddData}
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

const mapStateToProps = ({ roleList, userById, teamList }) => ({
    roleList,
    userById,
    teamList,
})

export default connect(mapStateToProps, {
    getRoleList,
    getUserById,
    getTeamList,
})(RoleList)
