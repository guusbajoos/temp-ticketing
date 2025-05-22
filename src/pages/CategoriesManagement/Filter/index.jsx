/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { Row, Col, Button, Form } from "antd";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import SelectDropdown from "components/SelectDropdown";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import {
  getCategoryByBusiness,
  getCategoryList,
} from "store/action/CategoryAction";
import { convertOptions } from "utils/index";
import { filterSelectedCategory } from "pages/ticket/helper";
import { useEffect } from "react";
import api from "api/index";
import { Select } from "antd";
import { useSelector } from "react-redux";
import JawsApi from "api/jaws";
import { useBusiness } from "pages/ticket/TicketLists/component/ModalAdd/hooks";

export const Filter = ({
  getCategoryByBusiness,
  categoryList,
  show,
  setActiveFilter,
  onResetState,
}) => {
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [isSubCategory1Selected, setIsSubCategory1Selected] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory1, setSelectedSubCategory1] = useState("");
  const [category, setCategory] = useState(false);
  const [subCategory1, setSubCategory1] = useState(false);
  const [_, setIsRahangSetActive] = useState(false);
  const [form] = Form.useForm();

  const { getBusinessList, business, resetStatus } = useBusiness();

  const { getBusiness } = business;

  const categoryByBusiness = useSelector(
    (state) => state["categoryByBusiness"]
  );

  const handleBusinessUnitChange = async (value) => {
    onResetState();

    setActiveFilter({
      businessUnit: value,
      category: null,
      sub_category_1: null,
      sub_category_2: null,
    });

    await getCategoryByBusiness({ unit: value });
    form.setFieldsValue({
      category: undefined,
      sub_category_1: undefined,
      sub_category_2: undefined,
    });
    setIsCategorySelected(false);
    setIsSubCategory1Selected(false);
  };

  const handleCategory = (val) => {
    onResetState();

    setActiveFilter((prev) => ({
      ...prev,
      category: val,
      sub_category_1: null,
      sub_category_2: null,
    }));

    const find = categoryList.find((item) => item.id === Number(val));
    setCategory(find.id);
    setIsCategorySelected(true);
    form.setFieldsValue({
      sub_category_1: undefined,
      sub_category_2: undefined,
    });
    setIsSubCategory1Selected(false);
  };

  const handleSubCat1 = (val) => {
    onResetState();

    setActiveFilter((prev) => ({
      ...prev,
      sub_category_1: val,
      sub_category_2: null,
    }));

    const find = subCategory1Array.find((item) => item.id === Number(val));

    setSubCategory1(find.id);
  };

  const handleRahang = async (subCategory2) => {
    onResetState();
    setIsRahangSetActive(false);

    const { data } = await JawsApi.validation(
      category,
      subCategory1,
      subCategory2
    );

    if (data.mandatory) {
      setIsRahangSetActive(true);
    } else {
      setIsRahangSetActive(false);
    }
  };

  const handleFormValuesChange = (changedValues) => {
    const formFieldName = Object.keys(changedValues)[0];

    if (formFieldName === "category") {
      setSelectedCategory(changedValues[formFieldName]);
      setIsCategorySelected(true);
      form.setFieldsValue({ sub_category_1: undefined });
      form.setFieldsValue({ sub_category_2: undefined });
    }

    if (formFieldName === "sub_category_1") {
      setSelectedSubCategory1(changedValues[formFieldName]);
      setIsSubCategory1Selected(true);
      form.setFieldsValue({ sub_category_2: undefined });
    }

    setActiveFilter({
      businessUnit: form.getFieldValue("businessUnit"),
      category: form.getFieldValue("category"),
      sub_category_1: form.getFieldValue("sub_category_1"),
      sub_category_2: form.getFieldValue("sub_category_2"),
    });
  };

  const categorySelectedArray = filterSelectedCategory(
    categoryByBusiness?.data,
    selectedCategory,
    null,
    "category"
  );

  const subCategory1Array = !isEmpty(categorySelectedArray)
    ? categorySelectedArray[0].subcategories
    : [];

  const subCategory1SelectedArray = filterSelectedCategory(
    subCategory1Array,
    selectedSubCategory1,
    null,
    "subCategory1"
  );

  const subCategory2Array = !isEmpty(subCategory1SelectedArray)
    ? subCategory1SelectedArray[0].subcategories
    : [];

  const decideDisplay = (show) => {
    if (show) {
      return "block";
    }
    return "none";
  };

  useEffect(() => {
    getBusinessList();
  }, []);

  useEffect(() => {
    if (getBusiness.status === "FAILED") {
      api.error({
        message: getBusiness.error.message,
        description: getBusiness.error.description,
        duration: 3,
      });
      resetStatus();
    }
  }, [getBusiness.status]);

  return (
    <div
      className="filter"
      style={{ display: decideDisplay(show), top: 130, right: 115 }}
    >
      <Row type="flex" gutter={20} className="mb-15">
        <Col xs={12} type="flex" align="start">
          <div className="text-base">
            <strong>Filters</strong>
          </div>
        </Col>
        <Col xs={12} type="flex" align="end">
          <Button
            onClick={() => {
              setIsCategorySelected(false);
              setIsSubCategory1Selected(false);
              setSelectedCategory("");
              setSelectedSubCategory1("");
              setCategory(false);
              setSubCategory1(false);
              setActiveFilter({});
              onResetState();
              form.resetFields();
            }}
            type="link"
          >
            Reset
          </Button>
        </Col>
      </Row>
      <Form
        form={form}
        onValuesChange={handleFormValuesChange}
        id={"categories"}
      >
        <Row gutter={20}>
          <Col xs={12}>
            <Form.Item
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
                onChange={handleBusinessUnitChange}
              />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item name="category">
              <Select
                placeHolder={"Main Category"}
                options={
                  !isEmpty(categoryByBusiness?.data)
                    ? convertOptions(categoryByBusiness?.data, "name", "id")
                    : []
                }
                placeholder={"Select Category"}
                onChange={handleCategory}
                disabled={
                  categoryByBusiness.status === "LOADING" ||
                  form.getFieldValue("businessUnit") === ""
                }
              />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item name="sub_category_1">
              <Select
                className="mb-10"
                showSearch
                filterOption={(input, option) => {
                  return (
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
                disabled={isCategorySelected ? false : true}
                options={
                  !isEmpty(subCategory1Array)
                    ? convertOptions(subCategory1Array, "name", "id")
                    : []
                }
                placeholder={"Select Sub Category 1"}
                onChange={handleSubCat1}
              />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item name="sub_category_2">
              <Select
                className="mb-10"
                showSearch
                filterOption={(input, option) => {
                  return (
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
                disabled={isSubCategory1Selected ? false : true}
                options={
                  !isEmpty(subCategory2Array)
                    ? convertOptions(subCategory2Array, "name", "id")
                    : []
                }
                placeholder={"Select Sub Category 2"}
                onChange={handleRahang}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

const mapStateToProps = ({ categoryList }) => ({
  categoryList,
});

export default connect(mapStateToProps, {
  getCategoryList,
  getCategoryByBusiness,
})(Filter);
