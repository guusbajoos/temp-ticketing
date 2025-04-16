/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Card, Col, Row, Typography } from "antd";

import { connect } from "react-redux";
import ReadMore from "../ReadMore";
import moment from "moment-timezone";
import { capitalize } from "lodash";

import { getTicketByNumber } from "store/action/TicketAction";

import "./style.scss";
import { wordsCapitalize } from "utils/index";

export function InfoDetail({
  ticketByNumber,
  openRelatedTransaction,
  ticketsRelated,
  loadingTicketRelated,
}) {
  const {
    reporter,
    incomingAt,
    dueAt,
    urgency,
    // category,
    // subCategory1,
    // subCategory2,
    source,
    patientId,
    patientName,
    patientPhone,
    secondaryPhone,
    soNumber,
    medicalRecord,
    createdAt,
    updatedAt,
    patientSatisfactionStatus,
    patientSatisfactionNote,
    infobipChatId,
  } = ticketByNumber;

  return (
    <Row gutter={30} className="info-detail">
      <Col
        style={{ margin: "8px 0px" }}
        span={12}
        className="fw-medium color-text-primary mb-10 text--capitalize"
      >
        Reporter
      </Col>
      <Col style={{ margin: "8px 0px" }} span={12}>
        {reporter ? reporter.name : ""}
      </Col>
      <Col
        style={{ margin: "8px 0px" }}
        span={12}
        className="fw-medium color-text-primary mb-10 text--capitalize"
      >
        Infobip Chat
      </Col>
      <Col style={{ margin: "8px 0px" }} span={12}>
        {!infobipChatId ? (
          "no chat id"
        ) : (
          <a
            className="text-primary"
            href={`https://portal.infobip.com/conversations/my-work?conversationId=${infobipChatId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {infobipChatId}
          </a>
        )}
      </Col>
      <Col
        style={{ margin: "8px 0px" }}
        span={12}
        className="fw-medium color-text-primary mb-10 text--capitalize"
      >
        Created
      </Col>
      <Col style={{ margin: "8px 0px" }} span={12}>
        {moment(createdAt)
          .tz("Asia/Jakarta")
          .format("DD MMMM YYYY - HH:mm:ss A")}
      </Col>
      <Col
        style={{ margin: "8px 0px" }}
        span={12}
        className="fw-medium color-text-primary mb-30"
      >
        Updated
      </Col>
      <Col style={{ margin: "8px 0px" }} span={12}>
        {moment(updatedAt)
          .tz("Asia/Jakarta")
          .format("DD MMMM YYYY - HH:mm:ss A")}
      </Col>

      <Col
        style={{ margin: "8px 0px" }}
        span={24}
        className="fw-medium color-text-primary mb-10 text--capitalize mt-15"
      >
        About Ticket
      </Col>
      <Col
        style={{ margin: "8px 0px" }}
        span={12}
        className="fw-medium color-text-primary mb-10 text--capitalize"
      >
        Urgency
      </Col>
      <Col style={{ margin: "8px 0px" }} span={12}>
        <div
          className={`badge-label ${
            urgency === "PRIORITY"
              ? "bg-priority"
              : urgency === "NORMAL"
                ? "bg-success"
                : "bg-warning"
          }`}
        >
          {capitalize(urgency)}
        </div>
      </Col>
      <Col
        style={{ margin: "8px 0px" }}
        span={12}
        className="fw-medium color-text-primary mb-10 text--capitalize"
      >
        Due Date
      </Col>
      <Col style={{ margin: "8px 0px" }} span={12}>
        {moment(dueAt).tz("Asia/Jakarta").format("DD MMMM YYYY - HH:mm:ss A")}
      </Col>
      <Col
        style={{ margin: "8px 0px" }}
        span={12}
        className="fw-medium color-text-primary mb-10 text--capitalize"
      >
        Incoming Date & Time
      </Col>
      <Col style={{ margin: "8px 0px" }} span={12}>
        {moment(incomingAt)
          .tz("Asia/Jakarta")
          .format("DD MMMM YYYY - HH:mm:ss A")}
      </Col>
      <Col
        style={{ margin: "8px 0px" }}
        span={12}
        className="fw-medium color-text-primary mb-30"
      >
        Source
      </Col>
      <Col style={{ margin: "8px 0px" }} span={12}>
        {source}
      </Col>

      <Col
        style={{ margin: "8px 0px" }}
        span={24}
        className="fw-medium color-text-primary mb-10 text--capitalize mt-15"
      >
        Patient Details
      </Col>
      <Col
        style={{ margin: "8px 0px" }}
        span={12}
        className="fw-medium color-text-primary mb-10 text--capitalize"
      >
        Patient ID
      </Col>
      <Col style={{ margin: "8px 0px" }} span={12}>
        {patientId}
      </Col>
      <Col
        style={{ margin: "8px 0px" }}
        span={12}
        className="fw-medium color-text-primary mb-10 text--capitalize"
      >
        Patient Name
      </Col>
      <Col style={{ margin: "8px 0px" }} span={12}>
        <Typography.Link
          href={`/patients/detail/${patientPhone}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {patientName}
        </Typography.Link>
      </Col>
      <Col
        style={{ margin: "8px 0px" }}
        span={12}
        className="fw-medium color-text-primary mb-10 text--capitalize"
      >
        Phone Number
      </Col>
      <Col style={{ margin: "8px 0px" }} span={12}>
        {patientPhone}
      </Col>
      <Col
        style={{ margin: "8px 0px" }}
        span={12}
        className="fw-medium color-text-primary mb-10 text--capitalize"
      >
        Secondary Phone Number
      </Col>
      <Col style={{ margin: "8px 0px" }} span={12}>
        {secondaryPhone}
      </Col>
      <Col
        style={{ margin: "8px 0px" }}
        span={12}
        className="fw-medium color-text-primary mb-10 text--capitalize"
      >
        SO Number
      </Col>
      <Col style={{ margin: "8px 0px" }} span={12}>
        <div
          className="related-transaction"
          onClick={() => openRelatedTransaction()}
        >
          <svg
            width="20"
            height="10"
            viewBox="0 0 20 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.1667 1.66667C19.1667 2.58333 18.4167 3.33333 17.5 3.33333C17.35 3.33333 17.2084 3.31667 17.075 3.275L14.1084 6.23333C14.15 6.36667 14.1667 6.51667 14.1667 6.66667C14.1667 7.58333 13.4167 8.33333 12.5 8.33333C11.5834 8.33333 10.8334 7.58333 10.8334 6.66667C10.8334 6.51667 10.85 6.36667 10.8917 6.23333L8.76671 4.10833C8.63337 4.15 8.48337 4.16667 8.33337 4.16667C8.18337 4.16667 8.03337 4.15 7.90004 4.10833L4.10837 7.90833C4.15004 8.04167 4.16671 8.18333 4.16671 8.33333C4.16671 9.25 3.41671 10 2.50004 10C1.58337 10 0.833374 9.25 0.833374 8.33333C0.833374 7.41667 1.58337 6.66667 2.50004 6.66667C2.65004 6.66667 2.79171 6.68333 2.92504 6.725L6.72504 2.93333C6.68337 2.8 6.66671 2.65 6.66671 2.5C6.66671 1.58333 7.41671 0.833333 8.33337 0.833333C9.25004 0.833333 10 1.58333 10 2.5C10 2.65 9.98337 2.8 9.94171 2.93333L12.0667 5.05833C12.2 5.01667 12.35 5 12.5 5C12.65 5 12.8 5.01667 12.9334 5.05833L15.8917 2.09167C15.85 1.95833 15.8334 1.81667 15.8334 1.66667C15.8334 0.75 16.5834 1.22621e-07 17.5 1.29758e-07C18.4167 1.36895e-07 19.1667 0.75 19.1667 1.66667Z"
              fill="#2B95FE"
            />
          </svg>
          <span className="related-transaction__so-number">{soNumber}</span>
        </div>
      </Col>
      <Col
        style={{ margin: "8px 0px" }}
        span={12}
        className="fw-medium color-text-primary mb-10 text--capitalize"
      >
        Medical Record
      </Col>
      <Col style={{ margin: "8px 0px" }} span={12}>
        {medicalRecord}
      </Col>

      <Col
        style={{ margin: "8px 0px" }}
        span={12}
        className="mt-15 fw-medium color-text-primary mb-10 text--capitalize"
      >
        Patient Satisfaction
      </Col>

      <Col style={{ margin: "8px 0px" }} span={12} className="mt-15">
        {patientSatisfactionStatus !== null ? (
          <span className="satisfaction-container">
            <div className="thumb-container">
              {patientSatisfactionStatus ? (
                <img
                  className="thumb"
                  src="https://rata-web-staging-assets.s3.ap-southeast-1.amazonaws.com/thumb_good.svg"
                  alt="good"
                />
              ) : (
                <img
                  className="thumb"
                  src="https://rata-web-staging-assets.s3.ap-southeast-1.amazonaws.com/thumb_bad.svg"
                  alt="bad"
                />
              )}

              <span
                className={`${
                  patientSatisfactionStatus
                    ? "text text--good"
                    : "text text--bad"
                } `}
              >
                {patientSatisfactionStatus ? "Good" : "Bad"}
              </span>
            </div>

            <ReadMore text={patientSatisfactionNote} />
          </span>
        ) : (
          <p>No Response</p>
        )}
      </Col>

      <Col style={{ margin: "8px 0px" }} span={24} className="mt-15">
        <div style={{ marginBottom: 8 }}>
          <Typography.Text className="fw-medium color-text-primary mb-10 text--capitalize">
            Related Tickets
          </Typography.Text>
        </div>
        <Card
          bordered={false}
          bodyStyle={{ padding: 0 }}
          style={{
            marginBottom: 60,
            boxShadow: "none",
            backgroundColor: "transparent",
          }}
          loading={loadingTicketRelated}
        >
          {ticketsRelated?.length > 0 ? (
            ticketsRelated.map((ticket, index) => (
              <Typography.Link
                key={index}
                href={`/edit-ticket/edit?id=${ticket.ticketNumber}`}
                rel="noopener noreferrer"
                target="_blank"
                style={{
                  color: "#2b95fe",
                  marginBottom: 8,
                  display: "block",
                  width: "fit-content",
                }}
              >
                {ticket.ticketNumber} | {wordsCapitalize(ticket.ticketTitle)}
              </Typography.Link>
            ))
          ) : (
            <Typography.Text>No related tickets</Typography.Text>
          )}
        </Card>
      </Col>
    </Row>
  );
}

const mapStateToProps = ({ ticketByNumber }) => ({
  ticketByNumber,
});

export default connect(mapStateToProps, { getTicketByNumber })(InfoDetail);
