import { SearchOutlined } from "@ant-design/icons";
import {
  Col,
  Dropdown,
  Input,
  Pagination,
  Row,
  Space,
  Table,
  notification,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { columnsPatientList } from "./constant/columns";
import { usePatients } from "./hooks";
import { isEmpty } from "lodash";
import { PAGE_SIZE_CHANGER } from "src/constants/page_size";

const PatientList = () => {
  const [api, contextHolder] = notification.useNotification();
  const { getPatientList, patients, resetStatus } = usePatients();
  const { getPatients } = patients;

  const [state, setState] = useState({
    keyword: "",
    search: "",
    currentPage: 1,
    perPage: 10,
  });

  useEffect(() => {
    getPatientList({
      keyword: state.search,
      page: state.currentPage,
      size: state.perPage,
    });
  }, [state.search, state.currentPage, state.perPage]);

  useEffect(() => {
    if (getPatients.status === "FAILED") {
      api.error({
        message: getPatients.error.message,
        description: getPatients.error.description,
        duration: 3,
      });
      resetStatus();
    }
  }, [getPatients.status]);

  return (
    <>
      {contextHolder}
      <Content>
        <div className="fw-bold text-md mb-40">Patients</div>

        <Row>
          <Col xs={24}>
            <Input
              size="large"
              type="text"
              placeholder="Search patient..."
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
              columns={columnsPatientList}
              dataSource={!isEmpty(getPatients.data) ? getPatients.data : []}
              pagination={false}
              loading={getPatients.status === "LOADING"}
            />
            <Row justify="end" style={{ padding: 16 }} align="middle">
              <Pagination
                current={state.currentPage}
                onChange={(v) => setState((x) => ({ ...x, currentPage: v }))}
                pageSize={state.perPage}
                showSizeChanger={false}
                total={getPatients.meta?.total || 0}
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

export default PatientList;
