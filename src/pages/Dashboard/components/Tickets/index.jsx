/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Col, Row } from 'antd';

import { connect } from 'react-redux';
import { InboxOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';

import { getReportDashboard } from 'store/action/ReportAction';
import { PageSpinner } from 'components/PageSpinner';
import './styles/index.scss';

export function Tickets({ dashboardReport, isLoading }) {
  return (
    <div className="mb-40 dashboard__ticket">
      <div className="fw-bold text-md mb-20">Summary</div>
      <Row
        type="flex"
        justify={'space-between'}
        gutter={16}
        style={{ padding: '0px' }}>
        <Col span={5} style={{ marginBottom: '20px', marginLeft: '0px' }}>
          <div className="panel panel--secondary dashboard--tickets--status-summary dashboard--tickets--status-summary__border">
            <Row type="flex" className="align-items-center">
              <Col span={4}>
                <InboxOutlined className="anticon--big" />
              </Col>
              <Col span={20}>
                {isLoading ? (
                  <PageSpinner className="page-spinner--dashboard-tickets" />
                ) : (
                  <>
                    <div className="text-base">OPEN</div>
                    <div className="fw-bold text-2xl color-text-blue">
                      {!isEmpty(dashboardReport.tickets) &&
                      dashboardReport.tickets.open
                        ? dashboardReport.tickets.open
                        : 0}
                    </div>
                  </>
                )}
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={5} style={{ marginBottom: '20px', marginLeft: '0px' }}>
          <div className="panel panel--secondary dashboard--tickets--status-summary dashboard--tickets--status-summary__border">
            <Row type="flex" className="align-items-center">
              <Col span={4}>
                <InboxOutlined className="anticon--big" />
              </Col>
              <Col span={20}>
                {isLoading ? (
                  <PageSpinner className="page-spinner--dashboard-tickets" />
                ) : (
                  <>
                    <div className="text-base">IN PROGRESS</div>
                    <div className="fw-bold text-2xl color-text-warning">
                      {!isEmpty(dashboardReport.tickets) &&
                      dashboardReport.tickets.inProgress
                        ? dashboardReport.tickets.inProgress
                        : 0}
                    </div>
                  </>
                )}
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={5} style={{ marginBottom: '20px', marginLeft: '0px' }}>
          <div className="panel panel--secondary dashboard--tickets--status-summary dashboard--tickets--status-summary__border">
            <Row type="flex" className="align-items-center">
              <Col span={4}>
                <InboxOutlined className="anticon--big" />
              </Col>
              <Col span={20}>
                {isLoading ? (
                  <PageSpinner className="page-spinner--dashboard-tickets" />
                ) : (
                  <>
                    <div className="text-base">ESCALATE</div>
                    <div className="fw-bold text-2xl color-text-purple">
                      {!isEmpty(dashboardReport.tickets) &&
                      dashboardReport.tickets.escalate
                        ? dashboardReport.tickets.escalate
                        : 0}
                    </div>
                  </>
                )}
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={5} style={{ marginBottom: '20px', marginLeft: '0px' }}>
          <div className="panel panel--secondary dashboard--tickets--status-summary dashboard--tickets--status-summary__border">
            <Row type="flex" className="align-items-center">
              <Col span={4}>
                <InboxOutlined className="anticon--big" />
              </Col>
              <Col span={20}>
                {isLoading ? (
                  <PageSpinner className="page-spinner--dashboard-tickets" />
                ) : (
                  <>
                    <div className="text-base">FEEDBACK</div>
                    <div className="fw-bold text-2xl color-text-blue-2">
                      {!isEmpty(dashboardReport.tickets) &&
                      dashboardReport.tickets.feedback
                        ? dashboardReport.tickets.feedback
                        : 0}
                    </div>
                  </>
                )}
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={5} style={{ marginBottom: '20px', marginLeft: '0px' }}>
          <div className="panel panel--secondary dashboard--tickets--status-summary dashboard--tickets--status-summary__border">
            <Row type="flex" className="align-items-center">
              <Col span={4}>
                <InboxOutlined className="anticon--big" />
              </Col>
              <Col span={20}>
                {isLoading ? (
                  <PageSpinner className="page-spinner--dashboard-tickets" />
                ) : (
                  <>
                    <div className="text-base">Follow Up</div>
                    <div className="fw-bold text-2xl color-text-priority">
                      {!isEmpty(dashboardReport.tickets) &&
                      dashboardReport.tickets.followUp
                        ? dashboardReport.tickets.followUp
                        : 0}
                    </div>
                  </>
                )}
              </Col>
            </Row>
          </div>
        </Col>{' '}
      </Row>
      <Row gutter={20}>
        <Col span={8}>
          <div className="panel panel--secondary dashboard--tickets--status-summary dashboard--tickets--status-summary__border">
            <Row type="flex" className="align-items-center">
              <Col span={4}>
                <InboxOutlined className="anticon--big" />
              </Col>
              <Col span={20}>
                {isLoading ? (
                  <PageSpinner className="page-spinner--dashboard-tickets" />
                ) : (
                  <>
                    <div className="text-base">HANDLED</div>
                    <div className="fw-bold text-2xl color-text-success-2">
                      {!isEmpty(dashboardReport.tickets) &&
                      dashboardReport.tickets.handled
                        ? dashboardReport.tickets.handled
                        : 0}
                    </div>
                  </>
                )}
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={8}>
          <div className="panel panel--secondary dashboard--tickets--status-summary dashboard--tickets--status-summary__border">
            <Row type="flex" className="align-items-center">
              <Col span={4}>
                <InboxOutlined className="anticon--big" />
              </Col>
              <Col span={20}>
                {isLoading ? (
                  <PageSpinner className="page-spinner--dashboard-tickets" />
                ) : (
                  <>
                    <div className="text-base">OVERDUE</div>
                    <div className="fw-bold text-2xl color-text-error-2">
                      {!isEmpty(dashboardReport.tickets) &&
                      dashboardReport.tickets.overdue
                        ? dashboardReport.tickets.overdue
                        : 0}
                    </div>
                  </>
                )}
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={8}>
          <div className="panel panel--secondary dashboard--tickets--status-summary dashboard--tickets--status-summary__border">
            <Row type="flex" className="align-items-center">
              <Col span={4}>
                <InboxOutlined className="anticon--big" />
              </Col>
              <Col span={20}>
                {isLoading ? (
                  <PageSpinner className="page-spinner--dashboard-tickets" />
                ) : (
                  <>
                    <div className="text-base">CLOSE</div>
                    <div className="fw-bold text-2xl color-text-secondary-2">
                      {!isEmpty(dashboardReport.tickets) &&
                      dashboardReport.tickets.closed
                        ? dashboardReport.tickets.closed
                        : 0}
                    </div>
                  </>
                )}
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
}

const mapStateToProps = ({ dashboardReport }) => ({ dashboardReport });

export default connect(mapStateToProps, { getReportDashboard })(Tickets)
