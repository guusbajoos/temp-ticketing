import React from 'react'
import { Col, Layout, Row, Typography } from 'antd'

import { EnterOutlined } from '@ant-design/icons'

import '../styles/index.scss'

const { Content } = Layout

export function DetailReadOnlyGlobal({
    detailName,
    detailComponent,
    detailTitle,
    className,
    detailId,
    detailHeaderComponent,
    isEditTicket
}) {
    return (
        <Layout className={`detail-read-only ${className}`}>
            <Content>
                <div className="mb-30 text-md detail-read-only__title">
                    {isEditTicket ? (
                        <Typography.Title level={4} style={{ marginBottom: "20px" }}>
                            Edit Ticket
                        </Typography.Title>
                    ) : ''}
                    <div className="detail-read-only__title-inner">
                        <div className="text-sm">{detailId}</div>
                        <Row align="start" justify="space-between">
                            <Col xs={20}>
                                <div className="text-lg fw-bold">
                                    <Typography.Paragraph
                                        style={{ marginBottom: 0 }}
                                        ellipsis={{
                                            expandable: true,
                                            symbol: <EnterOutlined />,
                                        }}>
                                        {detailName}
                                    </Typography.Paragraph>
                                </div>
                            </Col>
                            <Col xs={4}>
                                {detailHeaderComponent}
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="panel panel--table-detail-read-only">
                    <div className="detail-read-only__item">
                        <div className="text-center fw-bold text-lg">{detailTitle}</div>
                        {detailComponent}
                    </div>
                </div>
            </Content>
        </Layout>
    )
}

DetailReadOnlyGlobal.defaultProps = {
    className: '',
}

export default DetailReadOnlyGlobal
