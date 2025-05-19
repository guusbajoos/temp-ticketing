import React, { useState, useRef, useEffect } from "react";
import _debounce from "lodash/debounce";

import {
  AutoComplete,
  Carousel,
  Modal,
  Input,
  Form,
  Button,
  message,
  DatePicker,
  Space,
  Row,
  Col,
  Checkbox,
  Select,
  Table,
  Spin,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { isEmpty } from "lodash";
import { connect, useSelector } from "react-redux";
import moment from "moment";
import SelectDropdown from "components/SelectDropdown";
import TicketApi from "api/ticket";
import JawsApi from "api/jaws";

import { convertOptions } from "../../../../../utils";
// import { getTeamList } from 'store/action/TeamAction';
import { getTicketList, getPatientDetailList } from "store/action/TicketAction";
import {
  getCategoryList,
  getCategoryByBusiness,
} from "store/action/CategoryAction";

import {
  statusOptions,
  urgencyOptions,
  sourceOptions,
  filterSelectedTeamForSelectBox,
  filterSelectedCategory,
  removeSpaceTickets,
} from "../../../helper";

import "./style.scss";
import { ConsoleSqlOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import EditorJodit from "pages/ticket/EditTicket/components/JoditEditor";
import { config } from "./config";
import dayjs from "dayjs";
import {
  useBusiness,
  useClinicLocation,
  useTicketRecommendation,
} from "./hooks";
import api from "api/index";
import { Link } from "react-router-dom";
const { confirm } = Modal;

export const ModalAddData = ({
  getCategoryByBusiness,
  showModalAddData,
  handleHideModalAddData,
  setShowModalAddData,
  teamList,
  categoryList,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [rahangPage, setRahangPage] = useState({
    rahang_atas: 0,
    rahang_bawah: 0,
  });
  const settings = {
    dots: false,
    infinite: true,
    speed: 50,
    slidesToShow: 16,
    slidesToScroll: 16,
  };

  let refRahangAtasContainer = useRef();

  let refRahangBawahContainer = useRef();
  const [page, setPage] = useState(1);
  const [errMessagePatient, setErrMessagePatient] = useState("");
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);
  const [patientList, setPatientList] = useState([]);
  const [patientSoNumbers, setPatientSoNumbers] = useState([]);
  const [searchPhoneNumber, setSearchPhoneNumber] = useState("");
  const [title, setTitle] = useState("");

  function next(type) {
    if (type === "rahang_atas") {
      refRahangAtasContainer.next();
    } else {
      refRahangBawahContainer.next();
    }

    setRahangPage({ ...rahangPage, [type]: rahangPage[type] + 1 });
  }

  function previous(type) {
    if (type === "rahang_atas") {
      refRahangAtasContainer.prev();
    } else {
      refRahangBawahContainer.prev();
    }

    setRahangPage({ ...rahangPage, [type]: rahangPage[type] - 1 });
  }
  const [isTeamSelected, setIsTeamSelected] = useState(false);
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [isSubCategory1Selected, setIsSubCategory1Selected] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory1, setSelectedSubCategory1] = useState("");
  const { pathname } = location;
  const [form] = Form.useForm();
  const [agent, setAgent] = useState({ id: "", name: "" });
  const [category, setCategory] = useState(false);
  const [subCategory1, setSubCategory1] = useState(false);
  const [isRahangSetActive, setIsRahangSetActive] = useState(false);
  const [description, setDescription] = useState("");
  const [dataDescription, setDataDescription] = useState({
    message: "",
    status: false,
  });
  const [selectedClassUrgency, setSelectedClassUrgency] = useState("");
  const [selectedClassStatus, setSelectedClassStatus] = useState("");

  useEffect(() => {
    if (searchPhoneNumber === "") {
      setPatientList([]);
    }
  }, [searchPhoneNumber]);

  const { getBusinessList, business, resetStatus } = useBusiness();

  const { getBusiness } = business;

  const categoryByBusiness = useSelector(
    (state) => state["categoryByBusiness"]
  );

  const handleBusinessUnitChange = async (value) => {
    await getCategoryByBusiness({ unit: value });
    form.setFieldsValue({
      category: undefined,
      sub_category_1: undefined,
      sub_category_2: undefined,
    });
    setIsCategorySelected(false);
    setIsSubCategory1Selected(false);
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

  const {
    getTicketRecommendationList,
    ticketRecommendation,
    resetStatus: resetStatusTicketRecommendation,
  } = useTicketRecommendation();

  const { getTicketRecommendation } = ticketRecommendation;

  useEffect(() => {
    if (title !== "") {
      getTicketRecommendationList({
        keyword: title,
      });
    }
  }, [title]);

  useEffect(() => {
    if (getTicketRecommendation.status === "FAILED") {
      api.error({
        message: getTicketRecommendation.error.message,
        description: getTicketRecommendation.error.description,
        duration: 3,
      });
      resetStatusTicketRecommendation();
    }
  }, [getTicketRecommendation.status]);

  const {
    getClinicLocationList,
    clinicLocation,
    resetStatus: resetStatusClinicLocation,
  } = useClinicLocation();

  const { getClinicLocation } = clinicLocation;

  useEffect(() => {
    getClinicLocationList({
      page: 1,
      size: Number.MAX_SAFE_INTEGER,
      sort: "clinicName,ASC",
    });
  }, []);

  useEffect(() => {
    if (getClinicLocation.status === "FAILED") {
      api.error({
        message: getClinicLocation.error.message,
        description: getClinicLocation.error.description,
        duration: 3,
      });
      resetStatusClinicLocation();
    }
  }, [getClinicLocation.status]);

  const formatHTMLDescriptionLINK = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const body = doc.querySelector("body");

    if (body) {
      const links = body.querySelectorAll("a");

      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (href) {
          if (!(href.includes("http://") || href.includes("https://"))) {
            link.setAttribute("href", "https://" + href);
          }
        }
      });
      return body.innerHTML;
    } else {
      return html;
    }
  };

  const handleSubmitAddData = async (values) => {
    const maxSize = 5 * 1024 * 1024;
    if (description.length > maxSize) {
      message.open({
        type: "error",
        content: "The file or message is too large, the maximum is only 5mb!",
        duration: 5,
      });
      return false;
    } else {
      if (description === "<p><br></p>") {
        setDataDescription({
          message: "Please insert description!",
          status: true,
        });
        return false;
      }
      const resultDescription = formatHTMLDescriptionLINK(description);
      const ra = values.ra ? values.ra : [];
      const rb = values.rb ? values.rb : [];

      if (isRahangSetActive && ra === undefined && rb === undefined) {
        message.error("Rahang atas atau bawah harus diisi");
        return;
      }

      if (isRahangSetActive && ra && ra.length === 0 && rb && rb.length === 0) {
        message.error("Rahang atas atau bawah harus diisi");
        return;
      }

      try {
        setIsLoadingButton(true);
        await TicketApi.addTicket(
          removeSpaceTickets(values.title),
          values.infobipChatId,
          resultDescription,
          values.assigned_team,
          (values.agent = agent.id),
          values.status,
          values.source,
          values.urgency,
          values.category,
          values.sub_category_1,
          values.sub_category_2,
          values.incoming_time,
          values.due_date,
          values.patient_id,
          values.patient_name,
          values.phone_number,
          values.so_number,
          values.medical_record,
          ra ? ra.map((item) => Number(item)) : [],
          rb ? rb.map((item) => Number(item)) : [],
          values.businessUnit,
          values.clinicName,
          getClinicLocation.data.currentElements.find(
            (el) => el.clinicName === values.clinicName
          ).idClinic
        );
        message.success("Success Inserting Ticket Data");
        setIsRahangSetActive(false);
        setDescription("");
        setShowModalAddData(false);
        form.resetFields();

        if (pathname.includes("my-tickets")) {
          navigate("/my-tickets");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          navigate("/all-tickets");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } catch (err) {
        if (err.response) {
          const errMessage = err.response.data.message;
          message.error(errMessage);
        }
      } finally {
        setIsLoadingButton(false);
      }
    }
  };

  const onTeamChange = () => {
    setIsTeamSelected(true);
    setAgent({ id: "", name: "" });

    form.setFieldsValue({
      agent: "",
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

  const handleFormValuesChange = (changedValues) => {
    const formFieldName = Object.keys(changedValues)[0];

    if (formFieldName === "agent") {
      if (changedValues.agent === "") {
        setAgent({
          id: "",
          name: "",
        });
        form.setFieldsValue({ agent: "" });
      }
    }
    if (formFieldName === "description") {
      form.setFieldsValue({ description: changedValues.description });
    }
    if (formFieldName === "assigned_team") {
      setSelectedTeam(changedValues[formFieldName]);
      form.setFieldsValue({ agent: undefined });
    }

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
    } else if (formFieldName === "urgency") {
      form.setFieldsValue({
        due_date:
          changedValues[formFieldName] === "HIGH"
            ? moment().add(5, "days")
            : moment().add(3, "days"),
      });
      let badgeClassUrgency = "";
      switch (changedValues[formFieldName]) {
        case "NORMAL":
          badgeClassUrgency = "badge-class-urgency-normal";
          break;
        case "HIGH":
          badgeClassUrgency = "badge-class-urgency-high";
          break;
        case "PRIORITY":
          badgeClassUrgency = "badge-class-urgency-priority";
          break;
        default:
          break;
      }
      setSelectedClassUrgency(badgeClassUrgency);
    } else if (formFieldName === "status") {
      let badgeClassStatus = "";
      switch (changedValues[formFieldName]) {
        case "OPEN":
          badgeClassStatus = "badge-status-open";
          break;
        case "IN_PROGRESS":
          badgeClassStatus = "badge-status-IN_PROGRESS";
          break;
        case "FEEDBACK":
          badgeClassStatus = "badge-status-feedback";
          break;
        case "ESCALATE":
          badgeClassStatus = "badge-status-escalate";
          break;
        case "FOLLOW_UP":
          badgeClassStatus = "badge-status-follow_up";
          break;
        default:
          break;
      }
      setSelectedClassStatus(badgeClassStatus);
    }
  };

  const userOptions = filterSelectedTeamForSelectBox(teamList, selectedTeam);

  const handleSetAgent = (value) => {
    const find = userOptions[0].users.find((item) => item.name === value);

    setAgent(find);
  };

  const handlePreventWithoutSave = () => {
    confirm({
      title: `Discard unsaved changes`,
      okText: "Discard",
      icon: <QuestionCircleOutlined color="#A4A4A4" />,
      okType: "danger",
      width: 520,
      content: "If you discard, you will lose any changes you have made.",
      cancelText: "Cancel",
      okButtonProps: "Save",
      onOk() {
        form.resetFields();
        handleHideModalAddData();
        setShowModalAddData(false);
        setIsRahangSetActive(false);
        setDescription("");
        setDataDescription({
          message: "",
          status: false,
        });
      },
    });
  };

  const plainOptions = [...Array(80)].map((_, i) => String(i));

  const handleCategory = (val) => {
    const find = categoryList.find((item) => item.id === Number(val));
    setIsRahangSetActive(false);
    setCategory(find.id);
    setIsCategorySelected(true);
    form.setFieldsValue({
      sub_category_1: undefined,
      sub_category_2: undefined,
    });
    setIsSubCategory1Selected(false);
  };

  const handleSubCat1 = (val) => {
    const find = subCategory1Array.find((item) => item.id === Number(val));

    setIsRahangSetActive(false);
    setSubCategory1(find.id);
  };

  const handleRahang = async (subCategory2) => {
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

  const handlePatientDetailList = async () => {
    const phoneNumber = form.getFieldValue("phone_number");
    let newValuePhoneNumber;
    const [firstNumber, secNumber] = phoneNumber.split("");
    if (firstNumber === "6" && secNumber === "2") {
      const newPhoneNumber = phoneNumber?.slice(2);
      newValuePhoneNumber = newPhoneNumber;
    } else if (firstNumber === "0") {
      const newPhoneNumber = phoneNumber?.slice(1);
      newValuePhoneNumber = newPhoneNumber;
    } else {
      newValuePhoneNumber = phoneNumber;
    }

    try {
      setIsLoadingPatient(true);
      const { data } = await TicketApi.getPatientDetailList(
        page,
        newValuePhoneNumber
      );
      setPatientList(data?.data);
      setIsLoadingPatient(false);
      setErrMessagePatient("");
    } catch (error) {
      setPatientList([]);
      setErrMessagePatient("Patient details not found");
      setIsLoadingPatient(false);
    }
  };

  const handleSelectedPatient = (data) => {
    message.info(`Patients with the name ${data.patientName} are selected.`);
    form.setFieldsValue({
      so_number: "",
    });
    form.setFieldsValue({
      phone_number: data.patientPhone,
      patient_name: data.patientName,
      medical_record: data.medicalRecord,
      patient_id: data.patientId,
    });
    setPatientSoNumbers(data?.transactionList);
    setPatientList([]);
  };

  const columns = [
    {
      title: "Phone Number",
      dataIndex: "patientPhone",
      key: "patientPhone",
    },
    {
      title: "Name",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Button
          type="default"
          size="middle"
          primary
          onClick={() => handleSelectedPatient(record)}
        >
          Choose Patient
        </Button>
      ),
    },
  ];

  const isDisabledPatient = form.getFieldValue("phone_number") || "";

  const now = new Date();

  return (
    <Modal
      open={showModalAddData}
      title="Create New Ticket"
      centered
      onCancel={() => {
        confirm({
          title: `Discard unsaved changes`,
          okText: "Discard",
          okType: "danger",
          icon: <QuestionCircleOutlined color="#A4A4A4" />,
          width: 520,
          content: "If you discard, you will lose any changes you have made.",
          cancelText: "Cancel",
          onOk() {
            form.resetFields();
            handleHideModalAddData();
            setShowModalAddData(false);
            setIsRahangSetActive(false);
            setDescription("");
            setDataDescription({
              message: "",
              status: false,
            });
          },
        });
      }}
      className="modal-add"
      maskClosable={false}
      footer={[
        <Button key="back" onClick={handlePreventWithoutSave}>
          Cancel
        </Button>,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          form="add-modal-all-tickets"
          onClick={() => {
            if (description === "") {
              setDataDescription({
                message: "Please insert description",
                status: true,
              });
            } else if (description === "<p><br></p>") {
              setDataDescription({
                message: "Please insert description",
                status: true,
              });
            } else {
              setDataDescription({
                message: "",
                status: false,
              });
            }
          }}
          loading={isLoadingButton}
        >
          Save
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleFormValuesChange}
        id={"add-modal-all-tickets"}
        onFinish={handleSubmitAddData}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please insert Title" }]}
        >
          <Input
            size="large"
            placeholder="Insert Title"
            onChange={(e) => {
              setTitle(e.target.value);
              form.setFieldValue("title", e.target.value);
            }}
          />
        </Form.Item>
        <div
          style={{
            width: "100%",
            overflowWrap: "break-word",
          }}
        >
          {getTicketRecommendation.data.length !== 0 && title.length !== 0
            ? getTicketRecommendation.data.map((item) => (
                <Link
                  key={item.number}
                  to={`/edit-ticket/edit?id=${item.number}`}
                  style={{
                    textDecoration: "underline",
                    color: "blue",
                    whiteSpace: "nowrap",
                    marginRight: "5px",
                    marginLeft: "5px",
                  }}
                  target="#"
                >
                  {item.title}
                </Link>
              ))
            : null}
        </div>
        <Form.Item
          label="Infobip Chat ID"
          name="infobipChatId"
          rules={[{ required: false }]}
        >
          <Input size="large" placeholder="Insert Infobip Chat ID" />
        </Form.Item>

        <div className="mb-20">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0px 7px",
              marginBottom: "5px",
            }}
          >
            <span style={{ color: "red" }}>*</span>
            <label htmlFor="Description">Description</label>
          </div>
          <EditorJodit
            isCreateTicket={true}
            config={config}
            value={description}
            setValue={setDescription}
          />
          {dataDescription.status && (
            <div className="ant-form-item-explain-error mb-10">
              {dataDescription.message}
            </div>
          )}
        </div>

        <Row gutter={[16, 0]}>
          <Col xs={8}>
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
                onChange={handleBusinessUnitChange}
              />
            </Form.Item>
          </Col>
          <Col xs={8}>
            <Form.Item
              label="Clinic Location"
              name="clinicName"
              rules={[
                { required: false, message: "Please Select Clinic Location" },
              ]}
            >
              <Select
                showSearch
                filterOption={(input, option) => {
                  return (
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
                options={
                  !isEmpty(getClinicLocation.data)
                    ? convertOptions(
                        getClinicLocation.data.currentElements,
                        "clinicName",
                        "clinicName"
                      )
                    : []
                }
                placeholder={"Select Clinic Location"}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={8}>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select Category" }]}
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
          <Col xs={8}>
            <Form.Item
              label="Sub Category 1"
              name="sub_category_1"
              rules={[
                { required: true, message: "Please select Sub Category 1" },
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

          <Col xs={8}>
            <Form.Item
              label="Sub Category 2"
              name="sub_category_2"
              rules={[
                { required: true, message: "Please select Sub Category 2" },
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

        {isRahangSetActive && (
          <Col xs={24}>
            <Row>
              <Col xs={24}>
                <div className="rahang-set">
                  <p>Set Bermasalah</p>

                  <div className="rahang-set-value">
                    <div
                      className="icon-container icon-container--left left-nav-homepage"
                      onClick={() => previous("rahang_atas")}
                    >
                      <img
                        style={{
                          position: "absolute",
                          top: "0px",
                          left: "0px",
                        }}
                        src={`https://rata-web-production-assets.s3.ap-southeast-1.amazonaws.com/icons/chevron-right-plain.svg`}
                        alt="left"
                      />
                    </div>

                    <Row>
                      <Col xs={3}>
                        <p className="mb-10">Rahang Atas</p>
                      </Col>

                      <Col xs={24}>
                        <Form.Item name="ra">
                          <Checkbox.Group
                            style={{ width: "95%", margin: "0px auto" }}
                          >
                            <Carousel
                              {...settings}
                              ref={(node) => (refRahangAtasContainer = node)}
                            >
                              {plainOptions.map((item, key) => (
                                <Row key={key}>
                                  <Col span={7}>
                                    <Checkbox value={item}>{item}</Checkbox>
                                  </Col>
                                </Row>
                              ))}
                            </Carousel>
                          </Checkbox.Group>
                        </Form.Item>
                      </Col>
                    </Row>

                    <div
                      className="icon-container icon-container--right right-nav-homepage"
                      onClick={() => next("rahang_atas")}
                    >
                      <img
                        style={{
                          position: "absolute",
                          top: "0px",
                          left: "0px",
                        }}
                        src={`https://rata-web-production-assets.s3.ap-southeast-1.amazonaws.com/icons/chevron-right-plain.svg`}
                        alt="right"
                      />
                    </div>
                  </div>

                  <div className="rahang-set-value mt-4">
                    <div
                      className="icon-container icon-container--left left-nav-homepage"
                      onClick={() => previous("rahang_bawah")}
                    >
                      <img
                        style={{
                          position: "absolute",
                          top: "0px",
                          left: "0px",
                        }}
                        src={`https://rata-web-production-assets.s3.ap-southeast-1.amazonaws.com/icons/chevron-right-plain.svg`}
                        alt="left"
                      />
                    </div>

                    <Row>
                      <Col xs={6}>
                        <p className="mb-10">Rahang Bawah</p>
                      </Col>

                      <Col xs={24}>
                        <Form.Item name="rb">
                          <Checkbox.Group
                            style={{ width: "95%", margin: "0px auto" }}
                          >
                            <Carousel
                              {...settings}
                              ref={(node) => (refRahangBawahContainer = node)}
                            >
                              {plainOptions.map((item, key) => (
                                <Row key={key}>
                                  <Col span={7}>
                                    <Checkbox value={item}>{item}</Checkbox>
                                  </Col>
                                </Row>
                              ))}
                            </Carousel>
                          </Checkbox.Group>
                        </Form.Item>
                      </Col>
                    </Row>

                    <div
                      className="icon-container icon-container--right right-nav-homepage"
                      onClick={() => next("rahang_bawah")}
                    >
                      <img
                        style={{
                          position: "absolute",
                          top: "0px",
                          left: "0px",
                        }}
                        src={`https://rata-web-production-assets.s3.ap-southeast-1.amazonaws.com/icons/chevron-right-plain.svg`}
                        alt="right"
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        )}

        <Row gutter={[16, 0]}>
          <Col xs={12}>
            <Form.Item
              label="Source"
              name="source"
              rules={[{ required: true, message: "Please select Source" }]}
            >
              <SelectDropdown
                options={sourceOptions}
                placeHolder={"Select Source"}
              />
            </Form.Item>
          </Col>

          <Col xs={12}>
            <Form.Item
              label="Incoming Date & Time"
              name="incoming_time"
              rules={[
                {
                  required: true,
                  message: "Please select Incoming Date & Time",
                },
              ]}
            >
              <DatePicker
                size="large"
                showTime={{
                  defaultValue: dayjs(
                    `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
                    "HH:mm:ss"
                  ),
                }}
                placeholder="Click to select a date"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select Status" }]}
            >
              <SelectDropdown
                isBadgeStatus
                backgroundStatus={selectedClassStatus}
                options={statusOptions}
                placeHolder={"Select Status"}
              />
            </Form.Item>
          </Col>

          <Col xs={12}>
            <Form.Item
              label="Urgency"
              name="urgency"
              rules={[{ required: true, message: "Please select Urgency" }]}
            >
              <SelectDropdown
                isBadgeStatus
                backgroundStatus={selectedClassUrgency}
                options={urgencyOptions}
                placeHolder={"Select Urgency"}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={12}>
            <Form.Item
              label="Assigned to Team"
              name="assigned_team"
              rules={[{ required: true, message: "Please select Team" }]}
            >
              <SelectDropdown
                options={
                  !isEmpty(teamList) && !isEmpty(teamList.currentElements)
                    ? convertOptions(teamList.currentElements, "name", "id")
                    : []
                }
                onChange={onTeamChange}
                placeHolder={"Select Team"}
              />
            </Form.Item>
          </Col>

          <Col xs={12}>
            <Form.Item
              label="Assigned to Agent"
              rules={[{ required: false }]}
              name="agent"
            >
              <AutoComplete
                allowClear
                dataSource={
                  !isEmpty(userOptions) && !isEmpty(userOptions[0].users)
                    ? convertOptions(userOptions[0].users, "name")
                    : []
                }
                disabled={!isTeamSelected}
                onSelect={handleSetAgent}
                placeholder={"Select Agent"}
                filterOption={(inputValue, option) => {
                  return (
                    option.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  );
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          className="d-none"
          label="Due Date"
          name="due_date"
          rules={[{ required: true, message: "Please select Due Date" }]}
        >
          <DatePicker
            size="large"
            showTime
            placeholder="Click to select a date"
          />
        </Form.Item>

        <div className="patient-detail">
          <div className="color-text-primary text-base fw-medium mt-15 mb-40">
            Patient Details
          </div>

          <div style={{ position: "relative" }}>
            <Form.Item
              label="Phone Number"
              name="phone_number"
              rules={[
                {
                  required: true,
                  message: "Please insert Phone Number",
                },
              ]}
            >
              <Input
                size="large"
                type="text"
                placeholder={"Insert Phone Number"}
                onChange={(e) => setSearchPhoneNumber(e.target.value)}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
            <Button
              type="default"
              primary
              className="btn__custom-search-patient"
              disabled={isDisabledPatient.split("").length <= 0}
              onClick={handlePatientDetailList}
            >
              {isLoadingPatient ? <Spin /> : "Search Patient"}
            </Button>
          </div>

          {errMessagePatient !== "" ? (
            <span style={{ color: "rgb(220 38 38)" }}>{errMessagePatient}</span>
          ) : null}

          {patientList.length > 0 && (
            <Table
              columns={columns}
              dataSource={patientList}
              pagination={false}
              className="mb-20"
            />
          )}

          <Form.Item
            label="Patient Name"
            name="patient_name"
            rules={[{ required: true, message: "Please insert Patient Name" }]}
          >
            <Input size="large" placeholder={"Insert Patient Name"} />
          </Form.Item>

          <Form.Item
            label="Medical Record"
            name="medical_record"
            rules={[
              { required: true, message: "Please insert Medical Record" },
            ]}
          >
            <Input size="large" placeholder={"Insert Medical Record"} />
          </Form.Item>

          <Form.Item
            label="Patient ID"
            name="patient_id"
            rules={[{ required: true, message: "Please insert Patient ID" }]}
          >
            <Input size="large" placeholder={"Insert Patient ID"} />
          </Form.Item>
          <Form.Item
            label="SO Number"
            name="so_number"
            rules={[{ required: true, message: "Please insert SO Number" }]}
          >
            <AutoComplete
              style={{ marginBottom: "10px" }}
              allowClear
              options={
                !isEmpty(patientSoNumbers) && !isEmpty(patientSoNumbers)
                  ? convertOptions(patientSoNumbers, "soNumber")
                  : []
              }
              placeholder="Select SO Number"
              value={patientSoNumbers.length === 0 && ""}
              defaultValue={patientSoNumbers.length === 0 && ""}
              filterOption={(inputValue, option) => {
                return (
                  option.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                );
              }}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

const mapStateToProps = ({
  teamList,
  ticketList,
  categoryList,
  patientDetailList,
}) => ({
  teamList,
  ticketList,
  categoryList,
  patientDetailList,
});

export default connect(mapStateToProps, {
  getTicketList,
  getCategoryList,
  getPatientDetailList,
  getCategoryByBusiness,
})(ModalAddData);
