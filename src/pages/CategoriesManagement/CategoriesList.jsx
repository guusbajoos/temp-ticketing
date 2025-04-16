/* eslint-disable react/prop-types */
import { CloseOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  notification,
  Pagination,
  Radio,
  Row,
  Select,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useTicketCategories } from "./hooks";
import {
  columnsTicketCategories,
  DEFAULT_VALUE_FORM,
  radioChoice,
} from "./constants";
import { isEmpty } from "lodash";
import "../../components/Table/styles/index.scss";
import { convertOptions, queryStringify } from "utils/index";
import { connect } from "react-redux";
import { getCategoryList } from "store/action/CategoryAction";
import ticketCategoryApi from "api/ticket-categories";

export function CategoriesList({ getCategoryList }) {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const { getTicketCategoriesList, ticketCategories, resetStatus } =
    useTicketCategories();
  const { getTicketCategories } = ticketCategories;
  const { categoryList } = ticketCategories;
  const [state, setState] = useState({
    keyword: "",
    search: "",
    currentPage: 1,
    perPage: 10,
  });
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [isAddDataModalOpen, setIsAddDataModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(DEFAULT_VALUE_FORM);
  const [categoriesIds, setCategoriesIds] = useState({
    category: null,
    subCategory1: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentName, setCurrentName] = useState('')

  const handleOnClose = () => {
    setFormValues({
      name: [],
      parent: null,
      level: 0,
    });
    form.setFieldValue("currentName", "");
    setIsAddDataModalOpen(!isAddDataModalOpen);
    form.resetFields();
  };

  async function getCategoryListData() {
    try {
      await getCategoryList(
        queryStringify({
          page: 1,
          size: Number.MAX_SAFE_INTEGER,
          level: 0,
          sort: "name,ASC",
        })
      );
    } catch (err) {
      if (err.response) {
        if (err.response.status !== 401) {
          const errMessage = err.response.data.message;
          message.error(errMessage);
        }
      }
    }
  }

  const onSubmit = async () => {
    setIsLoading(true);
    const payload = formValues.name.map((item) => {
      if (formValues.level == 0) {
        return {
          name: item,
          level: formValues.level,
          parent: null,
        };
      } else if (formValues.level == 1) {
        return {
          name: item,
          level: formValues.level,
          parent: categoriesIds.category,
        };
      } else {
        return {
          name: item,
          level: formValues.level,
          parent: categoriesIds.subCategory1,
        };
      }
    });

    try {
      const response = await ticketCategoryApi.addCategory(payload);
      if (response.status == 201) {
        message.success("Add Data Success");
        handleOnClose();
      } else {
        message.error("Add Data Failed");
      }
    } catch (err) {
      const errMessage = err.response.data.message;
      message.error(errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnChangeRadio = (e) => {
    setFormValues({
      level: e.target.value,
      name: [],
      parent: null,
    });
    setCategoriesIds({
      category: null,
      subCategory1: null,
    });
  };

  useEffect(() => {
    getCategoryListData();
  }, [isAddDataModalOpen]);

  useEffect(() => {
    getTicketCategoriesList({
      keyword: state.search,
      page: state.currentPage,
      size: state.perPage,
    });
  }, [state.search, state.currentPage, state.perPage, isAddDataModalOpen]);

  useEffect(() => {
    if (getTicketCategories.status === "FAILED") {
      api.error({
        message: getTicketCategories.error.message,
        description: getTicketCategories.error.description,
        duration: 3,
      });
      resetStatus();
    }
  }, [getTicketCategories.status]);

  return (
    <>
      {contextHolder}
      <Content>
        <Row gutter={20} type="flex" className="table-global__row">
          <Col xs={12}>
            <div className="mb-15">
              {isShowSearch ? (
                <div className="table-global__search">
                  <Input
                    size="large"
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => {
                      if (e.target.value.length > 0) {
                        setState((prev) => ({
                          ...prev,
                          keyword: e.target.value,
                        }));
                      } else {
                        setState((prev) => ({
                          ...prev,
                          keyword: "",
                          search: "",
                        }));
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
                    allowClear
                  />
                </div>
              ) : (
                <strong className="text-md table-global__title">
                  Ticket Category
                </strong>
              )}
            </div>
          </Col>
          <Col xs={12} type="flex" align="end">
            <Tooltip title="Search">
              <Button
                onClick={() => setIsShowSearch(!isShowSearch)}
                icon={isShowSearch ? <CloseOutlined /> : <SearchOutlined />}
                className="mr-10"
              />
            </Tooltip>
            <Tooltip title="Add Data">
              <Button
                icon={<PlusOutlined />}
                className="mr-10"
                onClick={() => setIsAddDataModalOpen(!isAddDataModalOpen)}
              />
            </Tooltip>
          </Col>
          <Col xs={24}>
            <Table
              columns={columnsTicketCategories}
              dataSource={
                !isEmpty(getTicketCategories.data)
                  ? getTicketCategories.data
                  : []
              }
              pagination={false}
              loading={getTicketCategories.status === "LOADING"}
            />
            <Row justify="end" style={{ padding: 16 }} align="middle">
              <Pagination
                current={state.currentPage}
                onChange={(v) => setState((x) => ({ ...x, currentPage: v }))}
                pageSize={state.perPage}
                showSizeChanger={true}
                onShowSizeChange={(c, ps) =>
                  setState((x) => ({ ...x, perPage: ps }))
                }
                total={getTicketCategories.meta?.total || 0}
              />
            </Row>
          </Col>
        </Row>
      </Content>
      <Modal
        forceRender
        destroyOnClose
        title="Add New Category"
        visible={isAddDataModalOpen}
        // onOk={() => onSubmit()}
        onCancel={() => handleOnClose()}
        footer={[
          <Button
            size="large"
            key="back"
            onClick={() => handleOnClose()}
            loading={isLoading}
          >
            Cancel
          </Button>,
          <Button
            size="large"
            key="submit"
            htmlType="submit"
            type="primary"
            form="addCategoriesForm"
            disabled={formValues.name.length < 1}
            loading={isLoading}
          >
            Submit
          </Button>,
        ]}
      >
        <Form onFinish={() => onSubmit()} form={form} id="addCategoriesForm">
          <Form.Item>
            <Radio.Group
              onChange={(v) => handleOnChangeRadio(v)}
              value={formValues.level}
            >
              {radioChoice.map((item) => (
                <Radio key={item.value} value={item.value}>
                  {item.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          {(formValues.level === 1 || formValues.level === 2) && (
            <Form.Item
              label="Category"
              name="category"
              rules={[
                {
                  required: formValues.level === 1 || formValues.level === 2,
                  message: "Please Select Category",
                },
              ]}
            >
              <Select
                showSearch
                size="large"
                filterOption={(input, option) => {
                  return (
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
                options={
                  !isEmpty(categoryList)
                    ? convertOptions(categoryList, "name", "id")
                    : []
                }
                placeholder={"Select Category"}
                onChange={(v) =>
                  setCategoriesIds((current) => ({
                    ...current,
                    category: Number(v),
                  }))
                }
              />
            </Form.Item>
          )}
          {formValues.level === 2 && (
            <Form.Item
              label="Sub Category1"
              name="sub_category1"
              rules={[
                {
                  required: formValues.level === 2,
                  message: "Please Select Sub Category 1",
                },
              ]}
            >
              <Select
                showSearch
                size="large"
                filterOption={(input, option) => {
                  return (
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
                options={
                  !isEmpty(
                    categoryList?.find(
                      (item) => item.id === categoriesIds.category
                    )
                  )
                    ? convertOptions(
                        categoryList?.find(
                          (item) => item.id === categoriesIds.category
                        ).subcategories,
                        "name",
                        "id"
                      )
                    : []
                }
                placeholder={"Select Category"}
                onChange={(v) =>
                  setCategoriesIds((current) => ({
                    ...current,
                    subCategory1: Number(v),
                  }))
                }
              />
            </Form.Item>
          )}
          <Row gutter={5}>
            <Col xs={20}>
              <Form.Item
                label={
                  formValues.level === 0
                    ? "Category"
                    : formValues.level === 1
                      ? "Sub Category 1"
                      : "Sub Category 2"
                }
                name="currentName"
                validateTrigger="onBlur"
              >
                <Input
                  placeholder={`${
                    formValues.level === 0
                      ? "Category"
                      : formValues.level === 1
                        ? "Sub Category 1"
                        : "Sub Category 2"
                  } Name`}
                  size="large"
                  value={currentName}
                  onChange={(e) => setCurrentName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={4}>
              <Button
                size="large"
                disabled={currentName?.length < 3}
                onClick={() => {
                  setFormValues((x) => ({
                    ...x,
                    name: [...x.name, currentName],
                  }));
                  form.setFieldValue("currentName", "");
                  setCurrentName("")
                }}
              >
                Add
              </Button>
            </Col>
          </Row>
          <Row gutter={10}>
            {formValues.name.map((item, index) => (
              <Tag key={index}>{item}</Tag>
            ))}
          </Row>
        </Form>
      </Modal>
    </>
  );
}

const mapStateToProps = ({ categoryList }) => ({
  categoryList,
});

export default connect(mapStateToProps, {
  getCategoryList,
})(CategoriesList);
