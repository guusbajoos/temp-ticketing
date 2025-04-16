/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'antd'
import Chart from 'react-google-charts'

import { connect } from 'react-redux'

import { getReportDashboard } from 'store/action/ReportAction'
import { PageSpinner } from 'components/PageSpinner'

export function SubCategory({ dashboardReport, overview }) {
    const [items, setItems] = useState({
        topSubCategory1: [],
        topSubCategory2: [],
    })

    const [business, setBusiness] = useState([])

    useEffect(() => {
        if (dashboardReport.topSubCategory1 && dashboardReport.topSubCategory2) {
            const topSubCategory1 = dashboardReport.topSubCategory1.map((item) => [
                `${item.subCategory1}: ${item.total}`,
                item.total,
            ])
            const topSubCategory2 = dashboardReport.topSubCategory2.map((item) => [
                `${item.subCategory2}: ${item.total}`,
                item.total,
            ])

            setItems({
                topSubCategory1: topSubCategory1,
                topSubCategory2: topSubCategory2,
            })
        }
    }, [dashboardReport])

    useEffect(() => {
        if (dashboardReport.businessUnit && dashboardReport.businessUnit) {
            const businessUnit = dashboardReport.businessUnit.map((item) => [
                `${item.business_unit}: ${item.total}`,
                item.total,
            ])

            setBusiness(businessUnit)
        }
    }, [dashboardReport])

    const total = overview?.reduce((accumulator, item) => accumulator + item[1], 0)

    return (
        <>
            <Row gutter={74} className="mb-40 dashboard__sub-category">
                <Col span={24}>
                    <div className="fw-bold text-md mb-20">Overview</div>
                    <div className="panel panel--secondary">
                        {total === 0 ? (
                            <div style={{
                                width: "100%",
                                height: "650px",
                                display: 'flex',
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>No Data</div>
                        ) : (
                            <Chart
                                width={'100%'}
                                height={'650px'}
                                chartType="PieChart"
                                loader={
                                    <PageSpinner className="page-spinner--dashboard-subcategory" />
                                }
                                data={[['Informasi', 'Keluhan'], ...overview]}
                                rootProps={{ 'data-testid': '1' }}
                                options={{
                                    backgroundColor: '#fafafa',
                                }}
                            />
                        )}

                    </div>
                </Col>
                <Col span={24}>
                    <div className="fw-bold text-md mb-20">Business Unit</div>
                    <div className="panel panel--secondary">
                        {total === 0 ? (
                            <div style={{
                                width: "100%",
                                height: "650px",
                                display: 'flex',
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>No Data</div>
                        ) : (
                            <Chart
                                width={'100%'}
                                height={'550px'}
                                chartType="PieChart"
                                loader={
                                    <PageSpinner className="page-spinner--dashboard-subcategory" />
                                }
                                data={[['Business Unit', 'Keluhan'], ...business]}
                                rootProps={{ 'data-testid': '1' }}
                                options={{
                                    backgroundColor: '#fafafa',
                                }}
                            />
                        )}

                    </div>
                </Col>
                <Col span={12}>
                    <div className="fw-bold text-md mb-20">Top 5 Sub Category 1</div>
                    <div className="panel panel--secondary">
                        <Chart
                            width={'100%'}
                            height={'350px'}
                            chartType="PieChart"
                            loader={
                                <PageSpinner className="page-spinner--dashboard-subcategory" />
                            }
                            data={[['Task', 'Hours per Day'], ...items.topSubCategory1]}
                            rootProps={{ 'data-testid': '1' }}
                        />
                    </div>
                </Col>
                <Col span={12}>
                    <div className="fw-bold text-md mb-20">Top 5 Sub Category 2</div>
                    <div className="panel panel--secondary">
                        <Chart
                            width={'100%'}
                            height={'350px'}
                            chartType="PieChart"
                            loader={
                                <PageSpinner className="page-spinner--dashboard-subcategory" />
                            }
                            data={[['Task', 'Hours per Day'], ...items.topSubCategory2]}
                            rootProps={{ 'data-testid': '1' }}
                        />
                    </div>
                </Col>
            </Row>
        </>
    )
}

const mapStateToProps = ({ dashboardReport }) => ({ dashboardReport })

export default connect(mapStateToProps, { getReportDashboard })(SubCategory)
