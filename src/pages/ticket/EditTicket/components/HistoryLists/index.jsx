/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Col, Row, Spin, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

import { connect } from "react-redux";
import { isEmpty, capitalize, startCase } from "lodash";
import moment from "moment";
import { Waypoint } from "react-waypoint";
import { LoadingOutlined } from "@ant-design/icons";

import TicketApi from "api/ticket";

import HtmlRender from "components/HTMLRender";

import { avatarColor, sortingAsc } from "../../../../../utils";

import "./style.scss";
import ReadMore from "../ReadMore";
import { getUserById } from "store/action/UserAction";
import { formatHTMLDescription } from "../../utils/formatHTML";

export function HistoryLists({ oldAgentValue }) {
  const urlParams = new URLSearchParams(window.location.search);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketHistoryListData, setTicketHistoryListData] = useState([]);
  const [orderType, setOrderType] = useState([]);
  const [statusProductions, setStatusProductions] = useState([]);
  const [problemTypes, setProblemTypes] = useState([]);
  const id = urlParams.get("id");
  const [pagination, setPagination] = useState({
    page: 1,
    size: 5,
  });

  const getTicketHistoryListData = async (id, page, size) => {
    try {
      setIsLoading(true);

      const { data } = await TicketApi.getTicketHistoryList(id, page, size);
      if (!isEmpty(data.currentElements)) {
        setTicketHistoryListData({
          totalPage: data.totalPage,
          list: data.currentElements,
        });
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const fetchOrderType = async () => {
    const { data } = await TicketApi.getOrderType();

    setOrderType(data);
  };

  const fetchStatusProductions = async () => {
    const { data } = await TicketApi.getStatusProductions();

    setStatusProductions(data);
  };

  const fetchProblemType = async () => {
    const { data } = await TicketApi.getProblemTypes();

    setProblemTypes(data);
  };

  useEffect(() => {
    getTicketHistoryListData(id, pagination.page, pagination.size);
    fetchOrderType();
    fetchStatusProductions();
    fetchProblemType();
  }, []);

  const handleLoadMoreHistory = async () => {
    setIsLoading(true);

    const nextPage = pagination.page + 1;

    const { data } = await TicketApi.getTicketHistoryList(
      id,
      nextPage,
      pagination.size
    );

    if (!isEmpty(data.currentElements)) {
      setTicketHistoryListData({
        totalPage: data.totalPage,
        list: [...ticketHistoryListData.list, ...data.currentElements],
      });
    }

    setPagination({ ...pagination, page: nextPage });

    setIsLoading(false);
  };

  const capitalizeRahang = (value) => {
    if (!value) return "";

    if (value === "TICKET_SOLUTION_RA") {
      return "Ticket Solution RA";
    }

    if (value === "TICKET_SOLUTION_RB") {
      return "Ticket Solution RB";
    }
  };

  return (
    <ul className="history-list mt-30">
      {!isEmpty(ticketHistoryListData.list) &&
        ticketHistoryListData.list.map((value, index) => {
          const formatUnderscoreStatusFollowUp = (statusFollowUp) => {
            return statusFollowUp.split("_").join(" ");
          };

          const formatAgentViaEditUser = (agentValue) => {
            const newFormatAgent = agentValue.split("_");
            newFormatAgent.splice(1, 0, "(");
            newFormatAgent.splice(newFormatAgent.length, 0, ")");
            return newFormatAgent.join(" ");
          };

          const subCategoryValue = (values) => {
            const subCategory = values.split("_");
            subCategory.splice(2, 0, "-");
            return value.changedColumn === "SUB_CATEGORY_1" ||
              value.changedColumn === "SUB_CATEGORY_2"
              ? subCategory.join(" ")
              : "";
          };

          const typeOrder = (param) => {
            const results =
              !isEmpty(orderType) &&
              orderType.find((type) => type.id === Number(param));

            return results && results.orderType;
          };

          const prodStatus = (param) => {
            const results =
              !isEmpty(statusProductions) &&
              statusProductions.find((stat) => stat.id === Number(param));
            return param !== undefined
              ? results && results.statusProduction
              : "-";
          };

          const typeProblem = (param) => {
            const results =
              !isEmpty(problemTypes) &&
              problemTypes.find((stat) => stat.id === Number(param));

            return param !== undefined ? results && results.problemType : "-";
          };

          const parseDashElement = value.changedColumn.split("_");
          const lastParseDashElement = parseDashElement
            .slice(2, parseDashElement.length)
            .join(" ")
            .toUpperCase();

          const firstParseDashElement = parseDashElement
            .slice(0, 2)
            .join(" ")
            .toUpperCase();

          // const findTicketSolution = (value) => {
          //   const lastElementTICKETSOLUTION = value
          //     .split('_')
          //     .slice(2, value.split('_').length)
          //     .join(' ');

          //   const result = value.split('_').filter((item) => {
          //     let resIdx = item === 'TICKET' || item === 'SOLUTION';
          //     return resIdx;
          //   });
          //   return result + '-' + lastElementTICKETSOLUTION;
          // }

          return (
            <li className="history-list__item mb-20" key={index}>
              <Row gutter={10} wrap={false}>
                <Col>
                  <div
                    className={`letter-avatar ${avatarColor(
                      !isEmpty(value.user) ? value.user.name.charAt(0) : ""
                    )}`}>
                    {!isEmpty(value.user)
                      ? `${capitalize(value.user.name.charAt(0))}${capitalize(
                          value.user.name.charAt(1)
                        )}`
                      : ""}
                  </div>
                </Col>

                <Col>
                  <div className="mb-10 history-list__status-title text--capitalize">
                    {value.changedColumn === "TICKET_SOLUTION_CREATED" ? (
                      <div>
                        <div style={{ display: "flex" }}>
                          <span className="color-text-primary fw-medium">
                            {value.user.name}
                          </span>
                          <span style={{ margin: "0px 4px" }}> Added the </span>
                          <span className="fw-medium color-text-primary">
                            Ticket Solution{" "}
                          </span>
                        </div>
                        <span>
                          {moment(value.createdAt).format(
                            "DD MMMM YYYY - HH:mm:ss A"
                          )}
                        </span>
                      </div>
                    ) : value.changedColumn === "COMMENT_DELETED" ? (
                      <div>
                        <div style={{ display: "flex" }}>
                          <span className="color-text-primary fw-medium">
                            {value.user.name}
                          </span>
                          <span style={{ margin: "0px 4px" }}>
                            {" "}
                            Deleted the{" "}
                          </span>
                          <span className="fw-medium color-text-primary">
                            Comment{" "}
                          </span>
                        </div>
                        <span>
                          {moment(value.createdAt).format(
                            "DD MMMM YYYY - HH:mm:ss A"
                          )}
                        </span>
                      </div>
                    ) : capitalize(startCase(value.changedColumn)) !==
                      "Created" ? (
                      <div>
                        <div style={{ display: "flex" }}>
                          {!isEmpty(value.user) ? (
                            <>
                              <span className="color-text-primary fw-medium">
                                {value.user.name}
                              </span>
                              <span>
                                &nbsp;
                                {value.changedColumn ===
                                  "PATIENT_SATISFACTION_DELETED" ||
                                value.changedColumn === "DELETED" ||
                                value.changedColumn ===
                                  "TICKET_SOLUTION_DELETED"
                                  ? "deleted"
                                  : value.changedColumn ===
                                      "PATIENT_SATISFACTION_CREATED"
                                    ? "created"
                                    : "changed"}
                                &nbsp;the&nbsp;
                              </span>
                            </>
                          ) : (
                            "-"
                          )}
                          <span className="mb-10 fw-medium color-text-secondary text--capitalize">
                            {value.changedColumn === "AGENT_VIA_EDIT_USER"
                              ? `Ticket - ${capitalize(
                                  formatAgentViaEditUser(value.changedColumn)
                                )}`
                              : value.changedColumn === "TICKET_SOLUTION_RA" ||
                                  value.changedColumn === "TICKET_SOLUTION_RB"
                                ? capitalizeRahang(value.changedColumn)
                                : capitalize(
                                    value.changedColumn ===
                                      "PATIENT_SATISFACTION_DELETED" ||
                                      value.changedColumn ===
                                        "PATIENT_SATISFACTION_CREATED"
                                      ? startCase("PATIENT_SATISFACTION")
                                      : value.changedColumn === "DELETED"
                                        ? startCase("Ticket")
                                        : value.changedColumn === "TITLE" ||
                                            value.changedColumn ===
                                              "DESCRIPTION" ||
                                            value.changedColumn === "AGENT" ||
                                            value.changedColumn === "TEAM" ||
                                            value.changedColumn === "URGENCY" ||
                                            value.changedColumn === "STATUS" ||
                                            value.changedColumn === "SOURCE" ||
                                            value.changedColumn === "DUE_AT" ||
                                            value.changedColumn ===
                                              "INCOMING_AT" ||
                                            value.changedColumn ===
                                              "CATEGORY" ||
                                            value.changedColumn ===
                                              "MEDICAL_RECORD" ||
                                            value.changedColumn ===
                                              "SO_NUMBER" ||
                                            value.changedColumn ===
                                              "PATIENT_PHONE" ||
                                            value.changedColumn ===
                                              "PATIENT_NAME" ||
                                            value.changedColumn ===
                                              "PATIENT_ID" ||
                                            value.changedColumn ===
                                              "RAHANG_BAWAH" ||
                                            value.changedColumn ===
                                              "RAHANG_ATAS"
                                          ? `${
                                              startCase("Ticket") +
                                              " - " +
                                              startCase(value.changedColumn)
                                            }`
                                          : value.changedColumn ===
                                                "SUB_CATEGORY_1" ||
                                              value.changedColumn ===
                                                "SUB_CATEGORY_2"
                                            ? `${
                                                startCase("Ticket") +
                                                " - " +
                                                subCategoryValue(
                                                  value.changedColumn
                                                )
                                              }`
                                            : value.changedColumn ===
                                                "TICKET_SOLUTION_DELETED"
                                              ? startCase("TICKET_SOLUTION")
                                              : parseDashElement.length > 1 ||
                                                  (firstParseDashElement ===
                                                    "TICKET SOLUTION" &&
                                                    firstParseDashElement ===
                                                      "PATIENT SATISFACTION")
                                                ? `${firstParseDashElement} - ${lastParseDashElement}`
                                                : startCase(value.changedColumn)
                                  )}
                          </span>{" "}
                        </div>
                        {moment(value.createdAt).format(
                          "DD MMMM YYYY - HH:mm:ss A"
                        )}
                      </div>
                    ) : (
                      <div>
                        <span className="pb-10 fw-medium color-text-secondary text--capitalize">
                          {capitalize(startCase(value.changedColumn)) ===
                            "Created" && value.newValue}
                        </span>{" "}
                        <span>
                          {" "}
                          created the{" "}
                          <span className="fw-medium color-text-secondary">
                            Ticket{" "}
                          </span>
                        </span>
                        <p>
                          {moment(value.createdAt).format(
                            "DD MMMM YYYY - HH:mm:ss A"
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {value.changedColumn !== "CREATED_TS" &&
                    value.changedColumn !== "TICKET_SOLUTION_CREATED" &&
                    capitalize(startCase(value.changedColumn)) !== "Created" &&
                    value.changedColumn !== "DELETED" &&
                    value.changedColumn !== "PATIENT_SATISFACTION_CREATED" &&
                    value.changedColumn !== "PATIENT_SATISFACTION_STATUS" &&
                    value.changedColumn !== "PATIENT_SATISFACTION_NOTE" &&
                    value.changedColumn !== "PATIENT_SATISFACTION_DELETED" &&
                    value.changedColumn !== "TICKET_SOLUTION_DELETED" &&
                    value.changedColumn !== "COMMENT" &&
                    value.changedColumn !== "COMMENT_DELETED" &&
                    value.changedColumn !== "DESCRIPTION" && (
                      <div className="d-flex align-items-center history-list__status-desc">
                        <div className="csat-text csat-text--old history-list__status-desc-item text--uppercase">
                          <Typography
                            style={{ marginBottom: 0 }}
                            ellipsis={{
                              rows: 2,
                              expandable: true,
                              symbol: "more",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: formatHTMLDescription(
                                capitalize(
                                  value.oldValue === "IN_PROGRESS"
                                    ? "On Progress"
                                    : value.changedColumn === "DUE_AT"
                                      ? moment(value.oldValue).format(
                                          "DD MMMM YYYY"
                                        )
                                      : value.changedColumn === "INCOMING_AT" ||
                                          value.changedColumn ===
                                            "TICKET_SOLUTION_OK_FIT_DATE" ||
                                          value.changedColumn ===
                                            "TICKET_SOLUTION_MOLD_DATE_TS" ||
                                          value.changedColumn ===
                                            "TICKET_SOLUTION_OK_DOCTOR_DATE" ||
                                          value.changedColumn ===
                                            "TICKET_SOLUTION_CETAK_DATE" ||
                                          value.changedColumn ===
                                            "TICKET_SOLUTION_OK_PATIENT_DATE" ||
                                          value.changedColumn ===
                                            "TICKET_SOLUTION_APPROVAL_FINANCE_DATE"
                                        ? moment(value.oldValue).format(
                                            "DD MMMM YYYY - HH:mm:ss A"
                                          )
                                        : value.changedColumn ===
                                            "TICKET_SOLUTION_ORDER_TYPE"
                                          ? typeOrder(value.oldValue)
                                          : value.changedColumn ===
                                              "TICKET_SOLUTION_PROBLEM_TYPE"
                                            ? typeProblem(value.oldValue)
                                            : value.changedColumn ===
                                                "TICKET_SOLUTION_STATUS_PRODUCTION"
                                              ? prodStatus(value.oldValue)
                                              : value.changedColumn ===
                                                    "TICKET_SOLUTION_RAHANG_BAWAH" ||
                                                  value.changedColumn ===
                                                    "TICKET_SOLUTION_RAHANG_ATAS"
                                                ? sortingAsc(
                                                    "ticket-solution",
                                                    value.oldValue
                                                  )
                                                : value.changedColumn ===
                                                      "RAHANG_ATAS" ||
                                                    value.changedColumn ===
                                                      "RAHANG_BAWAH"
                                                  ? sortingAsc(
                                                      "ticket",
                                                      value.oldValue.split(",")
                                                    )
                                                  : value.changedColumn ===
                                                      "AGENT_VIA_EDIT_USER"
                                                    ? startCase(value.oldValue)
                                                    : value.oldValue ===
                                                        "FOLLOW_UP"
                                                      ? formatUnderscoreStatusFollowUp(
                                                          value.oldValue
                                                        )
                                                      : value.oldValue === ""
                                                        ? "No Response"
                                                        : isEmpty(
                                                              value.oldValue
                                                            )
                                                          ? "-"
                                                          : value.oldValue
                                )
                              ),
                            }}
                          />
                        </div>
                        <ArrowRightOutlined />
                        <div className="csat-text csat-text--old history-list__status-desc-item text--uppercase">
                          <Typography
                            style={{ marginBottom: 0 }}
                            ellipsis={{
                              rows: 2,
                              expandable: true,
                              symbol: "more",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: formatHTMLDescription(
                                capitalize(
                                  value.newValue === "IN_PROGRESS"
                                    ? "On Progress"
                                    : value.changedColumn === "DUE_AT"
                                      ? moment(value.newValue).format(
                                          "DD MMMM YYYY"
                                        )
                                      : value.changedColumn === "INCOMING_AT" ||
                                          value.changedColumn ===
                                            "TICKET_SOLUTION_OK_FIT_DATE" ||
                                          value.changedColumn ===
                                            "TICKET_SOLUTION_MOLD_DATE_TS" ||
                                          value.changedColumn ===
                                            "TICKET_SOLUTION_OK_DOCTOR_DATE" ||
                                          value.changedColumn ===
                                            "TICKET_SOLUTION_CETAK_DATE" ||
                                          value.changedColumn ===
                                            "TICKET_SOLUTION_OK_PATIENT_DATE" ||
                                          value.changedColumn ===
                                            "TICKET_SOLUTION_APPROVAL_FINANCE_DATE"
                                        ? moment(value.newValue).format(
                                            "DD MMMM YYYY - HH:mm:ss A"
                                          )
                                        : value.changedColumn ===
                                            "TICKET_SOLUTION_ORDER_TYPE"
                                          ? typeOrder(value.newValue)
                                          : value.changedColumn ===
                                              "TICKET_SOLUTION_PROBLEM_TYPE"
                                            ? typeProblem(value.newValue)
                                            : value.changedColumn ===
                                                "TICKET_SOLUTION_STATUS_PRODUCTION"
                                              ? prodStatus(value.newValue)
                                              : value.changedColumn ===
                                                    "TICKET_SOLUTION_RAHANG_BAWAH" ||
                                                  value.changedColumn ===
                                                    "TICKET_SOLUTION_RAHANG_ATAS"
                                                ? sortingAsc(
                                                    "ticket-solution",
                                                    value.newValue
                                                  )
                                                : value.changedColumn ===
                                                      "RAHANG_ATAS" ||
                                                    value.changedColumn ===
                                                      "RAHANG_BAWAH"
                                                  ? sortingAsc(
                                                      "ticket",
                                                      value.newValue.split(",")
                                                    )
                                                  : value.changedColumn ===
                                                      "AGENT_VIA_EDIT_USER"
                                                    ? startCase(value.newValue)
                                                    : value.newValue ===
                                                        "FOLLOW_UP"
                                                      ? formatUnderscoreStatusFollowUp(
                                                          value.newValue
                                                        )
                                                      : value.newValue === ""
                                                        ? "No Response"
                                                        : isEmpty(
                                                              value.newValue
                                                            )
                                                          ? "-"
                                                          : value.newValue
                                )
                              ),
                            }}
                          />
                        </div>
                      </div>
                    )}

                  {value.changedColumn === "DESCRIPTION" && (
                    <div
                      className="d-flex align-items-center history--list__status-desc"
                      style={{ columnGap: 8 }}>
                      <div className="history-list__status-desc-item text--uppercase">
                        <div className="csat-text">
                          <HtmlRender
                            content={value.oldValue || "No Response"}
                          />
                        </div>
                      </div>
                      <ArrowRightOutlined />
                      <div className="history-list__status-desc-item text--uppercase">
                        <div className="csat-text">
                          <HtmlRender
                            content={value.newValue || "No Response"}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {value.changedColumn === "COMMENT_DELETED" && (
                    <div
                      className="d-flex align-items-center history-list__status-desc"
                      style={{ columnGap: 8 }}>
                      <div className="csat-text">
                        <HtmlRender
                          content={
                            value.oldValue ? value.oldValue : "No Response"
                          }
                        />
                      </div>
                    </div>
                  )}

                  {value.changedColumn === "PATIENT_SATISFACTION_STATUS" && (
                    <div
                      className="d-flex align-items-center history-list__status-desc"
                      style={{ columnGap: 8 }}>
                      <div className="csat-status text-ellipsis">
                        {value.oldValue === "Good" && (
                          <>
                            <img
                              src="https://rata-web-staging-assets.s3.ap-southeast-1.amazonaws.com/thumb_good.svg"
                              alt="good"
                            />
                            <span
                              className={`${
                                value.oldValue === "Good"
                                  ? "text text--good"
                                  : "text text--bad"
                              } `}>
                              Good
                            </span>
                          </>
                        )}
                        {value.oldValue === "Bad" && (
                          <>
                            <img
                              src="https://rata-web-staging-assets.s3.ap-southeast-1.amazonaws.com/thumb_bad.svg"
                              alt="bad"
                            />
                            <span
                              className={`${
                                value.oldValue === "Good"
                                  ? "text text--good"
                                  : "text text--bad"
                              } `}>
                              Bad
                            </span>
                          </>
                        )}
                        {value.oldValue === "No Response" && (
                          <span className="csat-text csat-text--old">
                            No Response
                          </span>
                        )}
                      </div>
                      <ArrowRightOutlined />
                      <div className="csat-status text-ellipsis">
                        {value.newValue === "Good" && (
                          <>
                            <img
                              src="https://rata-web-staging-assets.s3.ap-southeast-1.amazonaws.com/thumb_good.svg"
                              alt="good"
                            />
                            <span
                              className={`${
                                value.newValue === "Good"
                                  ? "text text--good"
                                  : "text text--bad"
                              } `}>
                              Good
                            </span>
                          </>
                        )}
                        {value.newValue === "Bad" && (
                          <>
                            <img
                              src="https://rata-web-staging-assets.s3.ap-southeast-1.amazonaws.com/thumb_bad.svg"
                              alt="bad"
                            />
                            <span
                              className={`${
                                value.newValue === "Good"
                                  ? "text text--good"
                                  : "text text--bad"
                              } `}>
                              Bad
                            </span>
                          </>
                        )}
                        {value.newValue === "No Response" && (
                          <span className="csat-text csat-text--old">
                            No Response
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {value.changedColumn === "PATIENT_SATISFACTION_NOTE" && (
                    <div
                      className="d-flex align-items-center history-list__status-desc"
                      style={{ columnGap: 8 }}>
                      <div className="csat-text csat-text--old">
                        <ReadMore
                          text={value.oldValue ? value.oldValue : "No Response"}
                        />
                      </div>
                      <ArrowRightOutlined />
                      <div className="csat-text">
                        <ReadMore
                          text={value.newValue ? value.newValue : "No Response"}
                        />
                      </div>
                    </div>
                  )}

                  {value.changedColumn === "COMMENT" && (
                    <div
                      className="d-flex align-items-center history-list__status-desc"
                      style={{ columnGap: 8 }}>
                      <div className="csat-text">
                        <HtmlRender
                          content={
                            value.oldValue ? value.oldValue : "No Response"
                          }
                        />
                      </div>
                      <ArrowRightOutlined />
                      <div className="csat-text">
                        <HtmlRender
                          content={
                            value.newValue ? value.newValue : "No Response"
                          }
                        />
                      </div>
                    </div>
                  )}
                </Col>
              </Row>
            </li>
          );
        })}

      {!isEmpty(ticketHistoryListData) &&
      ticketHistoryListData.totalPage > pagination.page ? (
        <Waypoint onEnter={handleLoadMoreHistory} />
      ) : (
        <></>
      )}

      {isLoading && (
        <div className="text-center">
          <Spin size="large" indicator={<LoadingOutlined />} />
        </div>
      )}
    </ul>
  );
}

const mapStateToProps = ({ userList }) => ({
  userList,
});

export default connect(mapStateToProps, {
  getUserById,
})(HistoryLists);
