/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext, useRef } from "react";
import {
  AutoComplete,
  Row,
  Col,
  Form,
  Button,
  Divider,
  Radio,
  Tooltip,
  message,
  Modal,
  Dropdown,
  Menu,
  Input,
  DatePicker,
  Select,
  Checkbox,
  Carousel,
  Typography,
} from "antd";
import { EllipsisOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import "./index.scss";
import { connect } from "react-redux";
import { EditOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { isEmpty, trimEnd } from "lodash";
import { useLocation } from "react-router";

import { getTeamList } from "store/action/TeamAction";
import { getUserById } from "store/action/UserAction";
import { getTicketByNumber } from "store/action/TicketAction";
import { getCategoryList } from "store/action/CategoryAction";

import DetailLayout from "components/detail-layout/DetailReadOnly";
import SelectDropdown from "components/SelectDropdown";
import { PageSpinner } from "components/PageSpinner";
import RelatedTransaction from "components/modal/RelatedTransaction";
import ModalCustomerSatifaction from "components/modal/CustomerSatifaction";
// import { AuthenticationContext } from 'contexts/Authentication'
import {
  setCreateEditMessage,
  convertOptions,
  checkPrivileges,
  queryStringify,
  removeEmptyAttributes,
  sortingAsc,
} from "../../../utils";
import TicketApi from "api/ticket";
import RelatedTransactionApi from "api/related-transaction";

import InfoDetail from "./components/InfoDetail";
import CommentLists from "./components/CommentLists";
import HistoryLists from "./components/HistoryLists";
import {
  filterSelectedTeamForSelectBox,
  handleBusinesBadgeColor,
  initialSelectValueAgent,
  initialSelectValueTeam,
  statusOptions,
  urgencyOptions,
} from "../helper";
import ReadMore from "./components/ReadMore";

import "./styles/index.scss";
import OrderTracking from "components/modal/OrderTracking";
import JawsApi from "api/jaws";
import { formatHTMLDescription } from "./utils/formatHTML";
import { usePatients } from "pages/Patients/hooks";

const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select;

export function EditTicket({
  getTicketByNumber,
  ticketByNumber,
  getTeamList,
  teamList,

  userById,
  getCategoryList,
}) {
  const navigate = useNavigate();
  const { urgency, patientId, patientName, soNumber, ticketSolution } =
    ticketByNumber;

  const location = useLocation();
  const { assignedTo } = location?.state || "";

  const [relatedTransactionData, setRelatedTransactionData] = useState([]);
  const editTicket = checkPrivileges(userById, 16);
  const deleteTicket = checkPrivileges(userById, 17);
  const viewCommentList = checkPrivileges(userById, 18);
  const [activityMode, setActivityMode] = useState("comments");
  const [loadingPage, setLoadingPage] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  // const { handleRefreshToken } = useContext(AuthenticationContext);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [isLoadingButtonTicketSolutions, setIsLoadingButtonTicketSolutions] =
    useState(false);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [isModalVisible, setIsModalVisible] = useState("");
  const [orderTrackingPagination, setOrderTrackingPagination] = useState({
    currentPage: 0,
    totalPage: 0,
  });
  const [selectedOrderTrackingSOnumber, setSelectedOrderTrackingSOnumber] =
    useState("");

  const [orderTrackingData, setOrderTrackingData] = useState([]);
  const [isModalTrackingVisible, setIsModalTrackingVisible] = useState("");
  const [okDoctorDate, setOkDoctorDate] = useState("");
  const [isTicketFitActive, setIsTicketFitActive] = useState(false);
  const [isModalSatifactionVisible, setIsModalSatifactionVisible] =
    useState(false);

  const [form] = Form.useForm();
  const [formProdSolution] = Form.useForm();
  const [formTicketSolutionData] = Form.useForm();

  const [agent, setAgent] = useState({ id: "", name: "" });
  const [modalProdSolution, setModalProdSolution] = useState(false);
  // const [selectedSubCategory1, setSelectedSubCategory1] = useState('');
  // const [selectedSubCategory2, setSelectedSubCategory2] = useState('');
  // const [selectedCategory, setSelectedCategory] = useState('');
  // const [isCategorySelected, setIsCategorySelected] = useState(false);
  // const [isSubCategory1Selected, setIsSubCategory1Selected] = useState(false);
  const [orderType, setOrderType] = useState(false);
  const [problemTypes, setProblemTypes] = useState([]);
  const [statusProductions, setStatusProductions] = useState([]);
  const [isRahangSetActive, setIsRahangSetActive] = useState(true);
  const [selectedClassStatus, setSelectedClassStatus] = useState("");
  // const [category, setCategory] = useState(false);
  const [rahangPage, setRahangPage] = useState({
    rahang_atas: 0,
    rahang_bawah: 0,
  });
  const [rahangActive, setRahangActive] = useState({
    rahang_atas: false,
    rahang_bawah: false,
  });

  const settings = {
    dots: false,
    infinite: true,
    speed: 50,
    slidesToShow: 16,
    slidesToScroll: 16,
  };
  const [patientSatisfactionStatus, setPatientSatisfactionStatus] =
    useState(null);
  const [patientSatisfactionNote, setPatientSatisfactionNote] = useState("");

  const { getPatientTicketRelated, patients } = usePatients();

  const ticketRelateds = patients.getPatientTicketRelated.ticketRelateds;

  const plainOptions = [...Array(80)].map((_, i) => String(i));

  let refRahangAtasContainer = useRef(null);

  let refRahangBawahContainer = useRef(null);

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

  // const categorySelectedArray = filterSelectedCategory(
  //   categoryList,
  //   selectedCategory,
  //   ticketByNumber,
  //   'category'
  // );

  // const subCategory1Array = !isEmpty(categorySelectedArray)
  //   ? categorySelectedArray[0].subcategories
  //   : [];

  // const subCategory1SelectedArray = filterSelectedCategory(
  //   subCategory1Array,
  //   selectedSubCategory1,
  //   ticketByNumber,
  //   'subCategory1'
  // );

  // const subCategory1Options = !isEmpty(subCategory1Array)
  //   ? convertOptions(subCategory1Array, 'name', 'id')
  //   : [];

  // const subCategory2Array = !isEmpty(subCategory1SelectedArray)
  //   ? subCategory1SelectedArray[0].subcategories
  //   : [];

  // const subCategory2Options = !isEmpty(subCategory2Array)
  //   ? convertOptions(subCategory2Array, 'name', 'id')
  //   : [];

  // const handleCategory = (val) => {
  //   const find = categoryList.find((item) => item.id === Number(val));
  //   setCategory(find.id);
  // };

  const handleRahang = async () => {
    setIsRahangSetActive(false);

    const { data } = await JawsApi.validation(
      ticketByNumber.category.id,
      ticketByNumber.subCategory1.id,
      ticketByNumber.subCategory2.id
    );

    if (data.mandatory) {
      setIsRahangSetActive(true);
    } else {
      setIsRahangSetActive(false);
    }
  };

  const fetchProblemType = async () => {
    const { data } = await TicketApi.getProblemTypes();

    setProblemTypes(data);
  };

  const userTeamArray = filterSelectedTeamForSelectBox(
    teamList,
    selectedTeam,
    ticketByNumber
  );

  const closeModalSatisfaction = () => {
    setIsModalSatifactionVisible(false);
    setPatientSatisfactionStatus(null);
    setPatientSatisfactionNote("");
  };

  async function getTicketByNumberData() {
    try {
      setLoadingPage(true);
      await getTicketByNumber(id);
    } catch (err) {
      // if (err.response) {
      //     if (err.response.status === 401) {
      //         localStorage.clear()
      //         sessionStorage.clear()
      //         navigate('/')
      //     } else {
      //         const errMessage = err.response.data.message
      //         message.error(errMessage)
      //     }
      // } else {
      //     // message.error('Tidak dapat menghubungi server, cek koneksi')
      //     // localStorage.clear()
      //     // sessionStorage.clear()
      //     // window.location.reload()
      // }
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

  useEffect(() => {
    if (!isEmpty(userById)) {
      setActivityMode(viewCommentList ? "comments" : "history");
    }
  }, [userById]);

  useEffect(() => {
    // ticketByNumber.category &&
    //   ticketByNumber.subCategory1 &&
    //   ticketByNumber.subCategory2 &&
    //   handleRahang();

    if (!isEmpty(ticketByNumber.agent)) {
      setAgent({
        id: ticketByNumber.agent.id,
        name: ticketByNumber.agent.name,
      });
    }

    if (
      ticketByNumber.ticketSolution &&
      ticketByNumber.ticketSolution.testFit
    ) {
      setIsTicketFitActive(true);
    }
  }, [teamList, ticketByNumber]);

  const openModalCSAT = () => {
    setIsModalSatifactionVisible(true);

    if (ticketByNumber.patientSatisfactionStatus !== null) {
      setPatientSatisfactionStatus(ticketByNumber.patientSatisfactionStatus);
    }

    if (ticketByNumber.patientSatisfactionNote !== "") {
      setPatientSatisfactionNote(ticketByNumber.patientSatisfactionNote);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setRelatedTransactionData([]);
  };

  const handleActivityChange = (e) => {
    const activity = e.target.value;
    setActivityMode(activity);
  };

  const onTeamChange = () => {
    form.setFieldsValue({
      agent: "",
    });

    setAgent({
      id: "",
      name: "",
    });
  };

  const userOptions =
    !isEmpty(userTeamArray) && !isEmpty(userTeamArray[0].users)
      ? convertOptions(userTeamArray[0].users, "name")
      : [];

  const handleFormValuesChange = (changedValues) => {
    const formFieldName = Object.keys(changedValues)[0];

    if (formFieldName === "team") {
      setSelectedTeam(changedValues[formFieldName]);

      form.setFieldsValue({
        agent: undefined,
      });
    }

    if (formFieldName === "status") {
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

  const handleDeleteTicket = async () => {
    confirm({
      title: `Are you sure delete this ticket data?`,
      okText: "Yes",
      okType: "danger",
      width: 520,
      content: `If you click "Yes", then ticket data titled ${
        ticketByNumber ? ticketByNumber.title : ""
      } will be deleted`,
      cancelText: "No",
      onOk() {
        async function deletingTicket() {
          try {
            await TicketApi.deleteTicketByNumber(id);
            navigate(-1);
          } catch (err) {
            if (err.response.data.message) {
              const errMessage = err.response.data.message;
              message.error(errMessage);
            } else {
              message.error("Tidak dapat menghubungi server, cek koneksi");
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }
          }
        }
        deletingTicket();
      },
      onCancel() {},
    });
  };

  const handleSubmitEditData = async (values) => {
    try {
      setIsLoadingButton(true);
      let theResponse;

      theResponse = await TicketApi.updateTicketDetails(
        id,
        values.team,
        agent.id,
        values.status
      );

      setCreateEditMessage(
        theResponse.data,
        "Success Updating Ticket Data",
        "Error Updating Ticket Data!"
      );
      navigate(-1);
      // setTimeout(() => {
      //     window.location.replace(window.location.href)
      //     window.location.reload()
      // }, 100)
    } catch (err) {
      if (err.response) {
        const errMessage = err.response.data.message;
        message.error(errMessage);
      }
    } finally {
      setIsLoadingButton(false);
    }
  };

  const handleSubmitEditTicketSolutionData = async (values) => {
    try {
      setIsLoadingButtonTicketSolutions(true);
      const payload = {
        patientName,
        soNumber,
        urgency: ticketSolution ? ticketSolution.urgency : "",
        ticketStatusProduction: {
          id: values.statusProductionId,
        },
        ticketOrder: {
          id: ticketSolution && ticketSolution.orderTypeId,
        },
        ticketProblem: {
          id: ticketSolution && ticketSolution.problemTypeId,
        },
        testFit: ticketSolution && ticketSolution.testFit,
        okFitDate:
          ticketSolution && ticketSolution.okFitDate
            ? moment(ticketSolution.okFitDate)
            : "",
        approvalFinanceDate:
          ticketSolution && ticketSolution.approvalFinanceDate
            ? moment(ticketSolution.approvalFinanceDate)
            : "",
        moldDate:
          ticketSolution && ticketSolution.moldDate
            ? moment(ticketSolution.moldDate)
            : "",
        okDoctorDate:
          ticketSolution && ticketSolution.okDoctorDate
            ? moment(ticketSolution.okDoctorDate)
            : "",
        okPatientDate:
          ticketSolution && ticketSolution.okPatientDate
            ? moment(ticketSolution.okPatientDate)
            : "",
        notes: ticketSolution ? ticketSolution.notes : "",
        patientId: ticketSolution ? ticketSolution.patientId : "",
        category: {
          id: ticketByNumber.category.id,
        },
        subCategory1: {
          id: ticketByNumber.subCategory1.id,
        },
        subCategory2: {
          id: ticketByNumber.subCategory2.id,
        },
        id: ticketSolution ? ticketSolution.id : "",
        ra:
          ticketSolution && ticketSolution.ra
            ? ticketSolution.ra.split(",").join()
            : "",
        rb:
          ticketSolution && ticketSolution.rb
            ? ticketSolution.rb.split(",").join()
            : "",
        ticketNumber: id,
      };

      const response = await TicketApi.updateTicketSolutionDetails(id, payload);

      setCreateEditMessage(
        response.data,
        "Success Updating Ticket Solution Data",
        "Error Updating Ticket Solution Data!"
      );
      getTicketByNumberData();
      getPatientTicketRelated(id);
    } catch (err) {
      if (err.response) {
        const errMessage = err.response.data.message;
        message.error(errMessage);
      }
    } finally {
      setIsLoadingButtonTicketSolutions(false);
    }
  };

  const handleSetAgent = (value) => {
    if (value === undefined || value === "") {
      setAgent({ id: "", name: "" });
      return;
    }
    if (userTeamArray[0] && userTeamArray[0].users) {
      const find = userTeamArray[0].users.find((item) => item.name === value);

      find && setAgent(find);
    }
  };

  const handleSeeMore = () => {
    fetchOrderTrackingList(selectedOrderTrackingSOnumber);
  };

  const handleOrderTrackingPagination = (key, value) => {
    setOrderTrackingPagination((prevState) => ({ ...prevState, [key]: value }));
  };

  const fetchOrderTrackingList = async (soNumber) => {
    if (!soNumber) return;

    try {
      const { data } = await RelatedTransactionApi.orders(
        soNumber,
        orderTrackingPagination.currentPage + 1
      );

      setOrderTrackingData((prevState) =>
        prevState.concat(data.currentElements)
      );
      handleOrderTrackingPagination("currentPage", data.currentPage);
      handleOrderTrackingPagination("totalPage", data.totalPage);
    } catch {
      //
    } finally {
      setIsModalTrackingVisible(true);
    }
  };

  const openOrderTrackingModal = (soNumber) => {
    fetchOrderTrackingList(soNumber);
    setSelectedOrderTrackingSOnumber(soNumber);
    setOrderTrackingData([]);
  };

  const closeOrderTrackingModal = () => {
    setIsModalTrackingVisible(false);
    setOrderTrackingPagination({
      ...orderTrackingPagination,
      currentPage: 0,
      totalPage: 0,
    });
    setSelectedOrderTrackingSOnumber("");
  };

  const openModalProdSolution = () => {
    formProdSolution.resetFields();
    if (ticketByNumber.ticketSolution) {
      if (
        ticketByNumber.ticketSolution &&
        ticketByNumber.ticketSolution.ra.length > 0
      ) {
        handleRahangActive("rahang_atas", true);
        setIsRahangSetActive(true);
      }

      if (
        ticketByNumber.ticketSolution &&
        ticketByNumber.ticketSolution.rb.length > 0
      ) {
        handleRahangActive("rahang_bawah", true);
        setIsRahangSetActive(true);
      }

      // setCategory(ticketByNumber.ticketSolution.category.id);
      // setSelectedSubCategory1(ticketByNumber.ticketSolution.subCategory1.id);
      // setSelectedSubCategory2(ticketByNumber.ticketSolution.subCategory2.id);
    }

    setModalProdSolution(true);
  };

  const closeModalProdSolution = () => {
    setModalProdSolution(false);
    formProdSolution.resetFields();
    setRahangPage({
      rahang_atas: 0,
      rahang_bawah: 0,
    });
    setRahangActive({
      rahang_atas: false,
      rahang_bawah: false,
    });
  };

  const handleRahangActive = (key, value) => {
    setRahangActive((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleSubmitProdSolution = async (values) => {
    let ra = "";
    let rb = "";

    if (!rahangActive.rahang_atas) {
      ra = "";
    } else {
      ra = values.ra ? values.ra.join(",") : "-";
    }

    if (!rahangActive.rahang_bawah) {
      rb = "";
    } else {
      rb = values.rb ? values.rb.join(",") : "-";
    }

    const payload = {
      ...values,
      patientName,
      patientId,
      id: (ticketSolution && ticketSolution.id) || "",
      ticketOrder: {
        id: values.orderTypeId,
      },
      ticketProblem: {
        id: values.problemTypeId,
      },
      //   ticketStatusProduction: { id: 9 }, // takeout issue user prod | from -> '?' now -> ''
      ra,
      rb,
      ticketNumber: id,
    };
    try {
      let res = {};

      if (ticketByNumber.ticketSolution) {
        res = await TicketApi.updateTicketSolution(payload, id);
      } else {
        res = await TicketApi.createTicketSolution(payload, id);
      }

      if (res.data.status === "SUCCESS") {
        message.success("Success Updating Ticket Data");
        getTicketByNumberData();
        getPatientTicketRelated(id);
        closeModalProdSolution();
        // Change to useState hook later
        setTimeout(() => {
          window.location.reload();
        }, 200);
      }
    } catch (err) {
      if (err.response) {
        const errMessage = err.response.data.message;
        message.error(errMessage);
      }
    }
  };

  const handleIsTicketFitActive = (value) => {
    if (!value) {
      formProdSolution.setFieldsValue({
        okFitDate: "",
      });
    }

    setIsTicketFitActive(value);
  };

  const handleFormValuesChangeModal = (changedValues) => {
    const formFieldName = Object.keys(changedValues)[0];

    if (formFieldName === "urgency") {
      form.setFieldsValue({
        due_date:
          changedValues[formFieldName] === "HIGH"
            ? moment().add(5, "days")
            : moment().add(3, "days"),
      });
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
      }
    }
  }

  const fetchOrderType = async () => {
    const { data } = await TicketApi.getOrderType();

    setOrderType(data);
  };

  const fetchStatusProductions = async () => {
    const { data } = await TicketApi.getStatusProductions();

    setStatusProductions(data);
  };

  const onSubmitCSAT = async (payload) => {
    let res = {};

    if (ticketByNumber.patientSatisfactionStatus === null) {
      res = await TicketApi.createCSAT(payload, id);
    } else {
      res = await TicketApi.updateCSAT(payload, id);
    }

    if (res.data.status === "SUCCESS") {
      message.success("Berhasil mengubah data");
      getTicketByNumberData();
      getPatientTicketRelated(id);
      setIsModalSatifactionVisible(false);
    }
  };

  const deleteTicketSolution = async () => {
    confirm({
      title: `Are you sure delete this ticket solution data?`,
      okText: "Yes",
      okType: "danger",
      width: 520,
      content: `If you click "Yes", then ticket data titled ${
        ticketByNumber ? ticketByNumber.title : ""
      } will be deleted`,
      cancelText: "No",
      onOk() {
        async function deleteSolutionTicket() {
          try {
            await TicketApi.deleteTicketSolution(id, ticketSolution.id);

            message.success("Success deleting Ticket Solution");
            getTicketByNumberData();
            getPatientTicketRelated(id);
            setTimeout(() => {
              window.location.reload();
            }, 200);
          } catch (err) {
            if (err.response) {
              const errMessage = err.response.data.message;
              message.error(errMessage);
            } else {
              message.error("Tidak dapat menghubungi server, cek koneksi");
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }
          }
        }

        deleteSolutionTicket();
      },
      onCancel() {},
    });
  };

  const handlePreventWithoutSave = () => {
    confirm({
      title: `Discard Unsaved Changes`,
      icon: <QuestionCircleOutlined color="#A4A4A4" />,
      okText: "Discard",
      okType: "danger",
      width: 520,
      content: "If you discard, you will lose any changes you have made.",
      cancelText: "Cancel",
      onOk() {
        closeModalProdSolution();
      },
      onCancel() {},
    });
  };

  const convertUrgency = (value) => {
    if (!value) return "";

    switch (value) {
      case "NORMAL":
        form.setFieldsValue({
          urgency: "Urgent",
        });

        return "Urgent";
      case "HIGH":
        form.setFieldsValue({
          urgency: "Hard Complaint",
        });
        return "Hard Complaint";
      case "PRIORITY":
        form.setFieldsValue({
          urgency: "Request Khusus",
        });
        return "Request Khusus";
      default:
        return value;
    }
  };

  const onHandleOkDoctor = (value) => {
    setOkDoctorDate(value);
  };

  const disabledOkPatientDate = (endValue) => {
    if (!endValue || !okDoctorDate) {
      return false;
    }
    return endValue.valueOf() <= okDoctorDate.valueOf();
  };

  const fetchRelatedTransactionList = async () => {
    if (!soNumber) return;

    try {
      const { data } = await RelatedTransactionApi.getList(soNumber);

      const relatedTransaction = data.data.map((item) => {
        const soNumber = item.soNumber.split(" / ");

        return {
          ...item,
          soNumber: soNumber.length > 1 ? soNumber[0] : soNumber,
        };
      });

      setRelatedTransactionData(relatedTransaction);
    } catch {
      //
    } finally {
      setIsModalVisible(true);
    }
  };

  const openRelatedTransaction = () => {
    fetchRelatedTransactionList();
  };

  const pathNotFound = location?.pathname;
  useEffect(() => {
    if (
      pathNotFound === "/recent-closed-tickets/recent-closed-tickets" ||
      pathNotFound === "/recent-closed-tickets/search-inactive-tickets"
    ) {
      window.location.href = "/recent-closed-tickets";
    } else if (
      pathNotFound === "/search-inactive-tickets/recent-closed-tickets" ||
      pathNotFound === "/search-inactive-tickets/search-inactive-tickets"
    ) {
      window.location.href = "/search-inactive-tickets";
    }
  }, [pathNotFound]);

  useEffect(() => {
    convertUrgency(urgency);
  }, [urgency]);

  useEffect(() => {
    fetchOrderType();
    fetchStatusProductions();
    fetchProblemType();
    getCategoryListData();
    getTicketByNumberData();
    getTeamListData();
    getPatientTicketRelated(id);
  }, []);

  useEffect(() => {
    setSelectedClassStatus(ticketByNumber?.status);
  }, [ticketByNumber]);

  const menu = (
    <Menu>
      <Menu.Item onClick={() => setIsModalVisible(true)}>
        See Related Transaction
      </Menu.Item>
      {ticketByNumber.status !== "DROPPED" && (
        <>
          <Menu.Item onClick={() => openModalCSAT()}>
            {!ticketByNumber.patientSatisfactionStatus &&
            ticketByNumber.patientSatisfactionStatus === null
              ? "Add "
              : "Edit "}{" "}
            Patient Satisfaction
          </Menu.Item>
          {ticketSolution && (
            <Menu.Item onClick={deleteTicketSolution}>
              Delete Ticket Solution
            </Menu.Item>
          )}
          {deleteTicket && (
            <Menu.Item onClick={handleDeleteTicket}>Delete Ticket</Menu.Item>
          )}
        </>
      )}
    </Menu>
  );

  if (loadingPage) {
    return <PageSpinner />;
  }

  return (
    <>
      <Modal
        title={
          !ticketByNumber.ticketSolution
            ? "Add Ticket Solution"
            : "Edit Ticket Solution"
        }
        centered
        visible={modalProdSolution}
        onCancel={handlePreventWithoutSave}
        width={1000}
        closable={false}
        footer={[
          <Button key="back" onClick={handlePreventWithoutSave}>
            Cancel
          </Button>,
          <Button
            key="submit"
            htmlType="submit"
            type="primary"
            form="prodSolutionForm"
            loading={isLoadingButton}
          >
            Submit
          </Button>,
        ]}
      >
        {ticketByNumber && (
          <Form
            layout="vertical"
            id="prodSolutionForm"
            form={formProdSolution}
            className="prod-solution-form"
            initialValues={{
              patientName,
              soNumber,
              urgency: ticketSolution ? ticketSolution.urgency : "",
              statusProductionId:
                ticketSolution &&
                ticketSolution.ticketStatusProduction &&
                ticketSolution.ticketStatusProduction.id,
              orderTypeId: ticketSolution && ticketSolution.ticketOrder.id,
              problemTypeId: ticketSolution && ticketSolution.ticketProblem.id,
              notes: ticketSolution ? ticketSolution.notes : "",
              moldDate:
                ticketSolution && ticketSolution.moldDate
                  ? moment(ticketSolution.moldDate)
                  : "",
              okFitDate:
                ticketSolution && ticketSolution.okFitDate
                  ? moment(ticketSolution.okFitDate)
                  : "",
              approvalFinanceDate:
                ticketSolution && ticketSolution.approvalFinanceDate
                  ? moment(ticketSolution.approvalFinanceDate)
                  : "",
              ra:
                ticketSolution && ticketSolution.ra
                  ? ticketSolution.ra.split(",")
                  : "",
              rb:
                ticketSolution && ticketSolution.rb
                  ? ticketSolution.rb.split(",")
                  : "",
              testFit: ticketSolution && ticketSolution.testFit,
              okDoctorDate:
                ticketSolution && ticketSolution.okDoctorDate
                  ? moment(ticketSolution.okDoctorDate)
                  : "",
              okPatientDate:
                ticketSolution && ticketSolution.okPatientDate
                  ? moment(ticketSolution.okPatientDate)
                  : "",
            }}
            onValuesChange={handleFormValuesChangeModal}
            onFinish={handleSubmitProdSolution}
          >
            <Row gutter={16}>
              <Col xs={8}>
                <Form.Item
                  label="Patient Name"
                  name="patientName"
                  rules={[{ required: true }]}
                >
                  <Input
                    size="large"
                    placeholder="Patient Name"
                    defaultValue={patientName}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item
                  label="SO Number"
                  name="soNumber"
                  rules={[{ required: true }]}
                >
                  <Input
                    size="large"
                    placeholder="Input SO Number"
                    defaultValue={soNumber}
                  />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item
                  label="Order Type"
                  name="orderTypeId"
                  rules={[
                    { required: true, message: "Please Select Order Type" },
                  ]}
                >
                  <Select
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    optionLabelProp="label"
                    placeholder="Select Order Type"
                    defaultValue={ticketSolution?.ticketOrder?.orderType}
                    size={"large"}
                  >
                    {orderType?.map((data, index) => (
                      <Option
                        key={index}
                        value={data.id}
                        label={data.orderType}
                      >
                        {data.orderType}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item
                  label="Urgency"
                  rules={[{ required: true, message: "Please select Urgency" }]}
                  name="urgency"
                >
                  <SelectDropdown
                    options={urgencyOptions}
                    placeHolder={"Select Urgency"}
                  />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item
                  label="Problem"
                  name="problemTypeId"
                  rules={[{ required: true, message: "Please select Problem" }]}
                >
                  <Select
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    optionLabelProp="label"
                    placeholder="Select Problem Type"
                    defaultValue={ticketSolution?.ticketProblem?.problemType}
                    size={"large"}
                  >
                    {problemTypes.map((data, index) => (
                      <Option
                        key={index}
                        value={data.id}
                        label={data.problemType}
                      >
                        {data.problemType}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              {/* <Col xs={8}>
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true }]}>
                <SelectDropdown
                  options={
                    !isEmpty(categoryList)
                      ? convertOptions(categoryList, 'name', 'id')
                      : []
                  }
                  placeholder={'Select Category'}
                  onChange={handleCategory}
                  defaultValue={ticketSolution && ticketSolution.category.name}
                />
              </Form.Item>
            </Col>

            <Col xs={8}>
              <Form.Item
                label="Sub Category 1"
                name="subCategory1"
                rules={[{ required: true }]}>
                <SelectDropdown
                  disabled={
                    ticketByNumber.ticketSolution === undefined
                      ? !isCategorySelected
                      : false
                  }
                  options={subCategory1Options}
                  placeholder={'Select Sub Category 1'}
                  defaultValue={
                    ticketSolution && ticketSolution.subCategory1.name
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={8}>
              <Form.Item
                label="Sub Category 2"
                name="subCategory2"
                rules={[{ required: true }]}>
                <SelectDropdown
                  disabled={
                    ticketByNumber.ticketSolution === undefined
                      ? !isSubCategory1Selected
                      : false
                  }
                  options={subCategory2Options}
                  placeholder={'Select Sub Category 2'}
                  defaultValue={
                    ticketSolution && ticketSolution.subCategory2.name
                  }
                />
              </Form.Item>
            </Col> */}

              <Col xs={24}>
                {isRahangSetActive && (
                  <Row>
                    <Col xs={24}>
                      <div className="rahang-set">
                        <p>
                          Set Bermasalah<span className="red">*</span>
                        </p>
                        <div>
                          <Checkbox
                            className="mb-20"
                            checked={rahangActive["rahang_atas"]}
                            onChange={(e) =>
                              handleRahangActive(
                                "rahang_atas",
                                e.target.checked
                              )
                            }
                          >
                            Rahang Atas
                          </Checkbox>
                        </div>

                        {rahangActive["rahang_atas"] && (
                          <div className="rahang-set-value">
                            {rahangPage.rahang_atas > 0 && (
                              <div
                                className="style-ra icon-container icon-container--left left-nav-homepage"
                                onClick={() => previous("rahang_atas")}
                              >
                                <img
                                  style={{
                                    position: "absolute",
                                    top: "0px",
                                    left: "20px",
                                  }}
                                  src={`https://rata-web-production-assets.s3.ap-southeast-1.amazonaws.com/icons/chevron-right-plain.svg`}
                                  alt="left"
                                />
                              </div>
                            )}

                            <Form.Item name="ra">
                              <Checkbox.Group style={{ width: "100%" }}>
                                <Carousel
                                  style={{ margin: "0px 5px" }}
                                  {...settings}
                                  ref={(node) =>
                                    (refRahangAtasContainer = node)
                                  }
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

                            {rahangPage.rahang_atas < 4 && (
                              <div
                                className="icon-container icon-container--right right-nav-homepage"
                                onClick={() => next("rahang_atas")}
                              >
                                <img
                                  style={{
                                    position: "absolute",
                                    top: "0px",
                                    left: "20px",
                                  }}
                                  src={`https://rata-web-production-assets.s3.ap-southeast-1.amazonaws.com/icons/chevron-right-plain.svg`}
                                  alt="right"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        <div
                          style={{ marginTop: "50px", marginBottom: "50px" }}
                        >
                          <Checkbox
                            className="mb-20"
                            checked={rahangActive["rahang_bawah"]}
                            onChange={(e) =>
                              handleRahangActive(
                                "rahang_bawah",
                                e.target.checked
                              )
                            }
                          >
                            Rahang Bawah
                          </Checkbox>
                        </div>

                        {rahangActive["rahang_bawah"] && (
                          <div className="rahang-set-value">
                            {rahangPage.rahang_bawah > 0 && (
                              <div
                                className="icon-container icon-container--left left-nav-homepage"
                                onClick={() => previous("rahang_bawah")}
                              >
                                <img
                                  style={{
                                    position: "absolute",
                                    top: "0px",
                                    left: "20px",
                                  }}
                                  src={`https://rata-web-production-assets.s3.ap-southeast-1.amazonaws.com/icons/chevron-right-plain.svg`}
                                  alt="left"
                                />
                              </div>
                            )}

                            <Form.Item name="rb">
                              <Checkbox.Group style={{ width: "100%" }}>
                                <Carousel
                                  {...settings}
                                  ref={(node) =>
                                    (refRahangBawahContainer = node)
                                  }
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

                            {rahangPage.rahang_bawah < 4 && (
                              <div
                                className="icon-container icon-container--right right-nav-homepage"
                                onClick={() => next("rahang_bawah")}
                              >
                                <img
                                  style={{
                                    position: "absolute",
                                    top: "0px",
                                    left: "20px",
                                  }}
                                  src={`https://rata-web-production-assets.s3.ap-southeast-1.amazonaws.com/icons/chevron-right-plain.svg`}
                                  alt="right"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                )}
              </Col>

              <Col xs={8} style={{ marginTop: "30px", marginBottom: "0px" }}>
                <Form.Item
                  label="Test Fit"
                  name="testFit"
                  rules={[
                    { required: true, message: "Please select Test Fit" },
                  ]}
                >
                  <Select
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    optionLabelProp="label"
                    placeholder="Select Test Fit"
                    onChange={handleIsTicketFitActive}
                    size={"large"}
                  >
                    <Option value={true} label="Yes">
                      Yes
                    </Option>
                    <Option value={false} label="No">
                      No
                    </Option>
                  </Select>
                </Form.Item>
              </Col>

              {isTicketFitActive && (
                <Col xs={8} style={{ marginTop: "30px", marginBottom: "0px" }}>
                  <Form.Item
                    label="OK Test Fit Date"
                    name="okFitDate"
                    rules={[
                      {
                        required: true,
                        message: "Please select OK Test Fit Date",
                      },
                    ]}
                  >
                    <DatePicker
                      size="large"
                      showTime
                      placeholder="Select OK Test Fit Date"
                    />
                  </Form.Item>
                </Col>
              )}

              <Col xs={8} style={{ marginTop: "30px", marginBottom: "0px" }}>
                <Form.Item
                  label="Approval Finance Date"
                  name="approvalFinanceDate"
                >
                  <DatePicker
                    size="large"
                    showTime
                    placeholder="Select Date Approval"
                  />
                </Form.Item>
              </Col>

              <Col xs={8} style={{ marginTop: "30px", marginBottom: "0px" }}>
                <Form.Item label="Cetak Date" name="moldDate">
                  <DatePicker
                    size="large"
                    showTime
                    placeholder="Select cetak date"
                  />
                </Form.Item>
              </Col>

              <Col xs={8} style={{ marginTop: "30px", marginBottom: "0px" }}>
                <Form.Item label="OK Doctor Date" name="okDoctorDate">
                  <DatePicker
                    size="large"
                    showTime
                    placeholder="Select OK Doctor Date"
                    onChange={onHandleOkDoctor}
                  />
                </Form.Item>
              </Col>

              <Col xs={8} style={{ marginTop: "30px", marginBottom: "0px" }}>
                <Form.Item label="OK Patient Date" name="okPatientDate">
                  <DatePicker
                    disabled={okDoctorDate === ""}
                    disabledDate={disabledOkPatientDate}
                    size="large"
                    showTime
                    placeholder="Select OK Patient Date"
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item label="Notes" name="notes">
                  <TextArea rows={5} placeholder="Insert Notes" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>

      {!isEmpty(ticketByNumber) && (
        <DetailLayout
          detailId={ticketByNumber.number}
          detailName={ticketByNumber.title}
          className={"edit-ticket edit-form"}
          detailHeaderComponent={
            <Row
              align="middle"
              justify="end"
              style={{ gap: 10, marginBottom: "10px" }}
            >
              {!ticketByNumber.ticketSolution && (
                <Tooltip title="Add Ticket Solution">
                  <Button
                    className="white-button mr-0"
                    type="primary"
                    icon={
                      <img
                        style={{ marginBottom: "5px" }}
                        src="https://rata-web-staging-assets.s3.ap-southeast-1.amazonaws.com/teeth-icon.svg"
                        alt="solution"
                      />
                    }
                    htmlType="submit"
                    shape="circle"
                    onClick={() => openModalProdSolution()}
                  />
                </Tooltip>
              )}

              <Dropdown overlay={menu}>
                <Button
                  className="white-button mr-0"
                  type="primary"
                  icon={<EllipsisOutlined style={{ marginBottom: "5px" }} />}
                  shape="circle"
                />
              </Dropdown>
            </Row>
          }
          detailComponent={
            <>
              <Row gutter={44} className="edit-ticket__item position-relative">
                <Col span={16}>
                  <Row
                    align="middle"
                    justify="space-between"
                    style={{ marginBottom: 10 }}
                  >
                    <h3 style={{ marginBottom: 0 }}>Ticket</h3>
                    {editTicket && (
                      <Link to={`/edit-info-ticket/edit?id=${id}`}>
                        <Tooltip title="Edit Ticket">
                          <Button
                            className="white-button"
                            type="primary"
                            icon={
                              <EditOutlined
                                style={{
                                  color: "#5b5c5d",
                                  marginBottom: "5px",
                                  display: "block",
                                }}
                              />
                            }
                            htmlType="submit"
                            shape="circle"
                          />
                        </Tooltip>
                      </Link>
                    )}
                  </Row>

                  <div className="fw-medium mb-10 color-text-primary">
                    Description
                  </div>
                  <div className="description__text-area mb-30">
                    <div
                      id="description-ticket"
                      dangerouslySetInnerHTML={{
                        __html: ticketByNumber.description,
                      }}
                    />
                  </div>
                  <Row>
                  <Col xs={24}>
                  <Col xs={4}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0px 20px",
                        }}>
                        <div className="fw-medium color-text-primary mt-10 mb-10">
                          <span style={{ whiteSpace: "nowrap" }}>Unit Bisnis</span>
                        </div>
                        <div className="description__text-area">
                          <span 
                            style={{ 
                              whiteSpace: "nowrap", 
                              color: '#FFFFFF',
                              backgroundColor: handleBusinesBadgeColor(ticketByNumber?.businessUnit),
                              paddingRight: 20,
                              paddingLeft: 20,
                              borderRadius: '15px',
                            }}
                          >
                            {ticketByNumber?.businessUnit}
                          </span>
                        </div>
                  </Col>
                  <Col xs={4}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0px 20px",
                        }}>
                        <div className="fw-medium color-text-primary mt-10 mb-10">
                          <span style={{ whiteSpace: "nowrap" }}>Clinic Location</span>
                        </div>
                        <div className="description__text-area">
                          <span 
                            style={{ 
                              whiteSpace: "nowrap", 
                              paddingRight: 20,
                              paddingLeft: 20,
                            }}
                          >
                            {ticketByNumber?.clinicName ?? '-'}
                          </span>
                        </div>
                  </Col>
                  </Col>
                  </Row>
                  <Row className="mt-10 mb-20">
                    <Col xs={12}>
                      <Col
                        xs={6}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0px 20px",
                        }}
                      >
                        <div className="fw-medium color-text-primary mt-10 mb-10">
                          <span style={{ whiteSpace: "nowrap" }}>Category</span>
                        </div>
                        <div className="description__text-area">
                          <span style={{ whiteSpace: "nowrap" }}>
                            {ticketByNumber?.category.name}
                          </span>
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0px 20px",
                        }}
                      >
                        <div className="fw-medium color-text-primary mt-10 mb-10">
                          <span style={{ whiteSpace: "nowrap" }}>
                            Sub Category 1
                          </span>
                        </div>
                        <div className="description__text-area">
                          <span style={{ whiteSpace: "nowrap" }}>
                            {ticketByNumber?.subCategory1.name}
                          </span>
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0px 20px",
                        }}
                      >
                        <div className="fw-medium color-text-primary mt-10 mb-10">
                          <span style={{ whiteSpace: "nowrap" }}>
                            Sub Category 2
                          </span>
                        </div>
                        <div className="description__text-area mb-">
                          <span style={{ whiteSpace: "nowrap" }}>
                            {ticketByNumber?.subCategory2.name}
                          </span>
                        </div>
                      </Col>
                    </Col>
                    <Col xs={12} style={{ display: "flex", gap: "0px 20px" }}>
                      <div className="fw-medium color-text-primary">
                        Set Bermasalah
                      </div>
                      <div
                        className="description__text-area"
                        style={{ width: "100%" }}
                      >
                        <Col xs={24}>
                          <div className="rahang">
                            <div
                              style={{
                                display: "flex",
                                gap: "0px 10px",
                              }}
                            >
                              <span>RA: </span>
                              <span>
                                {ticketByNumber.ra
                                  ? sortingAsc("ticket", ticketByNumber.ra)
                                  : "-"}
                              </span>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                gap: "0px 10px",
                              }}
                            >
                              <span>RB: </span>
                              <span>
                                {ticketByNumber.rb
                                  ? sortingAsc("ticket", ticketByNumber.rb)
                                  : "-"}
                              </span>
                            </div>
                          </div>
                        </Col>
                      </div>
                    </Col>
                  </Row>

                  <Form
                    onFinish={handleSubmitEditData}
                    form={form}
                    onValuesChange={handleFormValuesChange}
                    id="edit-ticket-form"
                    layout="vertical"
                    initialValues={{
                      team: initialSelectValueTeam(ticketByNumber),
                      agent: ticketByNumber?.agent?.name,
                      status: ticketByNumber.status,
                    }}
                  >
                    <Row gutter={10} className="mb-20">
                      <Col span={8}>
                        <Form.Item
                          label="Assigned to Team"
                          name="team"
                          rules={[
                            {
                              required: true,
                              message: "Please select Assigned To Team",
                            },
                          ]}
                          className="mb-0"
                        >
                          <Select
                            getPopupContainer={(triggerNode) =>
                              triggerNode.parentNode
                            }
                            options={
                              !isEmpty(teamList) &&
                              !isEmpty(teamList.currentElements)
                                ? convertOptions(
                                    teamList.currentElements,
                                    "name",
                                    "id"
                                  )
                                : []
                            }
                            placeholder={"Select Team"}
                            onChange={onTeamChange}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label="Assigned to Agent"
                          rules={[{ required: false }]}
                          name="agent"
                          className="mb-0"
                        >
                          <AutoComplete
                            getPopupContainer={(triggerNode) =>
                              triggerNode.parentNode
                            }
                            style={{ height: 40 }}
                            allowClear
                            options={userOptions}
                            onChange={handleSetAgent}
                            placeholder={"Select Agent"}
                            filterOption={(inputValue, option) =>
                              option.value
                                .toUpperCase()
                                .indexOf(inputValue.toUpperCase()) !== -1
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label="Status"
                          name="status"
                          className={`mb-m0`}
                        >
                          <SelectDropdown
                            isBadgeStatus={true}
                            backgroundStatus={
                              selectedClassStatus === "OPEN"
                                ? "badge-status-open"
                                : selectedClassStatus === "IN_PROGRESS"
                                  ? "badge-status-IN_PROGRESS"
                                  : selectedClassStatus === "FEEDBACK"
                                    ? "badge-status-feedback"
                                    : selectedClassStatus === "ESCALATE"
                                      ? "badge-status-escalate"
                                      : selectedClassStatus === "FOLLOW_UP"
                                        ? "badge-status-follow_up"
                                        : selectedClassStatus
                            }
                            options={statusOptions}
                            placeholder={"Select Status"}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    {editTicket && (
                      <div
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Button
                          htmlType="submit"
                          loading={isLoadingButton}
                          form="edit-ticket-form"
                          type="primary"
                        >
                          Save
                        </Button>
                      </div>
                    )}

                    <Divider className="mb-30 mt-30" />
                  </Form>

                  {ticketByNumber && ticketByNumber.ticketSolution && (
                    <>
                      <div>
                        <Row
                          align="middle"
                          justify="space-between"
                          style={{ marginBottom: 10 }}
                        >
                          <h3 style={{ marginBottom: 0 }}>Ticket Solution</h3>
                          {editTicket && (
                            <Tooltip title="Edit Ticket Solution">
                              <Button
                                className="white-button"
                                type="primary"
                                icon={
                                  <EditOutlined
                                    style={{
                                      color: "#5b5c5d",
                                      marginBottom: "5px",
                                      display: "block",
                                    }}
                                  />
                                }
                                htmlType="submit"
                                shape="circle"
                                onClick={() => openModalProdSolution()}
                              />
                            </Tooltip>
                          )}
                        </Row>

                        <Row>
                          <Col xs={12}>
                            <p
                              style={{
                                margin: "20px 0px",
                                display: "flex",
                                alignItems: "center",
                                gap: "0px 10px",
                              }}
                            >
                              <span className="fw-medium detail-label color-text-primary mr-10">
                                Order Type
                              </span>
                              <span>
                                {ticketByNumber.ticketSolution.ticketOrder
                                  ? ticketByNumber.ticketSolution.ticketOrder
                                      .orderType
                                  : "-"}
                              </span>
                            </p>

                            <p
                              style={{
                                margin: "20px 0px",
                                display: "flex",
                                alignItems: "center",
                                gap: "0px 10px",
                              }}
                            >
                              <span className="fw-medium detail-label color-text-primary mr-10">
                                Urgency
                              </span>
                              <span>
                                {ticketByNumber.ticketSolution &&
                                  convertUrgency(
                                    ticketByNumber.ticketSolution.urgency
                                  )}
                              </span>
                            </p>

                            <p
                              style={{
                                margin: "20px 0px",
                                display: "flex",
                                alignItems: "center",
                                gap: "0px 10px",
                              }}
                            >
                              <span className="fw-medium detail-label color-text-primary mr-10">
                                Jenis Rahang
                              </span>

                              {ticketByNumber.ticketSolution.ra ||
                              ticketByNumber.ticketSolution.rb ? (
                                <span className="detail-value">
                                  {ticketByNumber.ticketSolution.ra && "RA"}
                                  &nbsp;
                                  {ticketByNumber.ticketSolution.rb && "RB"}
                                </span>
                              ) : null}
                            </p>
                            {ticketByNumber.ticketSolution.ra && (
                              <p
                                style={{
                                  margin: "20px 0px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0px 10px",
                                }}
                              >
                                <span className="fw-medium detail-label color-text-primary mr-10">
                                  Rahang Atas
                                </span>
                                <span className="detail-value">
                                  {ticketByNumber.ticketSolution.ra
                                    ? sortingAsc(
                                        "ticket-solution",
                                        ticketByNumber.ticketSolution.ra
                                      )
                                    : null}
                                </span>
                              </p>
                            )}
                            {ticketByNumber.ticketSolution.rb && (
                              <p
                                style={{
                                  margin: "20px 0px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0px 10px",
                                }}
                              >
                                <span className="fw-medium detail-label color-text-primary mr-10">
                                  Rahang Bawah
                                </span>
                                <span className="detail-value">
                                  {ticketByNumber.ticketSolution.rb
                                    ? sortingAsc(
                                        "ticket-solution",
                                        ticketByNumber.ticketSolution.rb
                                      )
                                    : null}
                                </span>
                              </p>
                            )}

                            <p
                              style={{
                                margin: "20px 0px",
                                display: "flex",
                                alignItems: "center",
                                gap: "0px 10px",
                              }}
                            >
                              <span className="fw-medium detail-label color-text-primary mr-10">
                                Problem
                              </span>
                              <span>
                                {ticketByNumber.ticketSolution &&
                                  ticketByNumber.ticketSolution.ticketProblem &&
                                  ticketByNumber.ticketSolution.ticketProblem
                                    .problemType}
                              </span>
                            </p>

                            <p
                              style={{
                                margin: "20px 0px",
                                display: "flex",
                                alignItems: "center",
                                gap: "0px 10px",
                              }}
                            >
                              <span className="fw-medium detail-label color-text-primary mr-10">
                                SO Number
                              </span>
                              <span>
                                {ticketByNumber.ticketSolution &&
                                  ticketByNumber.ticketSolution.soNumber &&
                                  ticketByNumber.ticketSolution.soNumber}
                              </span>
                            </p>
                          </Col>

                          <Col xs={12}>
                            <p
                              style={{
                                margin: "20px 0px",
                                display: "flex",
                                alignItems: "center",
                                gap: "0px 10px",
                              }}
                            >
                              <span className="fw-medium detail-label color-text-primary mr-10">
                                Test Fit
                              </span>
                              <span>
                                {ticketByNumber.ticketSolution.testFit
                                  ? "Yes"
                                  : "No"}
                              </span>
                            </p>

                            <p
                              style={{
                                margin: "20px 0px",
                                display: "flex",
                                alignItems: "center",
                                gap: "0px 10px",
                              }}
                            >
                              <span className="fw-medium detail-label color-text-primary mr-10">
                                OK Test Fit Date
                              </span>
                              <span>
                                {ticketByNumber.ticketSolution.okFitDate
                                  ? moment(
                                      ticketByNumber.ticketSolution.okFitDate
                                    ).format("DD MMMM YYYY - HH:mm:ss A")
                                  : "-"}
                              </span>
                            </p>

                            <p
                              style={{
                                margin: "20px 0px",
                                display: "flex",
                                alignItems: "center",
                                gap: "0px 10px",
                              }}
                            >
                              <span className="fw-medium detail-label color-text-primary">
                                Approval Finance Date
                              </span>
                              <span>
                                {ticketByNumber.ticketSolution
                                  .approvalFinanceDate
                                  ? moment(
                                      ticketByNumber.ticketSolution
                                        .approvalFinanceDate
                                    ).format("DD MMMM YYYY - HH:mm:ss A")
                                  : "-"}
                              </span>
                            </p>

                            <p
                              style={{
                                margin: "20px 0px",
                                display: "flex",
                                alignItems: "center",
                                gap: "0px 10px",
                              }}
                            >
                              <span className="fw-medium detail-label color-text-primary mr-10">
                                Cetak Date
                              </span>
                              <span>
                                {ticketByNumber.ticketSolution.moldDate
                                  ? moment(
                                      ticketByNumber.ticketSolution.moldDate
                                    ).format("DD MMMM YYYY - HH:mm:ss A")
                                  : "-"}
                              </span>
                            </p>

                            <p
                              style={{
                                margin: "20px 0px",
                                display: "flex",
                                alignItems: "center",
                                gap: "0px 10px",
                              }}
                            >
                              <span className="fw-medium detail-label color-text-primary mr-10">
                                OK Doctor Date
                              </span>
                              <span>
                                {ticketByNumber.ticketSolution.okDoctorDate
                                  ? moment(
                                      ticketByNumber.ticketSolution.okDoctorDate
                                    ).format("DD MMMM YYYY - HH:mm:ss A")
                                  : "-"}
                              </span>
                            </p>

                            <p
                              style={{
                                margin: "20px 0px",
                                display: "flex",
                                alignItems: "center",
                                gap: "0px 10px",
                              }}
                            >
                              <span className="fw-medium detail-label color-text-primary mr-10">
                                OK Patient Date
                              </span>
                              <span>
                                {ticketByNumber.ticketSolution.okPatientDate
                                  ? moment(
                                      ticketByNumber.ticketSolution
                                        .okPatientDate
                                    ).format("DD MMMM YYYY - HH:mm:ss A")
                                  : "-"}
                              </span>
                            </p>
                          </Col>

                          <Col xs={24}>
                            <span className="fw-medium detail-label color-text-primary">
                              Notes
                            </span>
                            <ReadMore
                              text={
                                ticketByNumber.ticketSolution.notes
                                  ? ticketByNumber.ticketSolution.notes
                                  : "-"
                              }
                            />
                          </Col>
                          {/* History User Created Ticket Solution */}
                          <Col xs={12}>
                            <p
                              style={{
                                margin: "20px 0px",
                                display: "flex",
                                alignItems: "center",
                                gap: "0px 10px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <span className="fw-medium detail-label color-text-primary mr-10">
                                  Created
                                </span>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "start",
                                    justifyContent: "center",
                                  }}
                                >
                                  <p>
                                    {ticketByNumber.ticketSolution &&
                                      ticketByNumber.ticketSolution.agent &&
                                      ticketByNumber.ticketSolution.agent.name}
                                  </p>
                                  <p>
                                    {ticketByNumber.ticketSolution &&
                                      ticketByNumber.ticketSolution.createdAt &&
                                      moment(
                                        ticketByNumber.ticketSolution.createdAt
                                      ).format("DD MMMM YYYY - HH:mm:ss A")}
                                  </p>
                                </div>
                              </div>
                            </p>
                          </Col>
                          {/* <Col xs={12}>
                                                        <p style={{ margin: "20px 0px", display: "flex", alignItems: "center", gap: "0px 10px", }}>
                                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                                <span className="fw-medium detail-label color-text-primary mr-10">
                                                                    Updated
                                                                </span>
                                                                <span>
                                                                    {ticketByNumber.ticketSolution &&
                                                                        ticketByNumber.ticketSolution.updatedAt &&
                                                                        moment(ticketByNumber.ticketSolution.updatedAt).startOf('hour').fromNow()
                                                                    }
                                                                </span>
                                                            </div>
                                                        </p>
                                                    </Col> */}
                        </Row>
                      </div>

                      <Form
                        onFinish={handleSubmitEditTicketSolutionData}
                        form={formTicketSolutionData}
                        id="edit-ticket-solution-form"
                        layout="vertical"
                        initialValues={{
                          statusProductionId:
                            ticketSolution &&
                            ticketSolution.ticketStatusProduction &&
                            ticketSolution.ticketStatusProduction.id,
                        }}
                      >
                        <Row className="mt-30 mb-20">
                          <Col xs={8}>
                            <Form.Item
                              label="Status Production"
                              name="statusProductionId"
                              className="mb-0"
                            >
                              <Select
                                getPopupContainer={(triggerNode) =>
                                  triggerNode.parentNode
                                }
                                optionLabelProp="label"
                                placeholder="Select Status Production"
                                size={"large"}
                              >
                                {statusProductions.map((data, index) => (
                                  <Option
                                    key={index}
                                    value={data.id}
                                    label={data.statusProduction}
                                  >
                                    {data.statusProduction}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>

                        {editTicket && (
                          <Button
                            htmlType="submit"
                            loading={isLoadingButtonTicketSolutions}
                            form="edit-ticket-solution-form"
                            type="primary"
                          >
                            Save
                          </Button>
                        )}
                      </Form>

                      <Divider className="mb-30 mt-30" />
                    </>
                  )}

                  <div className="mb-10 d-flex align-items-center">
                    <div className="fw-medium mr-10">Activity: </div>
                    <Radio.Group
                      onChange={handleActivityChange}
                      value={activityMode}
                      buttonStyle="solid"
                    >
                      {viewCommentList && (
                        <Radio.Button value="comments" className="mr-10">
                          Comments
                        </Radio.Button>
                      )}

                      <Radio.Button value="history">History</Radio.Button>
                    </Radio.Group>
                  </div>
                  {activityMode === "comments" ? (
                    <> {viewCommentList && <CommentLists />}</>
                  ) : (
                    <HistoryLists oldAgentValue={assignedTo} />
                  )}
                </Col>
                <Col span={8}>
                  <div className="edit-ticket__info-detail">
                    <InfoDetail
                      closeModal={closeModal}
                      openRelatedTransaction={openRelatedTransaction}
                      ticketsRelated={ticketRelateds}
                      loadingTicketRelated={
                        patients.getPatientTicketRelated.status === "LOADING"
                      }
                    />
                  </div>
                </Col>
              </Row>
            </>
          }
        />
      )}

      <ModalCustomerSatifaction
        defaultPatientSatisfactionNote={ticketByNumber.patientSatisfactionNote}
        defaultPatientSatisfactionStatus={
          ticketByNumber.patientSatisfactionStatus
        }
        isModalVisible={isModalSatifactionVisible}
        closeModal={closeModalSatisfaction}
        patientSatisfactionStatus={patientSatisfactionStatus}
        handlePatientSatisfactionStatus={setPatientSatisfactionStatus}
        patientSatisfactionNote={patientSatisfactionNote}
        handlePatientSatisfactionNote={setPatientSatisfactionNote}
        onSubmit={onSubmitCSAT}
      />

      <RelatedTransaction
        data={relatedTransactionData}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        openOrderTrackingModal={openOrderTrackingModal}
      />

      <OrderTracking
        pagination={orderTrackingPagination}
        data={orderTrackingData}
        isModalVisible={isModalTrackingVisible}
        closeModal={closeOrderTrackingModal}
        onSeeMore={handleSeeMore}
        selectedOrderTrackingSOnumber={selectedOrderTrackingSOnumber}
      />
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
})(EditTicket);
