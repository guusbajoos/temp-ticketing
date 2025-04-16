import {
  EditOutlined,
  SearchOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Dropdown,
  Input,
  Pagination,
  Row,
  Space,
  Table,
  Typography,
  notification,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { usePatients } from "./hooks";
import { Link, useParams } from "react-router-dom";
import PatientInfo from "./components/PatientInfo";
import PatientProfile from "./components/PatientProfile";
import PatientBreadcrumb from "./components/PatientBreadcrumb";
import { columnsPatientRelatedTicketList } from "./constant/columns";
import { PAGE_SIZE_CHANGER } from "src/constants/page_size";
import { isEmpty } from "lodash";

const PatientDetail = () => {
  const [api, contextHolder] = notification.useNotification();
  const { phoneNumber } = useParams();

  const {
    getPatientByPhoneNumber,
    getPatientTicketsByPhoneNumber,
    patients,
    resetStatus,
  } = usePatients();
  const { getPatientByPhone, getPatientTickets } = patients;

  const [state, setState] = useState({
    keyword: "",
    search: "",
    currentPage: 1,
    perPage: 10,
  });

  useEffect(() => {
    if (phoneNumber) getPatientByPhoneNumber(phoneNumber);
  }, [phoneNumber]);

  useEffect(() => {
    getPatientTicketsByPhoneNumber(phoneNumber, {
      keyword: state.search,
      page: state.currentPage,
      size: state.perPage,
    });
  }, [phoneNumber, state.search, state.currentPage, state.perPage]);

  useEffect(() => {
    if (getPatientByPhone.status === "FAILED") {
      api.error({
        message: getPatientByPhone.error.message,
        description: getPatientByPhone.error.description,
      });
      resetStatus();
    }
  }, [getPatientByPhone.status]);

  return (
    <>
      {contextHolder}
      <Content>
        <PatientBreadcrumb
          pageTitle="Patient Detail"
          patient={getPatientByPhone?.detail?.patient?.patient_name}
        />
        <Card
          bordered={false}
          loading={getPatientByPhone?.status === "LOADING"}
          bodyStyle={{ padding: 0 }}
          style={{ marginBottom: 60, boxShadow: "none" }}
        >
          <Row justify="space-between" align="top">
            <Col xs={12}>
              <PatientInfo
                label="Name"
                value={getPatientByPhone?.detail?.patient?.patient_name}
              />
              <PatientInfo
                label="Phone"
                value={`${
                  getPatientByPhone?.detail?.patient?.phone?.main_phone
                    ? `${getPatientByPhone?.detail?.patient?.phone?.main_phone} (main)`
                    : "-"
                }`}
                secondaryPhone={
                  getPatientByPhone?.detail?.patient?.phone?.secondary_phone
                }
              />
            </Col>
            <Col xs={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  gap: 10,
                }}
              >
                <Link to={`/patients/edit/${phoneNumber}?from=detail-patient`}>
                  <EditOutlined style={{ marginRight: 5 }} />
                  <Typography.Text strong>Edit Data</Typography.Text>
                </Link>
                <Link to={`/patients/${phoneNumber}/history`}>
                  <HistoryOutlined style={{ marginRight: 5 }} />
                  <Typography.Text strong>History Data</Typography.Text>
                </Link>
              </div>
            </Col>
          </Row>
          <Row gutter={[40, 40]} style={{ marginTop: 25 }}>
            <Col xs={4}>
              <PatientProfile
                labelCard="BE"
                value={getPatientByPhone?.detail?.profile?.be}
                labelValue="Visit BE profile"
                labelNotFound="Number not found"
              />
            </Col>
            <Col xs={4}>
              <PatientProfile
                labelCard="Infobip"
                value={getPatientByPhone?.detail?.profile?.infobip}
                labelValue="Visit Infobip profile"
                labelNotFound="Not linked yet"
              />
            </Col>
            <Col xs={4}>
              <PatientProfile
                labelCard="Medical Record"
                value={getPatientByPhone?.detail?.profile?.emr}
                labelValue="Visit medical record"
                labelNotFound="Number not found"
              />
            </Col>
          </Row>
        </Card>
        <Row>
          <Col xs={24}>
            <Input
              size="large"
              type="text"
              placeholder="Search ticket..."
              onChange={(e) => {
                if (e.target.value.length > 0) {
                  setState((prev) => ({
                    ...prev,
                    keyword: e.target.value,
                  }));
                } else {
                  setState((prev) => ({ ...prev, keyword: "", search: "" }));
                }
              }}
              onPressEnter={() =>
                setState((prev) => ({
                  ...prev,
                  search: state.keyword,
                  currentPage: 1,
                  perPage: 10,
                }))
              }
              addonAfter={
                <SearchOutlined
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      search: state.keyword,
                      currentPage: 1,
                      perPage: 10,
                    }))
                  }
                />
              }
              className="mb-20"
              allowClear
            />
          </Col>
          <Col xs={24}>
            <Table
              columns={columnsPatientRelatedTicketList}
              dataSource={
                !isEmpty(getPatientTickets.tickets)
                  ? getPatientTickets.tickets
                  : []
              }
              pagination={false}
              loading={getPatientTickets.status === "LOADING"}
            />
            <Row justify="end" style={{ padding: 16 }} align="middle">
              <Pagination
                current={state.currentPage}
                onChange={(v) => setState((x) => ({ ...x, currentPage: v }))}
                pageSize={state.perPage}
                showSizeChanger={false}
                total={getPatientTickets.meta?.total || 0}
              />
              <Dropdown
                trigger="click"
                menu={{
                  items: PAGE_SIZE_CHANGER,
                  onClick: (v) =>
                    setState((x) => ({
                      ...x,
                      perPage: parseInt(v.key),
                      currentPage: 1,
                    })),
                  selectable: true,
                  selectedKeys: [String(state.perPage)],
                }}
                placement="bottom"
              >
                <div
                  style={{
                    border: "1px solid #b1b4b5",
                    borderRadius: 3,
                    marginLeft: 16,
                    color: "#252525",
                    padding: "0px 11px",
                    cursor: "pointer",
                  }}
                >
                  <Space align="center" style={{ height: 30 }}>
                    <span>{state.perPage} / page</span>
                    <span
                      style={{ fontSize: 12, color: "rgba(0, 0, 0, 0.25)" }}
                    >
                      <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="down"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
                      </svg>
                    </span>
                  </Space>
                </div>
              </Dropdown>
            </Row>
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default PatientDetail;
