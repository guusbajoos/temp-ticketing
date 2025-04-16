/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import {
  AutoComplete,
  Carousel,
  Form,
  Tooltip,
  Button,
  Input,
  Row,
  Col,
  DatePicker,
  message,
  Modal,
  Checkbox,
  Select,
  Table,
  Spin,
} from "antd";

import "./style.scss";
import { connect } from "react-redux";
import {
  CheckCircleOutlined,
  ReloadOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { isEmpty } from "lodash";

import DetailLayout from "components/detail-layout/DetailReadOnly";
import SelectDropdown from "components/SelectDropdown";
import { PageSpinner } from "components/PageSpinner";
import { getTicketByNumber } from "store/action/TicketAction";
import { getTeamList } from "store/action/TeamAction";
import { getUserById } from "store/action/UserAction";
import { getCategoryList } from "store/action/CategoryAction";
// import { AuthenticationContext } from 'contexts/Authentication'
import TicketApi from "api/ticket";
import JawsApi from "api/jaws";
import {
  convertOptions,
  checkPrivileges,
  queryStringify,
  removeEmptyAttributes,
} from "../../../utils";

import {
  urgencyOptions,
  sourceOptions,
  initialSelectValueCategory,
  initialSelectValueSubCategory1,
  filterSelectedCategory,
  filterSelectedTeamForSelectBox,
  initialSelectValueSubCategory2,
} from "../helper";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
import EditorJodit from "../EditTicket/components/JoditEditor";
import { config } from "./config";
import dayjs from "dayjs";
import { useBusiness, useClinicLocation } from "./hooks";
import api from "api/index";
const { TextArea } = Input;
const { confirm } = Modal;

const plainOptions = [...Array(80)].map((_, i) => String(i));

export function EditInfoDetail({
  getTeamList,
  getTicketByNumber,
  teamList,
  ticketByNumber,
  getCategoryList,
  categoryList,

  userById,
}) {
  const editor = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const [loadingPage, setLoadingPage] = useState(true);
  //   // const { handleRefreshToken } = useContext(AuthenticationContext);
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [isSubCategory1Selected, setIsSubCategory1Selected] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory1, setSelectedSubCategory1] = useState("");
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [isTeamSelected, setIsTeamSelected] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [isRahangSetActive, setIsRahangSetActive] = useState(true);
  const [selectedClassUrgency, setSelectedClassUrgency] = useState("");
  const [form] = Form.useForm();
  const { pathname } = location;
  const restoreDeletedTicket = checkPrivileges(userById, 37);
  const [page, setPage] = useState(1);
  const [errMessagePatient, setErrMessagePatient] = useState("");
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);
  const [patientList, setPatientList] = useState([]);
  const [patientSoNumbers, setPatientSoNumbers] = useState([]);
  const [isPatientDetail, setIsPatientDetail] = useState(false);
  const [searchPhoneNumber, setSearchPhoneNumber] = useState("");

  const settings = {
    dots: false,
    infinite: true,
    speed: 50,
    slidesToShow: 16,
    slidesToScroll: 16,
  };

  const onTeamChange = () => {
    setIsTeamSelected(true);
  };

  async function getDataPatientListTransaction() {
    try {
      const { data } = await TicketApi.getPatientDetailList(
        page,
        ticketByNumber?.patientPhone
      );
      return data?.data.map((item) => {
        setPatientSoNumbers(item.transactionList);
        return item.transactionList;
      });
    } catch (error) {
      setPatientSoNumbers([]);
    }
  }

  useEffect(() => {
    getDataPatientListTransaction();
  }, [ticketByNumber]);

  useEffect(() => {
    if (searchPhoneNumber === "") {
      setPatientList([]);
    }
  }, [searchPhoneNumber]);

  let refRahangAtasContainer = useRef();

  let refRahangBawahContainer = useRef();

  const next = (type) => {
    if (type === "rahang_atas") {
      refRahangAtasContainer.next();
    } else {
      refRahangBawahContainer.next();
    }
  };

  const previous = (type) => {
    if (type === "rahang_atas") {
      refRahangAtasContainer.prev();
    } else {
      refRahangBawahContainer.prev();
    }
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
        if (err.response.status === 401) {
          // handleRefreshToken();
        } else {
          const errMessage = err.response.data.message;
          message.error(errMessage);
        }
      } else {
        // message.error('Tidak dapat menghubungi server, cek koneksi')
        // localStorage.clear()
        // sessionStorage.clear()
        // window.location.reload()
        // window.location.href = '/'
      }
    }
  }

  useEffect(() => {
    getCategoryListData();
  }, []);

  const { getBusinessList, business, resetStatus } =
    useBusiness();

  const {getBusiness} = business

  useEffect(() => {
    getBusinessList()
  }, [])

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

  const { getClinicLocationList, clinicLocation, resetStatus: resetStatusClinicLocation } =
    useClinicLocation();

  const {getClinicLocation} = clinicLocation

  useEffect(() => {
    getClinicLocationList({
      page: 1,
      size: Number.MAX_SAFE_INTEGER,
      sort: "clinicName,ASC",
    })
  }, [])

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

  async function getTicketByNumberData() {
    try {
      setLoadingPage(true);
      await getTicketByNumber(id);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          // handleRefreshToken();
        } else {
          const errMessage = err.response.data.message;
          message.error(errMessage);
        }
      } else {
        message.error("Tidak dapat menghubungi server, cek koneksi");
        localStorage.clear();
        sessionStorage.clear();
        navigate("/");
      }
    } finally {
      setLoadingPage(false);
    }
  }

  async function getTeamListData() {
    await getTeamList(
      queryStringify(
        removeEmptyAttributes({
          page: 1,
          size: Number.MAX_SAFE_INTEGER,
          sort: "name,ASC",
        })
      )
    );
  }

  const validateRahang = async (category, subCategory1, subCategory2) => {
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

  const populateAndValidateRahang = () => {
    const { category, sub_category_1, sub_category_2 } = form.getFieldsValue();

    validateRahang(category, sub_category_1, sub_category_2);
  };

  useEffect(() => {
    if (
      ticketByNumber.category &&
      ticketByNumber.subCategory1 &&
      ticketByNumber.subCategory2
    ) {
      const { category, subCategory1, subCategory2 } = ticketByNumber;

      validateRahang(category.id, subCategory1.id, subCategory2.id);
    }
    setSelectedClassUrgency(ticketByNumber?.urgency);
  }, [ticketByNumber]);

  useEffect(() => {
    getTicketByNumberData();
    getTeamListData();
  }, []);

  if (loadingPage) {
    return <PageSpinner />;
  }
  const categorySelectedArray = filterSelectedCategory(
    categoryList,
    selectedCategory,
    ticketByNumber,
    "category"
  );

  const subCategory1Array = !isEmpty(categorySelectedArray)
    ? categorySelectedArray[0].subcategories
    : [];

  const subCategory1Options = !isEmpty(subCategory1Array)
    ? convertOptions(subCategory1Array, "name", "id")
    : [];

  const subCategory1SelectedArray = filterSelectedCategory(
    subCategory1Array,
    selectedSubCategory1,
    ticketByNumber,
    "subCategory1"
  );

  const subCategory2Array = !isEmpty(subCategory1SelectedArray)
    ? subCategory1SelectedArray[0].subcategories
    : [];

  const subCategory2Options = !isEmpty(subCategory2Array)
    ? convertOptions(subCategory2Array, "name", "id")
    : [];

  const userTeamArray = filterSelectedTeamForSelectBox(
    teamList,
    selectedTeam,
    ticketByNumber
  );

  const userOptions =
    !isEmpty(userTeamArray) && !isEmpty(userTeamArray[0].users)
      ? convertOptions(userTeamArray[0].users, "name", "id")
      : [];

  const handleFormValuesChange = (changedValues) => {
    const formFieldName = Object.keys(changedValues)[0];

    if (formFieldName === "infobipChatId") {
      form.setFieldValue("infobipChatId", changedValues[formFieldName]);
    }

    if (formFieldName === "description") {
      changedValues[formFieldName] = changedValues[formFieldName].replace(
        /<ul style="list-style-type: circle;">/,
        '<ul><li style="list-style-type: circle; margin: 10px;">'
      );
      changedValues[formFieldName] = changedValues[formFieldName].replace(
        /<ul style="list-style-type: square;">/,
        '<ul><li style="list-style-type: square; margin: 10px;">'
      );
      form.setFieldsValue({
        description: changedValues[formFieldName],
      });
    }

    if (formFieldName === "team") {
      setSelectedTeam(changedValues[formFieldName]);

      form.setFieldsValue({
        agent: undefined,
      });
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
    }

    if (formFieldName === "urgency") {
      var createdTicketDate = moment(form.getFieldValue("created_at"));
      form.setFieldsValue({
        dueAt:
          changedValues[formFieldName] === "HIGH"
            ? createdTicketDate.add(5, "days")
            : createdTicketDate.add(3, "days"),
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
    }
  };

  const formatHTMLDescriptionLINK = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const body = doc.querySelector("body");

    if (body) {
      const links = body.querySelectorAll("a");
      const image = body.querySelectorAll("img");
      image.forEach((img) => {
        return (img.style.width = "100%");
      });

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

  const handleSubmitEditData = async (values) => {
    const maxSize = 5 * 1024 * 1024;
    if (values.description.length > maxSize) {
      message.open({
        type: "error",
        content: "The file or message is too large, the maximum is only 5mb!",
        duration: 5,
      });
      return false;
    } else {
      if (values.description === "<p><br></p>") {
        form.setFields([
          {
            name: "description",
            errors: ["description is required"],
          },
        ]);
        return false;
      } else {
        values.ra = isRahangSetActive ? values.ra : [];
        values.rb = isRahangSetActive ? values.rb : [];

        const description = formatHTMLDescriptionLINK(values.description);

        try {
          setIsLoadingButton(true);
          let theResponse;
          theResponse = await TicketApi.updateTicket(
            values.ticket_number,
            // values.team,
            // values.agent,
            ticketByNumber.status,
            values.title,
            values.infobipChatId,
            description,
            values.source,
            values.urgency,
            values.category,
            values.sub_category_1,
            values.sub_category_2 == ticketByNumber.subCategory2.name
              ? ticketByNumber.subCategory2.id
              : values.sub_category_2,
            values["incomingAt"],
            values["dueAt"],
            values.patient_id,
            values.patient_name,
            values.phone_number,
            values.so_number,
            values.medical_record,
            ticketByNumber.ticketSolution || {},
            ticketByNumber.patientSatisfactionNote || undefined,
            ticketByNumber.patientSatisfactionStatus,
            values.ra,
            values.rb,
            values.businessUnit.toUpperCase() === 'TANAM GIGI' ? "TANAM" : values.businessUnit.toUpperCase(),
            values.clinicName,
            getClinicLocation.data.currentElements.find(el => el.clinicName === values.clinicName).idClinic
          );
          navigate(-1);
          setCreateEditMessage(
            theResponse.data,
            "Success Updating Ticket Data"
          );
        } catch (err) {
          if (err.response) {
            const errMessage = err.response.data.message;
            message.error(errMessage);
          }
        } finally {
          setIsLoadingButton(false);
        }
      }
    }
  };

  const handleOpenTicket = async (values) => {
    confirm({
      title: `Are you sure to open this ticket data?`,
      okText: "Yes",
      okType: "danger",
      width: 520,
      content: `If you click "Yes", then ticket data titled ${
        ticketByNumber ? ticketByNumber.title : ""
      } will be opened`,
      cancelText: "No",
      onOk() {
        handleSubmitEditData(values);
      },
      onCancel() {},
    });
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

  const now = new Date();

  return (
    <>
      {!isEmpty(ticketByNumber) && (
        <DetailLayout
          isEditTicket
          detailName={`${ticketByNumber.title} - ${ticketByNumber.number}`}
          className={"edit-detail edit-form"}
          detailComponent={
            <Form
              form={form}
              onValuesChange={handleFormValuesChange}
              layout="vertical"
              onFinish={
                pathname.includes("archived-tickets") ||
                pathname.includes("deleted-tickets")
                  ? handleOpenTicket
                  : handleSubmitEditData
              }
              initialValues={{
                ticket_number: !isEmpty(ticketByNumber.number)
                  ? ticketByNumber.number
                  : "",
                infobipChatId: ticketByNumber.infobipChatId,
                // team: initialSelectValueTeam(ticketByNumber),
                // agent: initialSelectValueAgent(ticketByNumber),
                status: ticketByNumber.status,
                title: ticketByNumber.title,
                description: ticketByNumber.description,
                source: ticketByNumber.source,
                urgency: ticketByNumber.urgency,
                ...initialSelectValueCategory(ticketByNumber),
                ...initialSelectValueSubCategory1(ticketByNumber),
                // ...initialSelectValueSubCategory2(ticketByNumber),
                sub_category_2:
                  subCategory2Options.find(
                    (item) =>
                      item.value ==
                      initialSelectValueSubCategory2(ticketByNumber).id
                  ) ?? ticketByNumber.subCategory2.name,
                incomingAt: dayjs(ticketByNumber?.incomingAt),
                dueAt: dayjs(ticketByNumber?.dueAt),
                patient_id: ticketByNumber.patientId,
                patient_name: ticketByNumber.patientName,
                phone_number: ticketByNumber.patientPhone,
                so_number: ticketByNumber.soNumber,
                medical_record: ticketByNumber.medicalRecord,
                created_at: ticketByNumber.createdAt,
                ra:
                  ticketByNumber.ra && ticketByNumber.ra.length > 0
                    ? ticketByNumber.ra
                    : "",
                rb:
                  ticketByNumber.rb && ticketByNumber.rb.length > 0
                    ? ticketByNumber.rb
                    : "",
                businessUnit: ticketByNumber.businessUnit,
                clinicName: ticketByNumber.clinicName,
              }}
            >
              <Form.Item className="edit-detail__submit">
                <Tooltip title="Submit Data">
                  <Button
                    size="large"
                    htmlType="submit"
                    icon={
                      pathname.includes("archived-tickets") ? (
                        <ReloadOutlined />
                      ) : pathname.includes("deleted-tickets") ? (
                        restoreDeletedTicket ? (
                          <SyncOutlined />
                        ) : undefined
                      ) : (
                        <CheckCircleOutlined />
                      )
                    }
                    loading={isLoadingButton}
                  />
                </Tooltip>
              </Form.Item>
              <Row gutter={20}>
                <Col span={18}>
                  <Form.Item
                    label="Title"
                    name="title"
                    rules={[
                      {
                        max: 250,
                        message: "Title is more than 250 characters!",
                      },
                      { required: true, message: "Please insert Title" },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Insert Title"
                      maxLength={250}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="Ticket Number"
                    name="ticket_number"
                    rules={[
                      {
                        required: true,
                        message: "Please insert Ticket Number",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Insert Ticket Number"
                      disabled={true}
                    />
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item
                    label="Infobip Chat ID"
                    name="infobipChatId"
                    rules={[{ required: false }]}
                  >
                    <Input
                      size="large"
                      placeholder="Insert Infobip Chat ID"
                      maxLength={250}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                      { required: true, message: "Please Insert Description" },
                    ]}
                  >
                    <EditorJodit
                      config={config}
                      value={ticketByNumber.description}
                      setValue={(value) => {
                        form.setFieldValue("description", value);
                      }}
                    />
                  </Form.Item>
                </Col>
                {/* <Col span={6}>
                  <Form.Item
                    label="Assigned to Team"
                    name="team"
                    rules={[{ required: true, message:"Please " }]}>
                    <SelectDropdown
                      options={
                        !isEmpty(teamList) && !isEmpty(teamList.currentElements)
                          ? convertOptions(
                              teamList.currentElements,
                              'name',
                              'id'
                            )
                          : []
                      }
                      placeHolder={'Select Team'}
                      onChange={onTeamChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="Assigned to Agent"
                    rules={[{ required: false }]}
                    name="agent">
                    <SelectDropdown
                      options={userOptions}
                      placeHolder={'Select Agent'}
                    />
                  </Form.Item>
                </Col> */}
                {/* <Col span={6} style={{ display: 'none' }}>
                  <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message:"Please " }]}>
                    <SelectDropdown
                      options={statusOptions}
                      placeHolder={'Select Status'}
                    />
                  </Form.Item>
                </Col> */}
                <Col span={24} style={{display: 'flex'}}>
                <Col span={6}>
                  <Form.Item
                    label="Business Unit"
                    name="businessUnit"
                    rules={[
                      { required: true, message: "Please Select Business Unit" },
                    ]}
                  >
                    <Select
                      showSearch
                      filterOption={(input, option) => {
                        return (
                          option.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      options={
                        !isEmpty(getBusiness.data)
                    ? convertOptions(getBusiness.data, "name", "name")
                    : []
                      }
                      placeholder={"Select Busines Unit"}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
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
                          option.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      options={
                        !isEmpty(getClinicLocation.data)
                        ? convertOptions(getClinicLocation.data.currentElements, "clinicName", "clinicName")
                        : []
                      }
                      placeholder={"Select Clinic Location"}
                    />
                  </Form.Item>
                </Col>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="Category"
                    name="category"
                    rules={[
                      { required: true, message: "Please Select Category" },
                    ]}
                  >
                    <Select
                      showSearch
                      filterOption={(input, option) => {
                        return (
                          option.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      options={
                        !isEmpty(categoryList)
                          ? convertOptions(categoryList, "name", "id")
                          : []
                      }
                      placeholder={"Select Category"}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="Sub Category 1"
                    name="sub_category_1"
                    rules={[
                      {
                        required: true,
                        message: "Please select Sub Category 1",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      filterOption={(input, option) => {
                        return (
                          option.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      disabled={
                        isCategorySelected || !isEmpty(ticketByNumber.category)
                          ? false
                          : true
                      }
                      options={subCategory1Options}
                      placeholder={"Select Sub Category 1"}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="Sub Category 2"
                    name="sub_category_2"
                    rules={[
                      {
                        required: true,
                        message: "Please select Sub Category 2",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      filterOption={(input, option) => {
                        return (
                          option.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      disabled={
                        isSubCategory1Selected ||
                        !isEmpty(ticketByNumber.subCategory1)
                          ? false
                          : true
                      }
                      options={subCategory2Options}
                      placeholder={"Select Sub Category 2"}
                      onChange={populateAndValidateRahang}
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
                                top: "-30px",
                                left: "0px",
                                margin: "0px 10px",
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
                                    ref={(node) =>
                                      (refRahangAtasContainer = node)
                                    }
                                  >
                                    {plainOptions.map((item, key) => (
                                      <Row key={key}>
                                        <Col span={7}>
                                          <Checkbox value={item}>
                                            {item}
                                          </Checkbox>
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
                                top: "30px",
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
                                top: "-30px",
                                left: "0px",
                                margin: "0px 10px",
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
                                    ref={(node) =>
                                      (refRahangBawahContainer = node)
                                    }
                                  >
                                    {plainOptions.map((item, key) => (
                                      <Row key={key}>
                                        <Col span={7}>
                                          <Checkbox value={item}>
                                            {item}
                                          </Checkbox>
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
                                top: "30px",
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
              <Row
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0px 10px",
                }}
              >
                <Col span={6}>
                  <Form.Item
                    label="Urgency"
                    name="urgency"
                    rules={[
                      { required: true, message: "Please select Urgency" },
                    ]}
                  >
                    <SelectDropdown
                      isBadgeStatus
                      backgroundStatus={
                        selectedClassUrgency === "NORMAL"
                          ? "badge-class-urgency-normal"
                          : selectedClassUrgency === "HIGH"
                            ? "badge-class-urgency-high"
                            : selectedClassUrgency === "PRIORITY"
                              ? "badge-class-urgency-priority"
                              : selectedClassUrgency
                      }
                      options={urgencyOptions}
                      placeHolder={"Select Urgency"}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="Source"
                    name="source"
                    rules={[
                      { required: true, message: "Please Select Source" },
                    ]}
                  >
                    <SelectDropdown
                      options={sourceOptions}
                      placeHolder={"Select Source"}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="Incoming Date & Time"
                    name="incomingAt"
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
                <Col span={6} className="d-none">
                  <Form.Item
                    label="Due Date"
                    name="dueAt"
                    rules={[
                      { required: true, message: "Please select Due Date" },
                    ]}
                  >
                    <DatePicker
                      disabled
                      size="large"
                      showTime
                      placeholder="Click to select a date"
                    />
                  </Form.Item>
                </Col>
              </Row>
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
                      type="number"
                      defaultValue={ticketByNumber.patientPhone}
                      onChange={(e) => setSearchPhoneNumber(e.target.value)}
                      placeholder={"Insert Phone Number"}
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
                    disabled={isPatientDetail}
                    onClick={handlePatientDetailList}
                  >
                    {isLoadingPatient ? <Spin /> : "Search Patient"}
                  </Button>
                </div>
                {errMessagePatient !== "" ? (
                  <span style={{ color: "rgb(220 38 38)" }}>
                    {errMessagePatient}
                  </span>
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
                  rules={[
                    { required: true, message: "Please insert Patient Name" },
                  ]}
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
                  rules={[
                    { required: true, message: "Please insert Patient ID" },
                  ]}
                >
                  <Input size="large" placeholder={"Insert Patient ID"} />
                </Form.Item>
                <Form.Item
                  label="SO Number"
                  name="so_number"
                  rules={[
                    { required: true, message: "Please insert SO Number" },
                  ]}
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
                    value={patientSoNumbers?.length === 0 && ""}
                    defaultValue={patientSoNumbers?.length === 0 && ""}
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
          }
        />
      )}
    </>
  );
}

const mapStateToProps = ({
  ticketByNumber,
  teamList,
  userById,
  categoryList,
}) => ({
  ticketByNumber,
  teamList,
  userById,
  categoryList,
});

export default connect(mapStateToProps, {
  getTicketByNumber,
  getTeamList,
  getUserById,
  getCategoryList,
})(EditInfoDetail);
