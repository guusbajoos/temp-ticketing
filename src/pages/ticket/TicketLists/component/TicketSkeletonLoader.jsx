import { Row, Col, Checkbox, Typography } from 'antd';
import React from 'react';
import { ClockCircleOutlined, CarryOutOutlined } from '@ant-design/icons';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

export default function TicketSkeleton() {
  return (
    <Row gutter={20}>
      <section className="scroll-card-horizontal">
        {[0, 1, 2, 3, 4].map((v, key) => (
          <Col key={key} xs={6} className="drag-drop-card-list">
            <div className="panel panel--drag-drop-card">
              <Row gutter={20} type="flex" className="drag-drop-card mb-25">
                <Col xs={12}>
                  <div
                    className={
                      'ticket-skeleton ticket-skeleton-bucket-name'
                    }></div>
                </Col>
              </Row>
              <div className="drag-drop-card__content">
                <Checkbox.Group style={{ width: '100%' }}>
                  <div
                    style={{
                      height: 'calc(100vh - 300px)',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                    }}>
                    <AutoSizer>
                      {({ height, width }) => (
                        <FixedSizeList
                          height={height}
                          width={width}
                          itemCount={4}
                          itemSize={4}>
                          {({ index, style }) => {
                            return (
                              <div style={style}>
                                <div
                                  className="drag-drop-card__content-item"
                                  style={{
                                    margin: '20px 0px',
                                  }}>
                                  <Row type="flex" className="mb-10">
                                    <Col span={12}>
                                      <div
                                        className={`text-caption color-text-secondary ticket-skeleton ticket-skeleton-numbers`}></div>
                                    </Col>
                                    <Col span={12} type="flex" align="end">
                                      <div className="badge-label mr-5 bg-danger ticket-skeleton ticket-skeleton-badge"></div>
                                    </Col>
                                  </Row>

                                  <div
                                    style={{ height: '44px' }}
                                    className="color-text-primary mb-10 fw-medium text-wrap ticket-skeleton ticket-skeleton-title">
                                    <Typography.Paragraph
                                      ellipsis={{ rows: 2, expandable: false }}>
                                      {/* Ant Design, a design language for background applications, is
                  refined by Ant UED Team. */}
                                    </Typography.Paragraph>
                                  </div>
                                  <div className="color-text-secondary text-ellipsis ticket-skeleton ticket-skeleton-patient">
                                    <span className="fw-medium"></span>
                                  </div>
                                  <div className="mb-10 color-text-secondary ticket-skeleton ticket-skeleton-assignedTo">
                                    <span className="fw-medium"></span>
                                  </div>
                                  <Row type="flex" className="mb-10">
                                    <Col span={12}>
                                      <div className="text-caption color-text-secondary ticket-skeleton ticket-skeleton-date"></div>
                                    </Col>
                                    <Col span={12}>
                                      <div
                                        className="text-caption color-text-secondary ticket-skeleton ticket-skeleton-duration"
                                        style={{ textAlign: 'end' }}></div>
                                    </Col>
                                  </Row>
                                </div>
                                <div
                                  className="drag-drop-card__content-item"
                                  style={{
                                    margin: '20px 0px',
                                  }}>
                                  <Row type="flex" className="mb-10">
                                    <Col span={12}>
                                      <div
                                        className={`text-caption color-text-secondary ticket-skeleton ticket-skeleton-numbers`}></div>
                                    </Col>
                                    <Col span={12} type="flex" align="end">
                                      <div className="badge-label mr-5 bg-danger ticket-skeleton ticket-skeleton-badge"></div>
                                    </Col>
                                  </Row>

                                  <div
                                    style={{ height: '44px' }}
                                    className="color-text-primary mb-10 fw-medium text-wrap ticket-skeleton ticket-skeleton-title">
                                    <Typography.Paragraph
                                      ellipsis={{ rows: 2, expandable: false }}>
                                      {/* Ant Design, a design language for background applications, is
                  refined by Ant UED Team. */}
                                    </Typography.Paragraph>
                                  </div>
                                  <div className="color-text-secondary text-ellipsis ticket-skeleton ticket-skeleton-patient">
                                    <span className="fw-medium"></span>
                                  </div>
                                  <div className="mb-10 color-text-secondary ticket-skeleton ticket-skeleton-assignedTo">
                                    <span className="fw-medium"></span>
                                  </div>
                                  <Row type="flex" className="mb-10">
                                    <Col span={12}>
                                      <div className="text-caption color-text-secondary ticket-skeleton ticket-skeleton-date"></div>
                                    </Col>
                                    <Col span={12}>
                                      <div
                                        className="text-caption color-text-secondary ticket-skeleton ticket-skeleton-duration"
                                        style={{ textAlign: 'end' }}></div>
                                    </Col>
                                  </Row>
                                </div>
                                <div
                                  className="drag-drop-card__content-item"
                                  style={{
                                    margin: '20px 0px',
                                  }}>
                                  <Row type="flex" className="mb-10">
                                    <Col span={12}>
                                      <div
                                        className={`text-caption color-text-secondary ticket-skeleton ticket-skeleton-numbers`}></div>
                                    </Col>
                                    <Col span={12} type="flex" align="end">
                                      <div className="badge-label mr-5 bg-danger ticket-skeleton ticket-skeleton-badge"></div>
                                    </Col>
                                  </Row>

                                  <div
                                    style={{ height: '44px' }}
                                    className="color-text-primary mb-10 fw-medium text-wrap ticket-skeleton ticket-skeleton-title">
                                    <Typography.Paragraph
                                      ellipsis={{ rows: 2, expandable: false }}>
                                      {/* Ant Design, a design language for background applications, is
                  refined by Ant UED Team. */}
                                    </Typography.Paragraph>
                                  </div>
                                  <div className="color-text-secondary text-ellipsis ticket-skeleton ticket-skeleton-patient">
                                    <span className="fw-medium"></span>
                                  </div>
                                  <div className="mb-10 color-text-secondary ticket-skeleton ticket-skeleton-assignedTo">
                                    <span className="fw-medium"></span>
                                  </div>
                                  <Row type="flex" className="mb-10">
                                    <Col span={12}>
                                      <div className="text-caption color-text-secondary ticket-skeleton ticket-skeleton-date"></div>
                                    </Col>
                                    <Col span={12}>
                                      <div
                                        className="text-caption color-text-secondary ticket-skeleton ticket-skeleton-duration"
                                        style={{ textAlign: 'end' }}></div>
                                    </Col>
                                  </Row>
                                </div>
                                <div
                                  className="drag-drop-card__content-item"
                                  style={{
                                    margin: '20px 0px',
                                  }}>
                                  <Row type="flex" className="mb-10">
                                    <Col span={12}>
                                      <div
                                        className={`text-caption color-text-secondary ticket-skeleton ticket-skeleton-numbers`}></div>
                                    </Col>
                                    <Col span={12} type="flex" align="end">
                                      <div className="badge-label mr-5 bg-danger ticket-skeleton ticket-skeleton-badge"></div>
                                    </Col>
                                  </Row>

                                  <div
                                    style={{ height: '44px' }}
                                    className="color-text-primary mb-10 fw-medium text-wrap ticket-skeleton ticket-skeleton-title">
                                    <Typography.Paragraph
                                      ellipsis={{ rows: 2, expandable: false }}>
                                      {/* Ant Design, a design language for background applications, is
                  refined by Ant UED Team. */}
                                    </Typography.Paragraph>
                                  </div>
                                  <div className="color-text-secondary text-ellipsis ticket-skeleton ticket-skeleton-patient">
                                    <span className="fw-medium"></span>
                                  </div>
                                  <div className="mb-10 color-text-secondary ticket-skeleton ticket-skeleton-assignedTo">
                                    <span className="fw-medium"></span>
                                  </div>
                                  <Row type="flex" className="mb-10">
                                    <Col span={12}>
                                      <div className="text-caption color-text-secondary ticket-skeleton ticket-skeleton-date"></div>
                                    </Col>
                                    <Col span={12}>
                                      <div
                                        className="text-caption color-text-secondary ticket-skeleton ticket-skeleton-duration"
                                        style={{ textAlign: 'end' }}></div>
                                    </Col>
                                  </Row>
                                </div>
                              </div>
                            );
                          }}
                        </FixedSizeList>
                      )}
                    </AutoSizer>
                  </div>
                </Checkbox.Group>
              </div>
            </div>
          </Col>
        ))}
      </section>
    </Row>
  );
}
