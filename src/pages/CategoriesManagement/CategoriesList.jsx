/* eslint-disable react/prop-types */
import {
  CloseOutlined,
  DeleteTwoTone,
  EditTwoTone,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
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
import { DEFAULT_VALUE_FORM, radioChoice } from "./constants";
import { isEmpty } from "lodash";
import "../../components/Table/styles/index.scss";
import { convertOptions, queryStringify, wordsCapitalize } from "utils/index";
import { connect } from "react-redux";
import { getCategoryList } from "store/action/CategoryAction";
import ticketCategoryApi from "api/ticket-categories";
import { useBusiness } from "pages/ticket/TicketLists/component/Filter/hooks";
import Filter from "./Filter";

export function CategoriesList({ getCategoryList }) {
  const [form] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const { getTicketCategoriesList, ticketCategories, resetStatus } =
    useTicketCategories();
  const { getTicketCategories } = ticketCategories;
  const { categoryList } = ticketCategories;
  const {
    getBusinessList,
    business,
    resetStatus: resetStatusBusiness,
  } = useBusiness();
  const { getBusiness } = business;
  const [showFilter, setShowFilter] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [state, setState] = useState({
    keyword: "",
    search: "",
    currentPage: 1,
    perPage: 10,
  });
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [isAddDataModalOpen, setIsAddDataModalOpen] = useState(false);
  const [isEditDataModalOpen, setIsEditDataModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(DEFAULT_VALUE_FORM);
  const [categoryLevel, setCategoryLevel] = useState(0);
  const [deleteId, setDeleteId] = useState(0);
  const [categoryName, setCategoryName] = useState(0);
  const [categoriesIds, setCategoriesIds] = useState({
    category: null,
    subCategory1: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentName, setCurrentName] = useState("");
  const [jawsValidation, setJawsValidation] = useState(false);
  const [activeFilter, setActiveFilter] = useState({
    businessUnit: null,
    category: null,
    subCategory1: null,
    subCategory2: null,
  });
  const [sortTable, setSortTable] = useState({
    by: "",
    direction: "",
  });

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

  const handleOnEditClose = () => {
    form.setFieldValue("existingName", "");
    setIsEditDataModalOpen(!isEditDataModalOpen);
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
          businessUnit: formValues.businessUnit,
          parent: null,
        };
      } else if (formValues.level == 1) {
        return {
          name: item,
          level: formValues.level,
          businessUnit: formValues.businessUnit,
          parent: categoriesIds.category,
        };
      } else {
        return {
          name: item,
          level: formValues.level,
          businessUnit: formValues.businessUnit,
          parent: categoriesIds.subCategory1,
          jawsMandatory: jawsValidation,
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
    getBusinessList();
  }, [isAddDataModalOpen]);

  useEffect(() => {
    getTicketCategoriesList({
      keyword: state.search,
      page: state.currentPage,
      size: state.perPage,
      ...activeFilter,
      sort: sortTable.by ? `${sortTable.by},${sortTable.direction}` : "",
    });
  }, [
    state.search,
    state.currentPage,
    state.perPage,
    isAddDataModalOpen,
    activeFilter,
    sortTable,
  ]);

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

  useEffect(() => {
    if (getBusiness.status === "FAILED") {
      api.error({
        message: getBusiness.error.message,
        description: getBusiness.error.description,
        duration: 3,
      });
      resetStatusBusiness();
    }
  }, [getBusiness.status]);

  const handleFilterShow = () => {
    setShowFilter(!showFilter);
  };

  const handleDeleteConfirmationShow = (row) => {
    const rowId =
      row.subsubcategory_id != null
        ? row.subsubcategory_id
        : row.subcategory_id != null
          ? row.subcategory_id
          : row.category_id;
    const rowName =
      row.subsubcategory_id != null
        ? row.subsubcategory_name
        : row.subcategory_id != null
          ? row.subcategory_name
          : row.category_name;
    setDeleteId(rowId);
    setCategoryName(rowName);
    setShowDeleteConfirmation(!showDeleteConfirmation);
  };

  const handleOnDeleteClose = () => {
    setShowDeleteConfirmation(!showDeleteConfirmation);
    setDeleteId(0);
  };

  const handleOnDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await ticketCategoryApi.deleteCategory(deleteId);
      if (response.status == 200) {
        message.success("Delete Data Success");
        setDeleteId(0);
        setShowDeleteConfirmation(!showDeleteConfirmation);
        getTicketCategoriesList({
          keyword: state.search,
          page: state.currentPage,
          size: state.perPage,
          ...activeFilter,
          sort: sortTable.by ? `${sortTable.by},${sortTable.direction}` : "",
        });
      } else {
        message.error("Delete Data Failed");
      }
    } catch (err) {
      const errMessage = err.response.data.message;
      message.error(errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditConfirmationShow = (row) => {
    setIsEditDataModalOpen(!isEditDataModalOpen);

    const level = row.subsubcategory_id ? 2 : row.subcategory_id ? 1 : 0;
    setCategoryLevel(level);

    formEdit.setFieldValue("category_id", row.category_id);
    formEdit.setFieldValue("category_name", row.category_name);
    formEdit.setFieldValue("subcategory_id", row.subcategory_id);
    formEdit.setFieldValue("subcategory_name", row.subcategory_name);
    formEdit.setFieldValue("subsubcategory_id", row.subsubcategory_id);
    formEdit.setFieldValue("subsubcategory_name", row.subsubcategory_name);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const payload = [];
    if (formEdit.getFieldValue("category_id")) {
      payload.push({
        id: formEdit.getFieldValue("category_id"),
        name: formEdit.getFieldValue("category_name"),
      });
    }
    if (formEdit.getFieldValue("subcategory_id")) {
      payload.push({
        id: formEdit.getFieldValue("subcategory_id"),
        name: formEdit.getFieldValue("subcategory_name"),
      });
    }
    if (formEdit.getFieldValue("subsubcategory_id")) {
      payload.push({
        id: formEdit.getFieldValue("subsubcategory_id"),
        name: formEdit.getFieldValue("subsubcategory_name"),
      });
    }

    try {
      const response = await ticketCategoryApi.editCategory(payload);
      if (response.status === 200) {
        message.success("The category has been successfully updated");
        handleOnEditClose();
        getTicketCategoriesList({
          keyword: state.search,
          page: state.currentPage,
          size: state.perPage,
          ...activeFilter,
          sort: sortTable.by ? `${sortTable.by},${sortTable.direction}` : "",
        });
      } else {
        message.error("Update failed");
      }
    } catch (error) {
      console.error("Edit category error:", error);
      message.error(
        error.response?.data?.message || "Failed to update category"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const columnsTicketCategories = [
    {
      title: "Business Unit",
      dataIndex: "business_unit",
      render: (v) => wordsCapitalize(v) || "-",
      sorter: true,
    },
    {
      title: "Category Name",
      dataIndex: "category_name",
      render: (v) => wordsCapitalize(v) || "-",
      sorter: true,
    },
    {
      title: "Sub Category 1",
      dataIndex: "subcategory_name",
      render: (v) => wordsCapitalize(v) || "-",
      sorter: true,
    },
    {
      title: "Sub Category 2",
      dataIndex: "subsubcategory_name",
      render: (v) => wordsCapitalize(v) || "-",
      sorter: true,
    },
    {
      title: "Created Date",
      dataIndex: "created_date",
      render: (v) => wordsCapitalize(v) || "-",
    },
    {
      title: "Action",
      render: (row) => (
        <>
          <Tooltip title="Edit Data">
            <Button
              type="text"
              onClick={() => handleEditConfirmationShow(row)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <EditTwoTone twoToneColor="#0e07e6" />
            </Button>
          </Tooltip>
          <Tooltip title="Delete Data">
            <Button
              type="text"
              onClick={() => handleDeleteConfirmationShow(row)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <DeleteTwoTone twoToneColor="#b50537" />
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

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
            <Tooltip title="Filter">
              <Button
                icon={<FilterOutlined />}
                className="mr-10"
                onClick={handleFilterShow}
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
              onChange={(_p, _f, pSorter) => {
                const { field, order } = pSorter;
                setSortTable({
                  by: field,
                  direction: order === "ascend" ? "ASC" : "DESC",
                });
              }}
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
            // disabled={formValues.name.length < 1 || !formValues.businessUnit.length}
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

          {formValues.level === 0 && (
            <Form.Item
              label="Business Unit"
              name="businessUnit"
              rules={[
                { required: true, message: "Please select Business Unit" },
              ]}
            >
              <Select
                className="mb-10"
                showSearch
                filterOption={(input, option) => {
                  return (
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
                options={
                  !isEmpty(getBusiness.data)
                    ? convertOptions(getBusiness.data, "name", "name")
                    : []
                }
                placeholder={"Select Business Unit"}
                onChange={(c) =>
                  setFormValues((x) => ({ ...x, businessUnit: c }))
                }
              />
            </Form.Item>
          )}

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
                  setCurrentName("");
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
          <Row gutter={10}>
            {formValues.level === 2 && (
              <Col xs={20}>
                <Checkbox
                  value={jawsValidation}
                  onClick={() => setJawsValidation(!jawsValidation)}
                >
                  Add Rahang Information
                </Checkbox>
              </Col>
            )}
          </Row>
        </Form>
      </Modal>

      <Modal
        visible={showDeleteConfirmation}
        footer={undefined}
        destroyOnClose
        title="Delete Confirmation"
        onCancel={() => handleOnDeleteClose()}
        onOk={() => handleOnDeleteConfirm()}
      >
        <h3>
          Are you sure you want to delete this category : {categoryName}?{" "}
        </h3>
      </Modal>

      <Modal
        forceRender
        title="Edit Category"
        open={isEditDataModalOpen}
        onCancel={() => handleOnEditClose()}
        footer={[
          <Button
            size="large"
            key="back"
            onClick={() => handleOnEditClose()}
            loading={isLoading}
          >
            Cancel
          </Button>,
          <Button
            size="large"
            key="button"
            htmlType="button"
            type="primary"
            form="edit-categories-form"
            loading={isLoading}
            onClick={handleSubmit}
          >
            Submit
          </Button>,
        ]}
      >
        <Form form={formEdit} id="edit-categories-form">
          <Row gutter={5}>
            {formEdit.getFieldValue("category_id") && (
              <Col xs={20}>
                <Form.Item
                  label="Category"
                  name="category_name"
                  validateTrigger="onBlur"
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            )}
            {formEdit.getFieldValue("subcategory_id") && (
              <Col xs={20}>
                <Form.Item
                  label="Sub Category 1"
                  name="subcategory_name"
                  validateTrigger="onBlur"
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            )}
            {formEdit.getFieldValue("subsubcategory_id") && (
              <Col xs={20}>
                <Form.Item
                  label="Sub Category 2"
                  name="subsubcategory_name"
                  validateTrigger="onBlur"
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </Modal>
      <Filter show={showFilter} setActiveFilter={(v) => setActiveFilter(v)} />
    </>
  );
}

const mapStateToProps = ({ categoryList }) => ({
  categoryList,
});

export default connect(mapStateToProps, {
  getCategoryList,
})(CategoriesList);
