import { Row, Col, Typography, Badge, Card, Button, Tooltip } from 'antd'
import Checkbox from 'antd/lib/checkbox/Checkbox'
import React from 'react'
import { Link } from 'react-router-dom'
import TicketSkeleton from '../TicketSkeletonLoader'
import { CarryOutOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { capitalize } from 'lodash'
import { dateToDaysDuration } from 'utils/index'
import moment from 'moment'
import { handleBusinesBadgeColor } from 'pages/ticket/helper'

export default function BucketList({
    loadingPage,
    columns,
    editOpenCard,
    editProgressCard,
    editEscalateCard,
    editFeedbackCard,
    editFollowUpCard,
    editClosedCard,
    handleIconCard,
    isOpenCardChecked,
    isProgressCardChecked,
    isEscalateCardChecked,
    isFeedbackCardChecked,
    isFollowUpCardChecked,
    onChangeClosedCard,
    onChangeEscalateCard,
    onChangeProgressCard,
    onChangeFeedbackCard,
    onChangeFollowUpCard,
    onChangeOpenCard,
    handleLoadMoreTicketList,
    loadingPageLoadMore,
    summaryUnassignedTickets,
    pathname,
}) {

    return (
        <React.Fragment>
            {loadingPage ? (
                <TicketSkeleton />
            ) : (
                <Row gutter={16} className="card-container_scroll">
                    {Object.entries(columns).map(([columnId, column], index) => {
                        const handleColumnName =
                            column.name === 'Open'
                                ? editOpenCard
                                : column.name === 'On Progress'
                                    ? editProgressCard
                                    : column.name === 'Escalate'
                                        ? editEscalateCard
                                        : column.name === 'Feedback'
                                            ? editFeedbackCard
                                            : column.name === 'Follow Up'
                                                ? editFollowUpCard
                                                : editClosedCard
                        return !column.granted ? undefined : (
                            <Col
                                key={index}
                                xs={6}
                                className="card-list"
                                style={{
                                    backgroundColor: '#f2f5f7',
                                    height: '100vh',
                                    position: 'relative',
                                }}>
                                <div
                                    style={{
                                        margin: '15px 0px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        position: 'sticky',
                                        top: '0px',
                                        zIndex: 1,
                                        backgroundColor: '#f2f5f7',
                                        padding: '10px 0px 4px 0px',
                                    }}>
                                    <Typography.Title
                                        style={{ color: '#5b5c5d', margin: '0px 10px' }}
                                        level={4}>
                                        {column.name}
                                    </Typography.Title>

                                    {column.name === 'Open' &&
                                        handleIconCard(
                                            column.name,
                                            isOpenCardChecked,
                                            editOpenCard,
                                            index
                                        )}

                                    {column.name === 'On Progress' &&
                                        handleIconCard(
                                            column.name,
                                            isProgressCardChecked,
                                            editProgressCard,
                                            index
                                        )}

                                    {column.name === 'Escalate' &&
                                        handleIconCard(
                                            column.name,
                                            isEscalateCardChecked,
                                            editEscalateCard,
                                            index
                                        )}

                                    {column.name === 'Feedback' &&
                                        handleIconCard(
                                            column.name,
                                            isFeedbackCardChecked,
                                            editFeedbackCard,
                                            index
                                        )}
                                    {column.name === 'Follow Up' &&
                                        handleIconCard(
                                            column.name,
                                            isFollowUpCardChecked,
                                            editFollowUpCard,
                                            index
                                        )}
                                </div>
                                {column?.items.map((data, idx) => {
                                    const isLastItem = idx === column.items.length - 1
                                    return handleColumnName ? (
                                        <div key={idx}>
                                            <Checkbox
                                                value={data.number}
                                                onChange={
                                                    column.name === 'Open'
                                                        ? onChangeOpenCard
                                                        : column.name === 'On Progress'
                                                            ? onChangeProgressCard
                                                            : column.name === 'Escalate'
                                                                ? onChangeEscalateCard
                                                                : column.name === 'Feedback'
                                                                    ? onChangeFeedbackCard
                                                                    : column.name === 'Follow Up'
                                                                        ? onChangeFollowUpCard
                                                                        : onChangeClosedCard
                                                }
                                            />
                                            <Link
                                                to={`/edit-ticket/edit?id=${data.number}`}
                                                state={{
                                                    assignedTo: data?.assignedTo,
                                                }}>
                                                <Badge.Ribbon
                                                    text={capitalize(data.urgency)}
                                                    color={
                                                        data.urgency === 'PRIORITY'
                                                            ? '#9b51e0'
                                                            : data.urgency === 'NORMAL'
                                                                ? '#6fcf97'
                                                                : '#f2c94c'
                                                    }
                                                    style={{
                                                        margin:
                                                            data.urgency === 'NORMAL' ||
                                                                data.urgency === 'PRIORITY'
                                                                ? '9px 10px 0px 34px'
                                                                : '9px 15px',
                                                    }}>

                                                    <Card
                                                        className="card-list-items"
                                                        title={data.number}
                                                        loading={loadingPage}
                                                        style={{ marginLeft: '20px' }}
                                                        extra={
                                                            moment(data.dueAt).isBefore(
                                                                moment().toDate()
                                                            ) ? (

                                                                <div
                                                                    className="bg-danger"
                                                                    style={{
                                                                        color: '#FFFFFF',
                                                                        marginBottom: '0px',
                                                                        marginRight:
                                                                            data.urgency === 'NORMAL' ||
                                                                                data.urgency === 'PRIORITY'
                                                                                ? '20px'
                                                                                : '17px',
                                                                        padding: '0px 4px',
                                                                    }}>
                                                                    Overdue!!
                                                                </div>
                                                            ) : (
                                                                false
                                                            )
                                                        }
                                                        bordered>

                                                        <span
                                                            className="card-list-items-description"
                                                            style={{ marginTop: '3px', fontWeight: 500 }}>
                                                            <Typography.Title
                                                                level={5}
                                                                ellipsis={{ rows: 1, expandable: false }}>
                                                                {data.title}
                                                            </Typography.Title>
                                                        </span>
                                                        <span
                                                            className="card-list-items-description color-text-secondary"
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}>
                                                            Patient:{' '}
                                                            <Typography.Paragraph
                                                                style={{
                                                                    marginBottom: 0,
                                                                    marginLeft: 5,
                                                                    color: '#000000',
                                                                }}
                                                                ellipsis={{ rows: 1, expandable: false }}>
                                                                {data.patientName}
                                                            </Typography.Paragraph>
                                                        </span>
                                                        <span
                                                            className="card-list-items-description color-text-secondary"
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}>
                                                            Assigned to:{' '}
                                                            <Typography.Paragraph
                                                                style={{
                                                                    marginBottom: 0,
                                                                    marginLeft: 5,
                                                                    color: '#000000',
                                                                }}
                                                                ellipsis={{ rows: 1, expandable: false }}>
                                                                {data.assignedTo}
                                                            </Typography.Paragraph>
                                                        </span>

                                                        <Row type="flex" className="mt-10">
                                                            <Col span={12}>
                                                                <Tooltip title="Due Date" key={'tooltip-due-date'}>
                                                                    <div className="color-text-secondary">
                                                                        <CarryOutOutlined className="bottom-icon" />
                                                                        {moment(data.dueAt).format('DD/MM/YYYY')}
                                                                    </div>
                                                                </Tooltip>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Tooltip title="Aging" key={'tooltip-aging'}>
                                                                    <div
                                                                        className="color-text-secondary"
                                                                        style={{
                                                                            textAlign: 'end',
                                                                            marginRight: 20,
                                                                        }}>
                                                                        <ClockCircleOutlined className="bottom-icon" />
                                                                        {dateToDaysDuration(data.createdAt)}
                                                                    </div>
                                                                </Tooltip>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Badge.Ribbon>
                                            </Link>
                                        </div>
                                    ) : (
                                        <>
                                            <Link
                                                key={idx}
                                                to={`/edit-ticket/edit?id=${data.number}`}
                                                state={{
                                                    assignedTo: data?.assignedTo,
                                                }}>
                                                <Badge.Ribbon
                                                    text={capitalize(data.urgency)}
                                                    color={
                                                        data.urgency === 'PRIORITY'
                                                            ? '#9b51e0'
                                                            : data.urgency === 'NORMAL'
                                                                ? '#6fcf97'
                                                                : '#f2c94c'
                                                    }
                                                    style={{
                                                        margin:
                                                            data.urgency === 'NORMAL' ||
                                                                data.urgency === 'PRIORITY'
                                                                ? '9px 10px 0px 24px'
                                                                : '9px 10px 0px 0px',
                                                    }}>
                                                    <Card
                                                        className="card-list-items"
                                                        title={data.number}
                                                        loading={loadingPage}
                                                        style={{ marginLeft: '10px' }}
                                                        extra={
                                                            moment(data.dueAt).isBefore(
                                                                moment().toDate()
                                                            ) ? (
                                                                <div
                                                                    className="bg-danger"
                                                                    style={{
                                                                        color: '#FFFFFF',
                                                                        marginBottom: '0px',
                                                                        marginRight:
                                                                            data.urgency === 'NORMAL' ||
                                                                                data.urgency === 'PRIORITY'
                                                                                ? '26px'
                                                                                : '12px',
                                                                        padding: '0px 4px',
                                                                    }}>
                                                                    Overdue!!
                                                                </div>
                                                            ) : (
                                                                false
                                                            )
                                                        }
                                                        bordered>
                                                        <span
                                                            className="card-list-items-description"
                                                            style={{
                                                                marginTop: '3px',
                                                                marginBottom: '5px',
                                                                fontWeight: 500,
                                                            }}>
                                                            <Typography.Title
                                                                level={5}
                                                                ellipsis={{ rows: 1, expandable: false }}>
                                                                {data.title}
                                                            </Typography.Title>
                                                        </span>
                                                        <span
                                                            className="card-list-items-description color-text-secondary"
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}>
                                                            Patient:{' '}
                                                            <Typography.Paragraph
                                                                style={{
                                                                    marginBottom: 0,
                                                                    marginLeft: 5,
                                                                    color: '#000000',
                                                                }}
                                                                ellipsis={{ rows: 1, expandable: false }}>
                                                                {data.patientName}
                                                            </Typography.Paragraph>
                                                        </span>
                                                        <span
                                                            className="card-list-items-description color-text-secondary"
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}>
                                                            Assigned to:{' '}
                                                            <Typography.Paragraph
                                                                style={{
                                                                    marginBottom: 0,
                                                                    marginLeft: 5,
                                                                    color: '#000000',
                                                                }}
                                                                ellipsis={{ rows: 1, expandable: false }}>
                                                                {data.assignedTo}
                                                            </Typography.Paragraph>
                                                        </span>
                                                        <span
                                                            className="card-list-items-description color-text-secondary"
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}>
                                                            Business Unit:{' '}
                                                            <Typography.Paragraph
                                                                style={{
                                                                    marginBottom: 0,
                                                                    marginLeft: 5,
                                                                    color: '#FFFFFF',
                                                                    backgroundColor: handleBusinesBadgeColor(data.businessUnit),
                                                                    paddingRight: 20,
                                                                    paddingLeft: 20,
                                                                    borderRadius: '15px',
                                                                    fontSize: "11px"
                                                                }}
                                                                ellipsis={{ rows: 1, expandable: false }}>
                                                                {data.businessUnit}
                                                            </Typography.Paragraph>
                                                        </span>
                                                    
                                                        <Row type="flex" className="mt-10">
                                                            <Col span={12}>
                                                                <Tooltip title="Due Date" key={'tooltip-due-date'}>
                                                                    <div className="color-text-secondary">
                                                                        <CarryOutOutlined className="bottom-icon" />
                                                                        {moment(data.dueAt).format('DD/MM/YYYY')}
                                                                    </div>
                                                                </Tooltip>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Tooltip title="Aging" key={'tooltip-aging'}>
                                                                    <div
                                                                        className="color-text-secondary"
                                                                        style={{
                                                                            textAlign: 'end',
                                                                            marginRight: 20,
                                                                        }}>
                                                                        <ClockCircleOutlined className="bottom-icon" />
                                                                        {dateToDaysDuration(data.createdAt)}
                                                                    </div>
                                                                </Tooltip>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Badge.Ribbon>
                                            </Link>
                                            {isLastItem && (
                                                <div style={{ margin: '0px 10px 20px 20px' }}>
                                                    {pathname.includes('my-tickets') &&
                                                        summaryUnassignedTickets?.data?.totalMyTickets >
                                                        10 ? (
                                                        <Button
                                                            style={{
                                                                width: '100%',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                borderRadius: '8px',
                                                            }}
                                                            disabled={loadingPageLoadMore}
                                                            key={`Load More ${column.name}`}
                                                            onClick={() =>
                                                                handleLoadMoreTicketList(
                                                                    data.epochCreatedAt,
                                                                    columnId
                                                                )
                                                            }>
                                                            Load More
                                                        </Button>
                                                    ) : pathname.includes('all-tickets') ? (
                                                        <Button
                                                            style={{
                                                                width: '100%',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                borderRadius: '8px',
                                                            }}
                                                            disabled={loadingPageLoadMore}
                                                            key={`Load More ${column.name}`}
                                                            onClick={() =>
                                                                handleLoadMoreTicketList(
                                                                    data.epochCreatedAt,
                                                                    columnId
                                                                )
                                                            }>
                                                            Load More
                                                        </Button>
                                                    ) : null}
                                                </div>
                                            )}
                                        </>
                                    )
                                })}
                            </Col>
                        )
                    })}
                </Row>
            )
            }
        </React.Fragment >
    )
}
