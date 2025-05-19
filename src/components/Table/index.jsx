import React, { useEffect, useState } from "react";
import { Col, Row, Table, Button, Tooltip, Input, Select } from "antd";
import {
  CloseOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  SearchOutlined,
  LockOutlined,
  UnlockOutlined,
  PlusOutlined,
  CloudDownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { isEmpty } from "lodash";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router";
import { PDFDownloadLink } from "@react-pdf/renderer";
// import PropTypes from 'prop-types';

// import { PageSpinner } from 'components/PageSpinner';

import { useOuterClickNotifier } from "utils/hooks";

import "./styles/index.scss";

const { Search } = Input;

export function TableGlobal({
  onSearchChange,
  handleChangeStatus,
  handleOnlickSearch,
  isFilterSearchSelect,
  usePagination,
  limit,
  setLimit,
  isFilterSizeLimit,
  isSearch,
  rowSelected,
  editTable,
  inputPlaceholder,
  // clickNew
  // onRowPathname,
  filterComponent,
  isFilter,
  activeFilterComponent,
  innerRef,
  rowSelection,
  editableTable,
  handleEditTable,
  headerCsv,
  originalData,
  onInputChange,
  setShowInput,
  showInput,
  totalData,
  tableColumns,
  tableName,
  handleSelectRowAction,
  MyDocument,
  paginationPage,
  paginationSize,
  onTableChange,
  recordKey,
  csvName,
  showFilter,
  setShowFilter,
  handleDeleteRow,
  //
  exportCsvIsExist,
  classCustom,
  addDataTable,
  handleShowAddData,
  isReload,
  handleReload,
  isLoading,
}) {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(originalData);
  }, [originalData]);

  const handleShowSearch = () => {
    setShowInput(!showInput);
    setShowFilter(false);
  };

  const handleFilterShow = () => {
    setShowFilter(!showFilter);
    setShowInput(false);
  };

  // useOuterClickNotifier(handleFilterShow, innerRef)

  return (
    <div
      className={`panel ${classCustom ? classCustom : ""} ${
        filteredData.length > 8 ? "" : "panel--table-global"
      }`}
    >
      <Row
        gutter={isFilterSearchSelect ? 20 : 28}
        type="flex"
        className="table-global__row"
      >
        <Col xs={isFilterSearchSelect ? 24 : 12}>
          <div className="mb-15">
            {showInput ? (
              <div className="table-global__search">
                <Search
                  placeholder={inputPlaceholder}
                  onSearch={onInputChange}
                  className="table-global__search-input"
                />
              </div>
            ) : (
              <>
                <strong className="text-md table-global__title">
                  {tableName}
                </strong>
                <div style={{ marginTop: 10, width: "100%" }}>
                  {isFilterSearchSelect && (
                    <div
                      style={{
                        display: "flex",
                        alignIems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Input.Search
                          placeholder={inputPlaceholder}
                          size="large"
                          style={{
                            ".ant-input-group-addon": { display: "none" },
                          }}
                          allowClear
                          onChange={(e) => onInputChange(e.target.value)}
                          onSearch={(value) => onSearchChange(value)}
                        />
                        <Select
                          defaultValue="CLOSED"
                          style={{ width: "150px", margin: "0px 8px" }}
                          onChange={handleChangeStatus}
                          options={[
                            {
                              value: "CLOSED",
                              label: "CLOSED",
                            },
                            {
                              value: "DROPPED",
                              label: "DROPPED",
                            },
                            // {
                            //   value: 'ARCHIVED',
                            //   label: 'Archived',
                            // },
                            {
                              value: "ALL",
                              label: "ALL",
                            },
                          ]}
                        />
                      </div>
                      <div>
                        <Button type="primary" onClick={handleOnlickSearch}>
                          Submit
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                {isFilterSizeLimit && (
                  <Row
                    style={{ marginTop: "15px" }}
                    gutter={16}
                    align="middle"
                    type="flex"
                  >
                    <Col span={16} style={{ flex: "none" }}>
                      <strong className="text-sm fw-normal">
                        Select Total Ticket:
                      </strong>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Select
                        defaultValue={limit}
                        style={{ width: 70 }}
                        onChange={(value) => setLimit(value)}
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
                )}
              </>
            )}
          </div>
        </Col>
        <Col xs={12} type="flex" align="end">
          {!isEmpty(rowSelected) ? (
            handleSelectRowAction ? (
              <Tooltip title="Select">
                <PDFDownloadLink
                  document={<MyDocument />}
                  fileName={"Print-Multiple-Label"}
                >
                  <Button
                    onClick={handleSelectRowAction}
                    icon={<CheckCircleOutlined />}
                    className="mr-10"
                  />
                </PDFDownloadLink>
              </Tooltip>
            ) : (
              <Tooltip title="Delete">
                <Button
                  onClick={handleDeleteRow}
                  icon={<DeleteOutlined />}
                  className="mr-10"
                />
              </Tooltip>
            )
          ) : (
            <>
              {isSearch && (
                <Tooltip title="Search">
                  <Button
                    onClick={handleShowSearch}
                    icon={showInput ? <CloseOutlined /> : <SearchOutlined />}
                    className="mr-10"
                  />
                </Tooltip>
              )}

              {isFilter && (
                <Tooltip title="Filter">
                  <Button
                    icon={<FilterOutlined />}
                    className="mr-10"
                    onClick={handleFilterShow}
                  />
                </Tooltip>
              )}

              {addDataTable && (
                <Tooltip title="Add Data">
                  <Button
                    icon={<PlusOutlined />}
                    className="mr-10"
                    onClick={handleShowAddData}
                  />
                </Tooltip>
              )}

              {showFilter && filterComponent}

              {editableTable && (
                <Tooltip title="Edit Data">
                  {editTable ? (
                    <Button
                      icon={<UnlockOutlined />}
                      className="mr-10"
                      onClick={handleEditTable}
                    />
                  ) : (
                    <Button
                      icon={<LockOutlined />}
                      className="mr-10"
                      onClick={handleEditTable}
                    />
                  )}
                </Tooltip>
              )}

              {exportCsvIsExist && (
                <Tooltip title="Download CSV">
                  <CSVLink
                    filename={csvName}
                    headers={headerCsv}
                    data={filteredData}
                  >
                    <CloudDownloadOutlined
                      className="mr-10"
                      style={{ fontSize: "20px" }}
                    />
                  </CSVLink>
                </Tooltip>
              )}

              {isReload && (
                <Tooltip title="Reload">
                  <Button icon={<ReloadOutlined />} onClick={handleReload} />
                </Tooltip>
              )}
            </>
          )}
        </Col>
      </Row>

      {activeFilterComponent}

      <Table
        dataSource={filteredData}
        rowSelection={editTable ? rowSelection : ""}
        onChange={onTableChange}
        pagination={
          usePagination
            ? {
                total: totalData, // total all data
                current: paginationPage, //current page
                pageSize: paginationSize, //size data per page
                showSizeChanger: totalData > 10,
                pageSizeOptions: ["10", "20", "50", "100"],
              }
            : false
        }
        rowKey={recordKey}
        columns={tableColumns}
        loading={{
          tip: "Loading...",
          spinning: isLoading,
        }}
        showSizeChanger
        // onRow={
        //   clickNewHistory
        //     ? (record) => ({
        //         onClick: () =>
        //           navigate({
        //             pathname: onRowPathname(record),
        //             data: record,
        //           }),
        //       })
        //     : (record) => ({
        //         onClick: (e) => {
        //           onRowPathname(record, e);
        //         },
        //       })
        // }
        className="table-global__item"
      />
    </div>
  );
}

TableGlobal.defaultProps = {
  exportCsvIsExist: true,
  clickNewHistory: true,
  scrollX: 800,
  isFilter: true,
  isReload: false,
  totalData: 20,
};

export default TableGlobal;
