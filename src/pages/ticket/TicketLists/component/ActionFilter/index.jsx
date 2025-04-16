import { FilterOutlined, CheckCircleTwoTone, CloudDownloadOutlined } from '@ant-design/icons'
import { Row, Col, Button } from 'antd'
import Search from 'antd/lib/input/Search'
import SelectDropdown from 'components/SelectDropdown'
import { isEmpty } from 'lodash'
import React from 'react'
import './index.scss'

export default function ActionFilter({
    isInputChange,
    onInputChange,
    pathname,
    handleFilterShow,
    showFilter,
    sortingOptions,
    onSortingChange,
    selectedSorting,
    filterComponent,
    downloadTicket,
    setIsModalConfirmVisible,
    handleSortShow,
    showSort
}) {
    const decideDisplay = (showSort) => {
        if (showSort) {
            return 'block'
        }
        return 'none'
    }

    return (
        <Row className="mb-30" gutter={16}>
            <Col
                span={7}
                className={
                    `${isInputChange ? 'search-input--change' : ''} search-input` +
                    ' gutter-row'
                }>
                <Search
                    placeholder="Search"
                    allowClear
                    size="large"
                    onSearch={onInputChange}
                />
            </Col>
            {pathname.includes('unassigned-tickets') ? null : (
                <React.Fragment>
                    <Col span={2} className="gutter-row">
                        <Button
                            style={{ width: '-webkit-fill-available', display: "flex", alignItems: "center", justifyContent: "center" }}
                            size="large"
                            onClick={handleFilterShow}
                            icon={<FilterOutlined style={{ fontSize: "16px" }} />}>
                            <span style={{ fontSize: "15px" }}>Filter</span>
                            {showFilter && <CheckCircleTwoTone />}
                        </Button>
                    </Col>
                    <Col span={3} className="gutter-row">
                        <Button
                            style={{ width: '-webkit-fill-available', display: "flex", alignItems: "center", justifyContent: "center" }}
                            size="large"
                            onClick={handleSortShow}
                            icon={
                                <>
                                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_8_3456)">
                                            <path d="M7.77778 16.8333H12.2222V14.6111H7.77778V16.8333ZM0 3.5V5.72222H20V3.5H0ZM3.33333 11.2778H16.6667V9.05556H3.33333V11.2778Z" fill="#4F4F4F" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_8_3456">
                                                <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </>
                            }>
                            <span style={{ fontSize: "15px" }}>Sort</span>
                            {showSort ? <CheckCircleTwoTone /> : null}
                        </Button>
                        {showSort && (
                            <div
                                className="filter custom-filter"
                                style={{ display: decideDisplay(showSort) }}>
                                <Row type="flex" gutter={20} className="mb-15">
                                    <Col xs={12} type="flex" align="start">
                                        <div className="text-base">
                                            <strong>Sort By</strong>
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={20} className="mb-15">
                                    <Col xs={12} type="flex" align="end">
                                        <SelectDropdown
                                            options={sortingOptions}
                                            onChange={onSortingChange}
                                            placeHolder={'Sort By'}
                                            value={!isEmpty(selectedSorting) ? selectedSorting : null}
                                        />

                                    </Col>
                                </Row>
                            </div>

                        )}
                        {filterComponent}
                    </Col>
                </React.Fragment>
            )}
            <Col
                span={12}
                className="gutter-row">
                {downloadTicket ? (
                    pathname.includes('unassigned-tickets') ? (
                        <div style={{ display: "flex", justifyContent: "flex-end", width: "140%" }}>
                            <Button
                                className={'download-report__btn-dropdown'}
                                key={'download-report__btn-download'}
                                onClick={() => setIsModalConfirmVisible(true)}
                                icon={<CloudDownloadOutlined />}
                                size="large">
                                Download
                            </Button>
                        </div>
                    ) : (
                        <Button
                            style={{ float: 'right' }}
                            className={'download-report__btn-dropdown'}
                            key={'download-report__btn-download'}
                            onClick={() => setIsModalConfirmVisible(true)}
                            icon={<CloudDownloadOutlined />}
                            size="large">
                            Download
                        </Button>
                    )
                ) : null}
            </Col>
        </Row>
    )
}
