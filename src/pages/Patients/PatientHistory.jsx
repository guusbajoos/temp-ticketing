import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Avatar,
  Card,
  Col,
  Pagination,
  Row,
  Typography,
  notification,
} from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";

import { usePatients } from "./hooks";
import dayjs from "dayjs";
import {
  generateColorHsl,
  getInitials,
  getRange,
  textReplacement,
  wordsCapitalize,
} from "utils/index";

const PatientHistory = () => {
  const [api, contextHolder] = notification.useNotification();
  const { phoneNumber } = useParams();

  const { getPatientHistory, patients, resetStatus } = usePatients();
  const { getPatientHistoryByPhoneNumber } = patients;

  const [state, setState] = useState({
    currentPage: 1,
    perPage: 10,
  });

  useEffect(() => {
    getPatientHistory(phoneNumber, {
      page: state.currentPage,
      size: state.perPage,
    });
  }, [phoneNumber, state.currentPage, state.perPage]);

  useEffect(() => {
    if (getPatientHistoryByPhoneNumber.status === "FAILED") {
      api.error({
        message: getPatientHistoryByPhoneNumber.error.message,
        description: getPatientHistoryByPhoneNumber.error.description,
      });
      resetStatus();
    }
  }, [getPatientHistoryByPhoneNumber.status]);

  const lightnessRange = getRange(50, 10);
  const saturationRange = getRange(50, 10);

  return (
    <>
      {contextHolder}

      <Content>
        <div style={{ marginBottom: 50 }}>
          <Typography.Title level={4}>History Patient</Typography.Title>
        </div>

        {getPatientHistoryByPhoneNumber?.histories?.length > 0 ? (
          getPatientHistoryByPhoneNumber?.histories?.map((history) => {
            const username = history?.user?.name || "Anonymous";
            const initialsName = getInitials(username);
            const bgColor = generateColorHsl(
              username,
              saturationRange,
              lightnessRange
            );

            const fieldColumn =
              wordsCapitalize(history.changedColumn) === "Another Phone"
                ? "Secondary Phone"
                : wordsCapitalize(history.changedColumn);

            return (
              <Card
                key={history.id}
                bordered={false}
                styles={{
                  body: {
                    marginBottom: 24,
                  },
                }}
                style={{ boxShadow: "none" }}
                loading={getPatientHistoryByPhoneNumber.status === "LOADING"}
              >
                <Row
                  type="flex"
                  style={{ flexWrap: "nowrap" }}
                  key={history.id}
                >
                  <Col>
                    <Avatar
                      size={60}
                      style={{
                        marginRight: 30,
                        backgroundColor: bgColor,
                        verticalAlign: "middle",
                        fontWeight: 500,
                      }}
                    >
                      {initialsName}
                    </Avatar>
                  </Col>
                  <div style={{ width: "100%" }}>
                    <Row
                      style={{
                        width: "100%",
                      }}
                      type="flex"
                    >
                      <Col xs={12} style={{ marginBottom: 10 }}>
                        <Typography.Title
                          level={4}
                          style={{ marginBottom: 0 }}
                          ellipsis
                        >
                          {history?.user?.name || "Anonymous"}
                        </Typography.Title>
                      </Col>
                      <Col xs={12} style={{ textAlign: "end" }}>
                        <Typography.Text>
                          {dayjs(history.createdAt).format(
                            "HH:mm, DD MMMM YYYY"
                          )}
                        </Typography.Text>
                      </Col>
                    </Row>

                    {["CREATED", "DELETED"].includes(history.changedColumn) ? (
                      <Typography.Text>
                        {textReplacement(history.changedColumn)} the{" "}
                        <Typography.Text strong>Patient</Typography.Text>
                      </Typography.Text>
                    ) : (
                      <>
                        <Typography.Text>
                          Change the{" "}
                          <Typography.Text strong>
                            {fieldColumn}
                          </Typography.Text>
                        </Typography.Text>
                        <Row align="middle">
                          <Col xs={24}>
                            <Typography.Text>
                              <span style={{ color: "#c9c9c9" }}>
                                {history.oldValue || "-"}
                              </span>
                            </Typography.Text>
                            <ArrowRightOutlined style={{ margin: "0 8px" }} />
                            <Typography.Text>
                              {history.newValue || "-"}
                            </Typography.Text>
                          </Col>
                        </Row>
                      </>
                    )}
                  </div>
                </Row>
              </Card>
            );
          })
        ) : (
          <div style={{ textAlign: "center" }}>
            <Typography.Title level={4}>
              Oops, there is no history list available yet.
            </Typography.Title>
          </div>
        )}
        {getPatientHistoryByPhoneNumber?.histories?.length > 0 && (
          <Row justify="end" style={{ padding: 16 }} align="middle">
            <Pagination
              current={state.currentPage}
              onChange={(v) => setState((x) => ({ ...x, currentPage: v }))}
              pageSize={state.perPage}
              showSizeChanger={false}
              total={5}
            />
          </Row>
        )}
      </Content>
    </>
  );
};

export default PatientHistory;
