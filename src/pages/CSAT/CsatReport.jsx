import { useEffect, useState } from "react";
import { Content } from "antd/lib/layout/layout";
import CSATSummary from "./components/CSATSummary";
import CSATCategory from "./components/CSATCategory";
import { Col, Input, Row, Space, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { CSATDatePeriod } from "./components/CSATPeriod";
import { columns } from "./constant/table";
import { useCSAT } from "./hooks";
import "./index.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { isEmpty } from "lodash";
import { useDispatch } from "react-redux";
import { getCategoryBusiness } from "store/action/CategoryAction";
import { useSelector } from "react-redux";
import { useDebounceFn } from "ahooks";

export default function CSATReport() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [classNameSelectedCard, setClassNameSelectedCard] = useState(
    "csat-report-response"
  );
  const categoryBusiness = useSelector((state) => state["categoryBusiness"]);

  const location = useLocation();
  const {
    tableParams,
    csatSummaryList,
    ticketCsatList,
    activeFilter,
    contextHolder,
    setTableParams,
    handleFilterSummary,
    setActiveFilter,
    getDataSummaryCSAT,
    getDataTableCSAT,
    isStatusCSATTable,
    handleTableChange,
    handleSearchTable,
    setIsStatusCSATTable,
    isMounted,
  } = useCSAT();

  const searchDebounce = useDebounceFn(
    (v) => {
      setTableParams({
        ...tableParams,
        keyword: v,
      });
    },
    {
      wait: 1000,
    }
  );

  useEffect(() => {
    isMounted.current = false;
    return () => {
      isMounted.current = true;
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted.current) {
      setClassNameSelectedCard("csat-report-response");
      navigate("", { replace: true });
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    getDataSummaryCSAT(activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    getDataTableCSAT(activeFilter);
  }, [
    tableParams.keyword,
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
    activeFilter,
  ]);

  useEffect(() => {
    dispatch(getCategoryBusiness({ "with-categories": false }));
  }, []);

  const { currentElements } = ticketCsatList;

  return (
    <>
      {contextHolder}
      <Content className="csat-report">
        <div>
          <div>
            <div className="fw-bold text-md mb-40 dashboard__title panel">
              CSAT Report
            </div>
          </div>
          <div className="panel panel--secondary">
            <Row gutter={20}>
              <Col span={6}>
                <CSATCategory
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  historyParams={location.search}
                  businessOptions={categoryBusiness.data}
                />
              </Col>
              <Col span={12}>
                <CSATDatePeriod
                  setIsStatusCSATTable={setIsStatusCSATTable}
                  setClassNameSelectedCard={setClassNameSelectedCard}
                  historyParams={location.search}
                  setActiveFilter={setActiveFilter}
                  activeFilter={activeFilter}
                />
              </Col>
            </Row>
          </div>
          <CSATSummary
            data={csatSummaryList?.data}
            classNameSelectedCard={classNameSelectedCard}
            setClassNameSelectedCard={setClassNameSelectedCard}
            handleFilterSummary={handleFilterSummary}
          />
          <Space.Compact
            className="mb-20"
            style={{
              width: "30%",
            }}
          >
            <Input
              allowClear
              size="large"
              type="text"
              placeholder="Search ticket..."
              onChange={(e) => {
                if (e.target.value === "") {
                  setIsStatusCSATTable(true);
                  searchDebounce.run("");
                } else {
                  searchDebounce.run(e.target.value);
                }
              }}
              onPressEnter={handleSearchTable}
              addonAfter={<SearchOutlined onClick={handleSearchTable} />}
            />
          </Space.Compact>

          <Row>
            <Col span={24}>
              <Table
                columns={columns}
                rowKey={(record) => record.key}
                dataSource={!isEmpty(currentElements) ? currentElements : []}
                pagination={tableParams.pagination}
                loading={isStatusCSATTable}
                onChange={handleTableChange}
              />
            </Col>
          </Row>
        </div>
      </Content>
    </>
  );
}
