import { wordsCapitalize } from "utils/index";

export const columnsTicketCategories = [
  {
    title: "Business Unit",
    dataIndex: "business_unit",
    render: (v) => wordsCapitalize(v) || "-",
  },{
    title: "Category Name",
    dataIndex: "category_name",
    render: (v) => wordsCapitalize(v) || "-",
  },
  {
    title: "Sub Category 1",
    dataIndex: "subcategory_name",
    render: (v) => wordsCapitalize(v) || "-",
  },
  {
    title: "Sub Category 2",
    dataIndex: "subsubcategory_name",
    render: (v) => wordsCapitalize(v) || "-",
  },{
    title: "Created Date",
    dataIndex: "created_date",
    render: (v) => wordsCapitalize(v) || "-",
  },
];

export const radioChoice = [
  {
    value: 0,
    label: "Category",
  },
  {
    value: 1,
    label: "Sub Category 1",
  },
  {
    value: 2,
    label: "Sub Category 2",
  },
];

export const DEFAULT_VALUE_FORM = {
  level: 0,
  name: [],
  businessUnit: "",
  parent: null,
};
