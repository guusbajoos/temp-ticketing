/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Input,
  Layout,
  message,
  Modal,
  Tooltip,
  Typography,
  notification,
} from "antd";

import CardReminderNotification from "components/CardReminder";
import { WarningOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  PlusOutlined,
  SwapOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import TicketApi from "api/ticket";
import { getTeamList } from "store/action/TeamAction";
import { getCategoryList } from "store/action/CategoryAction";
import { getSummaryUnassignedTickets } from "store/action/TicketAction";
import {
  checkPrivileges,
  queryStringify,
  removeEmptyAttributes,
} from "../../../utils";
import ModalAddData from "./component/ModalAdd";
import ModalConfirm from "./component/ModalConfirm";
import "../styles/index.scss";
import "./index.scss";
import { sortingOptions } from "../helper";
import ModalAssignTo from "./component/ModalAssignTo";
import { isArray } from "lodash/fp/_util";
import _ from "lodash";
import { ModalChangeStatus } from "./component/ModalChangeStatus";
import { useOuterClickNotifier } from "utils/hooks";
import Filter from "./component/Filter";
import ActionFilter from "./component/ActionFilter";
import BucketList from "./component/BucketList";

const { Content } = Layout;
const { confirm } = Modal;

export function TicketList({
  getTeamList,
  userById,
  getCategoryList,
  getSummaryUnassignedTickets,
  summaryUnassignedTickets,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModalAddOpenData, setShowModalAddOpenData] = useState(false);
  const [showModalAddProgressData, setShowModalAddProgressData] =
    useState(false);
  const [showModalAddEscalateData, setShowModalAddEscalateData] =
    useState(false);
  const [showModalAddFeedbackData, setShowModalAddFeedbackData] =
    useState(false);
  const [showModalAddFollowUpData, setShowModalAddFollowUpData] =
    useState(false);
  const [showModalAddClosedData, setShowModalAddClosedData] = useState(false);
  const [showModalAssignTo, setShowModalAssignTo] = useState(false);
  const [showModalChangeStatus, setShowModalChangeStatus] = useState(false);
  const [editOpenCard, setEditOpenCard] = useState(false);
  const [editProgressCard, setEditProgressCard] = useState(false);
  const [editEscalateCard, setEditEscalateCard] = useState(false);
  const [editFeedbackCard, setEditFeedbackCard] = useState(false);
  const [editFollowUpCard, setEditFollowUpCard] = useState(false);
  const [editClosedCard, setEditClosedCard] = useState(false);
  const [isOpenCardChecked, setIsOpenCardChecked] = useState(false);
  const [valueOpenCardChecked, setValueOpenCardChecked] = useState([]);
  const [isProgressCardChecked, setIsProgressCardChecked] = useState(false);
  const [valueProgressCardChecked, setValueProgressCardChecked] = useState([]);
  const [isEscalateCardChecked, setIsEscalateCardChecked] = useState(false);
  const [valueEscalateCardChecked, setValueEscalateCardChecked] = useState([]);
  const [isFeedbackCardChecked, setIsFeedbackCardChecked] = useState(false);
  const [valueFeedbackCardChecked, setValueFeedbackCardChecked] = useState([]);
  const [isFollowUpCardChecked, setIsFollowUpCardChecked] = useState(false);
  const [valueFollowUpCardChecked, setValueFollowUpCardChecked] = useState([]);
  const [isClosedCardChecked, setIsClosedCardChecked] = useState(false);
  const [valueClosedCardChecked, setValueClosedCardChecked] = useState([]);
  const [checkStatus, setCheckStatus] = useState("");
  const [columns, setColumns] = useState({});
  const [isInputChange, setIsInputChange] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);
  const innerRef = useRef(null);

  const { pathname } = location;
  const [currentPageByColumn, setCurrentPageByColumn] = useState({});
  const [loadingPage, setLoadingPage] = useState(false);
  const [loadingPageLoadMore, setLoadingPageLoadMore] = useState(false);

  const [tickets, setTickets] = useState({
    open: [],
    in_progress: [],
    escalate: [],
    feedback: [],
    follow_up: [],
  });
  const [unassignedTickets, setUnassignedTickets] = useState([]);
  const [isTicketStatus, setIsTicketStatus] = useState({
    status: "",
    condition: false,
  });
  const [activeFilterV3, setActiveFilterV3] = useState({
    keyword: "",
    teamId: [],
    agentId: [],
    status: "",
    categoryId: "",
    subCategory1Id: "",
    subCategory2Id: "",
    minDate: "",
    maxDate: "",
    sortBy: "",
    sortDir: "",
    totalRow: 10,
    nextValue: "",
    businessUnit: "",
    clinicName: "",
  });

  const createTicket = checkPrivileges(userById, 15);
  const deleteTicket = checkPrivileges(userById, 17);
  const downloadTicket = checkPrivileges(userById, 36);
  const [selectedSorting, setSelectedSorting] = useState("");

  const resetFilter = () => {
    setActiveFilterV3({
      teamId: [],
      agentId: [],
      categoryId: "",
      subCategory1Id: "",
      subCategory2Id: "",
      minDate: "",
      maxDate: "",
      sortBy: "",
      sortDir: "",
      totalRow: 10,
      nextValue: "",
      businessUnit: "",
      clinicName: "",
    });
  };

  async function fetchDataAllTicketStatus(status, activeFilterListV3) {
    setLoadingPage(true);
    let params = {
      ...activeFilterListV3,
      totalRow: 10,
    };
    const data = await TicketApi.getTicketListV3(
      queryStringify(
        removeEmptyAttributes({
          ...params,
          status: status,
        })
      )
    );
    return data.data.data;
  }

  async function getTicketListDataV3(activeFilterListV3) {
    try {
      if (isTicketStatus.status && isTicketStatus.condition) {
        const data = await fetchDataAllTicketStatus(
          isTicketStatus.status,
          activeFilterListV3,
        );
        const updatedTickets = {
          open: [],
          in_progress: [],
          escalate: [],
          feedback: [],
          follow_up: [],
        };
        updatedTickets[isTicketStatus.status.toLowerCase()] = data;
        setTickets(updatedTickets);
      } else {
        Promise.all([
          fetchDataAllTicketStatus("OPEN", activeFilterListV3),
          fetchDataAllTicketStatus("IN_PROGRESS", activeFilterListV3),
          fetchDataAllTicketStatus("ESCALATE", activeFilterListV3),
          fetchDataAllTicketStatus("FEEDBACK", activeFilterListV3),
          fetchDataAllTicketStatus("FOLLOW_UP", activeFilterListV3),
        ])
          .then((response) => {
            setTickets({
              open: response[0],
              in_progress: response[1],
              escalate: response[2],
              feedback: response[3],
              follow_up: response[4],
            });
          })
          .catch((error) => {
            setTickets({
              open: [],
              in_progress: [],
              escalate: [],
              feedback: [],
              follow_up: [],
            });
            throw new Error(error.response);
          });
      }
    } catch (err) {
      if (err.response) {
        message.error("Tidak dapat menghubungi server, cek koneksi");
        localStorage.clear();
        sessionStorage.clear();
        navigate("/");
      }
    } finally {
      setLoadingPage(false);
      message.destroy("msg-on-save-user-settings-data");
    }
  }

  async function getUnassignedTicketListData(activeFilterValue) {
    try {
      setLoadingPage(true);
      const { data } = await TicketApi.getUnassignedTickets(
        queryStringify(
          removeEmptyAttributes({
            ...activeFilterValue,
          })
        )
      );

      const { currentElements, currentPage, totalPage } = data;
      setUnassignedTickets(currentElements);

      if (!isEmpty(data) && currentPage === 1) {
      } else if (!isEmpty(data) && currentPage > 1) {
        setUnassignedTickets((prevState) =>
          prevState.concat([...currentElements])
        );
      }

      if (currentPage === totalPage) {
        setIsLastOfPage(true);
      } else {
        setIsLastOfPage(false);
      }
    } catch (err) {
      // if (err.response) {
      //     message.error('Tidak dapat menghubungi server, cek koneksi')
      //     localStorage.clear()
      //     sessionStorage.clear()
      //     window.location.reload()
      //     window.location.href = '/'
      // } else {
      //     message.error('Tidak dapat menghubungi server, cek koneksi')
      //     localStorage.clear()
      //     sessionStorage.clear()
      //     window.location.reload()
      //     window.location.href = '/'
      // }
    } finally {
      setLoadingPage(false);
      activeFilterValue.status = [];
    }
  }

  useEffect(() => {
    if (`${location.pathname}${location.search}` === "/all-tickets?my-teams") {
      getTicketListDataV3({
        ...activeFilterV3,
        teamId: localStorage.getItem("team_id"),
      });
    } else if (pathname.includes("my-tickets")) {
      getTicketListDataV3({
        ...activeFilterV3,
        agentId: localStorage.getItem("user_id"),
      });
    } else if (pathname.includes("unassigned-tickets")) {
      delete activeFilterV3.totalRow;
      delete activeFilterV3.teamId;
      getUnassignedTicketListData({
        ...activeFilterV3,
        page: 1,
        size: 100,
        team: localStorage.getItem("team_id"),
      });
    } else {
      getTicketListDataV3({
        ...activeFilterV3,
      });
    }
  }, [activeFilterV3, isTicketStatus, pathname, location]);

  useEffect(() => {
    const initialPageByColumn = {};
    Object.keys(columns).forEach((columnId) => {
      initialPageByColumn[columnId] = 1;
    });
    setCurrentPageByColumn(initialPageByColumn);
  }, [columns]);

  async function getSummaryTicketsData() {
    await getSummaryUnassignedTickets(localStorage.getItem("user_id"));
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
    getSummaryTicketsData();
    // getUserId();
    getTeamListData();
  }, []);

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
        message.error("Tidak dapat menghubungi server, cek koneksi");
        localStorage.clear();
        sessionStorage.clear();
        navigate("/");
      }
    }
  }

  useEffect(() => {
    getCategoryListData();
  }, []);

  useEffect(() => {
    if (pathname.includes("unassigned-tickets")) {
      const onProgressData = !isEmpty(unassignedTickets)
        ? unassignedTickets.filter((obj) => obj.status === "IN_PROGRESS")
        : [];
      const openData = !isEmpty(unassignedTickets)
        ? unassignedTickets.filter((obj) => obj.status === "OPEN")
        : [];
      const escalateData = !isEmpty(unassignedTickets)
        ? unassignedTickets.filter((obj) => obj.status === "ESCALATE")
        : [];
      const feedbackData = !isEmpty(unassignedTickets)
        ? unassignedTickets.filter((obj) => obj.status === "FEEDBACK")
        : [];
      const followUpData = !isEmpty(unassignedTickets)
        ? unassignedTickets.filter((obj) => obj.status === "FOLLOW_UP")
        : [];

      setColumns({
        1: {
          name: "Open",
          items: openData,
          granted: checkPrivileges(userById, 29),
        },
        2: {
          name: "On Progress",
          items: onProgressData,
          granted: checkPrivileges(userById, 30),
        },
        3: {
          name: "Escalate",
          items: escalateData,
          granted: checkPrivileges(userById, 31),
        },
        4: {
          name: "Feedback",
          items: feedbackData,
          granted: checkPrivileges(userById, 32),
        },
        5: {
          name: "Follow Up",
          items: followUpData,
          granted: checkPrivileges(userById, 33),
        },
      });
    } else {
      setColumns({
        1: {
          name: "Open",
          items: tickets.open,
          granted: checkPrivileges(userById, 29),
        },
        2: {
          name: "On Progress",
          items: tickets.in_progress,
          granted: checkPrivileges(userById, 30),
        },
        3: {
          name: "Escalate",
          items: tickets.escalate,
          granted: checkPrivileges(userById, 31),
        },
        4: {
          name: "Feedback",
          items: tickets.feedback,
          granted: checkPrivileges(userById, 32),
        },
        5: {
          name: "Follow Up",
          items: tickets.follow_up,
          granted: checkPrivileges(userById, 33),
        },
      });
    }
  }, [activeFilterV3, tickets, unassignedTickets]);

  const handleHideModalAddOpenData = () => {
    setShowModalAddOpenData(false);
  };
  const handleHideModalAddProgressData = () => {
    setShowModalAddProgressData(false);
  };
  const handleHideModalAddEscalateData = () => {
    setShowModalAddEscalateData(false);
  };
  const handleHideModalAddFeedbackData = () => {
    setShowModalAddFeedbackData(false);
  };

  const handleHideModalAddFollowUpData = () => {
    setShowModalAddFollowUpData(false);
  };
  const handleHideModalAddClosedData = () => {
    setShowModalAddClosedData(false);
  };
  const handleHideModalAssignTo = () => {
    setShowModalAssignTo(false);
  };
  const handleHideModalChangeStatus = () => {
    setShowModalChangeStatus(false);
  };

  /**
   * handleListRefresh fetch ticketList
   * @param {int} page
   * @param {int} pageSize
   * @param {arrayCallback} function to be executed after fetching the list
   */
  const handleListRefresh = (page, pageSize, callbacks) => {
    if (pathname.includes("my-tickets")) {
      setActiveFilterV3({
        ...activeFilterV3,
        agendId: localStorage.getItem("user_id"),
        totalRow: 10,
      });
    } else {
      setActiveFilterV3({
        ...activeFilterV3,
        totalRow: 10,
      });
    }

    if (isArray(callbacks)) {
      callbacks.forEach(function (f) {
        f();
      });
    }
  };

  const handleShowModalAddOpenData = (param) => (e) => {
    e.preventDefault();
    switch (param) {
      case "Open":
        setShowModalAddOpenData(true);
        setCheckStatus("Open");
        break;
      case "On Progress":
        setShowModalAddProgressData(true);
        setCheckStatus("On Progress");
        break;
      case "Escalate":
        setShowModalAddEscalateData(true);
        setCheckStatus("Escalate");
        break;
      case "Feedback":
        setShowModalAddFeedbackData(true);
        setCheckStatus("Feedback");
        break;
      case "Closed":
      case "Follow Up":
        setShowModalAddFollowUpData(true);
        setCheckStatus("Follow Up");
        break;
      default:
        break;
    }
  };

  const handleEditCard = (param) => (e) => {
    e.preventDefault();
    switch (param) {
      case "Open":
        setEditOpenCard(!editOpenCard);
        break;
      case "On Progress":
        setEditProgressCard(!editProgressCard);
        break;
      case "Escalate":
        setEditEscalateCard(!editEscalateCard);
        break;
      case "Feedback":
        setEditFeedbackCard(!editFeedbackCard);
        break;
      case "Follow Up":
        setEditFollowUpCard(!editFollowUpCard);
        break;
      case "Closed":
        setEditClosedCard(!editClosedCard);
        break;
      default:
        break;
    }
  };

  /**
   * get state mutator of edit func based on columnName
   * @param {string} colName columnName, e.g. Open, On Progress etc
   * @returns {callback | undefined} function to mutate state of edit
   */
  const editStateFuncByColumnName = (colName) => {
    switch (colName) {
      case "Open":
        return setEditOpenCard;
      case "On Progress":
        return setEditProgressCard;
      case "Feedback":
        return setEditFeedbackCard;
      case "Follow Up":
        return setEditFollowUpCard;
      case "Closed":
        return setEditClosedCard;
      case "Escalate":
        return setEditEscalateCard;
      default:
        return undefined;
    }
  };

  /**
   * get checked state mutator func based on columnName
   * @param colName columnName, e.g. Open, On Progress etc
   * @returns {callback} function to mutate checkedState
   */
  const setCheckedFuncByColumnName = (colName) => {
    if (colName === "Open") {
      return setIsOpenCardChecked;
    } else if (colName === "On Progress") {
      return setIsProgressCardChecked;
    } else if (colName === "Escalate") {
      return setIsEscalateCardChecked;
    } else if (colName === "Feedback") {
      return setIsFeedbackCardChecked;
    } else if (colName === "Follow Up") {
      return setIsFollowUpCardChecked;
    } else {
      return setIsClosedCardChecked;
    }
  };

  const onChangeOpenCard = (checkedValues) => {
    if (checkedValues.target.checked) {
      setValueOpenCardChecked([...valueOpenCardChecked, checkedValues]);
      setCheckStatus("Open");

      if (!isEmpty(checkedValues)) {
        setIsOpenCardChecked(true);
      }
    } else {
      setIsOpenCardChecked(false);
    }
  };

  const onChangeProgressCard = (checkedValues) => {
    if (checkedValues.target.checked) {
      setValueProgressCardChecked([...valueProgressCardChecked, checkedValues]);
      setCheckStatus("On Progress");

      if (!isEmpty(checkedValues) && valueProgressCardChecked.length > 0) {
        setIsProgressCardChecked(true);
      }
    } else {
      setIsProgressCardChecked(false);
    }
  };

  const onChangeEscalateCard = (checkedValues) => {
    if (checkedValues.target.checked) {
      if (valueEscalateCardChecked.length < 0) {
        setEditEscalateCard(false);
      }
      setValueEscalateCardChecked([...valueEscalateCardChecked, checkedValues]);
      setCheckStatus("Escalate");

      if (!isEmpty(checkedValues)) {
        setIsEscalateCardChecked(true);
      }
    } else {
      setIsEscalateCardChecked(false);
    }
  };

  const onChangeFeedbackCard = (checkedValues) => {
    if (checkedValues.target.checked) {
      setValueFeedbackCardChecked([...valueFeedbackCardChecked, checkedValues]);
      setCheckStatus("Feedback");

      if (!isEmpty(checkedValues)) {
        setIsFeedbackCardChecked(true);
      }
    } else {
      setIsFeedbackCardChecked(false);
    }
  };
  const onChangeFollowUpCard = (checkedValues) => {
    if (checkedValues.target.checked) {
      setValueFollowUpCardChecked([...valueFollowUpCardChecked, checkedValues]);
      setCheckStatus("Follow Up");

      if (!isEmpty(checkedValues)) {
        setIsFollowUpCardChecked(true);
      }
    } else {
      setIsFollowUpCardChecked(false);
    }
  };

  const onChangeClosedCard = (checkedValues) => {
    setValueClosedCardChecked(checkedValues);
    setCheckStatus("Closed");

    if (!isEmpty(checkedValues)) {
      setIsClosedCardChecked(true);
    }
  };

  useEffect(() => {
    if (!isEmpty(valueOpenCardChecked)) {
      setIsOpenCardChecked(true);
      setEditOpenCard(true);
    } else {
      setIsOpenCardChecked(false);
      setEditOpenCard(false);
    }
  }, [valueOpenCardChecked]);

  useEffect(() => {
    if (!isEmpty(valueProgressCardChecked)) {
      setIsProgressCardChecked(true);
      setEditProgressCard(true);
    } else {
      setIsProgressCardChecked(false);
      setEditProgressCard(false);
    }
  }, [valueProgressCardChecked]);

  useEffect(() => {
    if (!isEmpty(valueEscalateCardChecked)) {
      setIsEscalateCardChecked(true);
      setEditEscalateCard(true);
    } else {
      setIsEscalateCardChecked(false);
      setEditEscalateCard(false);
    }
  }, [valueEscalateCardChecked]);

  useEffect(() => {
    if (!isEmpty(valueFeedbackCardChecked)) {
      setIsFeedbackCardChecked(true);
      setEditFeedbackCard(true);
    } else {
      setIsFeedbackCardChecked(false);
      setEditFeedbackCard(false);
    }
  }, [valueFeedbackCardChecked]);

  useEffect(() => {
    if (!isEmpty(valueFollowUpCardChecked)) {
      setIsFollowUpCardChecked(true);
      setEditFollowUpCard(true);
    } else {
      setIsFollowUpCardChecked(false);
      setEditFollowUpCard(false);
    }
  }, [valueFollowUpCardChecked]);

  useEffect(() => {
    if (!isEmpty(valueClosedCardChecked)) {
      setIsClosedCardChecked(true);
      setEditClosedCard(true);
    } else {
      setIsClosedCardChecked(false);
      setEditClosedCard(false);
    }
  }, [valueClosedCardChecked]);

  const handleDeleteRow = async () => {
    const valueCheckbox =
      checkStatus === "Open"
        ? valueOpenCardChecked
        : checkStatus === "On Progress"
          ? valueProgressCardChecked
          : checkStatus === "Escalate"
            ? valueEscalateCardChecked
            : checkStatus === "Feedback"
              ? valueFeedbackCardChecked
              : checkStatus === "Follow Up"
                ? valueFollowUpCardChecked
                : valueClosedCardChecked;

    const selectedTickets = tickets[
      checkStatus?.toLowerCase() === "on progress"
        ? "in_progress"
        : checkStatus?.toLowerCase() === "follow up"
          ? "follow_up"
          : checkStatus?.toLowerCase()
    ]
      ?.filter((data) => {
        return valueCheckbox?.some((item) => item.target.value === data.number);
      })
      .map((data) => data.number);

    confirm({
      title: `Are you sure delete this ticket?`,
      okText: "Yes",
      width: 520,
      okType: "danger",
      content: `If you click “Yes”, then ticket will be deleted`,
      cancelText: "No",
      onOk() {
        async function deletingOrderType() {
          try {
            selectedTickets.map(async (numberTicket) => {
              await TicketApi.deleteTicketList(numberTicket);
              setEditOpenCard(false);
              setEditProgressCard(false);
              setEditFeedbackCard(false);
              setEditEscalateCard(false);
              setEditFollowUpCard(false);
              if (pathname.includes("my-tickets")) {
                setActiveFilterV3({
                  ...activeFilterV3,
                  agentId: localStorage.getItem("user_id"),
                  totalRow: 10,
                });
              } else {
                setActiveFilterV3({
                  ...activeFilterV3,
                  totalRow: 10,
                });
              }
              if (checkStatus === "Open") {
                setIsOpenCardChecked(false);
              } else if (checkStatus === "On Progress") {
                setIsProgressCardChecked(false);
              } else if (checkStatus === "Escalate") {
                setIsEscalateCardChecked(false);
              } else if (checkStatus === "Feedback") {
                setIsFeedbackCardChecked(false);
              } else if (checkStatus === "Follow Up") {
                setIsFollowUpCardChecked(false);
              } else {
                setIsClosedCardChecked(false);
              }
            });
          } catch (err) {
            if (err.response) {
              const errMessage = err.response.data.message;
              message.error(errMessage);
            } else {
              message.error("Tidak dapat menghubungi server, cek koneksi");
            }
          }
        }

        deletingOrderType();
      },
      onCancel() {},
    });
  };

  const handleChangeStatusRow = (param) => (e) => {
    e.preventDefault();

    setCheckStatus(param);

    const valueCheckbox =
      param === "Open"
        ? valueOpenCardChecked
        : param === "On Progress"
          ? valueProgressCardChecked
          : param === "Escalate"
            ? valueEscalateCardChecked
            : param === "Feedback"
              ? valueFeedbackCardChecked
              : param === "Follow Up"
                ? valueFollowUpCardChecked
                : valueClosedCardChecked;

    const selectedTickets = tickets[
      param?.toLowerCase() === "on progress"
        ? "in_progress"
        : param?.toLowerCase() === "follow up"
          ? "follow_up"
          : param?.toLowerCase()
    ]?.filter((data) => {
      return valueCheckbox?.some((item) => item.target.value === data.number);
    });
    setSelectedTickets(selectedTickets);
    setShowModalChangeStatus(true);
  };

  const handleIconCard = (columnName, isCardChecked, isCardEditable, index) => {
    return (
      <Col xs={12} type="flex" align="end">
        {isCardChecked ? (
          [
            <Tooltip title="Change Status" key={"tooltip-change-status"}>
              <Button
                onClick={handleChangeStatusRow(columnName)}
                icon={<SwapOutlined />}
                className="mr-10"
              />
            </Tooltip>,
            <Tooltip title="Delete" key={"tooltip-delete"}>
              <Button
                onClick={handleDeleteRow}
                icon={<DeleteOutlined />}
                className="mr-10"
              />
            </Tooltip>,
          ]
        ) : (
          <>
            {createTicket && (
              <Tooltip title="Create new ticket">
                <Button
                  icon={<PlusOutlined />}
                  className="mr-10"
                  onClick={handleShowModalAddOpenData(columnName)}
                />
              </Tooltip>
            )}
            {deleteTicket && (
              <Tooltip title="Edit Bulk Ticket">
                {isCardEditable ? (
                  <Button
                    icon={<UnlockOutlined />}
                    className="mr-10"
                    onClick={handleEditCard(columnName)}
                  />
                ) : (
                  <Button
                    icon={
                      <>
                        <svg
                          width="17"
                          height="20"
                          viewBox="0 0 17 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.48418 9.71446H1.57709C1.18894 9.71446 0.875 10.0305 0.875 10.419V18.4205C0.875 18.809 1.18894 19.125 1.57709 19.125H15.4229C15.8111 19.125 16.125 18.809 16.125 18.4205V10.419C16.125 10.0305 15.8111 9.71446 15.4229 9.71446H13.5158V5.86332C13.5158 4.20805 12.8903 2.95753 11.9452 2.12217C11.0025 1.28889 9.74915 0.875 8.5 0.875C7.25085 0.875 5.99752 1.28889 5.05478 2.12217C4.10969 2.95753 3.48418 4.20805 3.48418 5.86332V9.71446ZM12.1116 5.86332V9.71446H4.88837V5.86332C4.88837 4.65901 5.34129 3.76483 6.01385 3.17039C6.68876 2.57387 7.59228 2.27287 8.5 2.27287C9.40771 2.27287 10.3112 2.57387 10.9862 3.17039C11.6587 3.76483 12.1116 4.65901 12.1116 5.86332ZM2.27919 17.7159V11.1235H14.7208V17.7159H2.27919Z"
                            fill="#4F4F4F"
                            stroke="#4F4F4F"
                            stroke-width="0.25"
                          />
                          <path
                            d="M8.94528 13C8.71678 13.0024 8.49531 13.0804 8.31468 13.2222C8.13404 13.364 8.00415 13.5618 7.94483 13.7854C7.88551 14.009 7.90001 14.2461 7.98612 14.4605C8.07224 14.675 8.22523 14.855 8.42176 14.9731V15.6521C8.42176 15.7927 8.47692 15.9277 8.5751 16.0271C8.67327 16.1266 8.80643 16.1825 8.94528 16.1825C9.08412 16.1825 9.21728 16.1266 9.31546 16.0271C9.41363 15.9277 9.46879 15.7927 9.46879 15.6521V14.9731C9.66532 14.855 9.81832 14.675 9.90443 14.4605C9.99054 14.2461 10.005 14.009 9.94572 13.7854C9.8864 13.5618 9.75651 13.364 9.57587 13.2222C9.39524 13.0804 9.17378 13.0024 8.94528 13Z"
                            fill="#4F4F4F"
                          />
                        </svg>
                      </>
                    }
                    className="mr-10"
                    onClick={handleEditCard(columnName)}
                  />
                )}
              </Tooltip>
            )}
          </>
        )}
      </Col>
    );
  };

  const onInputChange = (value) => {
    const convertValue = value.trim();
    setIsInputChange(true);
    if (pathname.includes("my-tickets")) {
      setActiveFilterV3({
        ...activeFilterV3,
        agentId: localStorage.getItem("user_id"),
        keyword: convertValue,
      });
    } else {
      setActiveFilterV3({
        ...activeFilterV3,
        keyword: convertValue,
      });
    }
  };

  const onSortingChange = (value) => {
    setSelectedSorting(value);

    let newFilter = {
      ...activeFilterV3,
    };
    if (value === "LATEST_UPDATE") {
      newFilter.sortBy = "epochUpdatedAt";
      newFilter.sortDir = "DESC";
    } else if (value === "DUE_DATE") {
      newFilter.sortBy = "epochDueAt";
      newFilter.sortDir = "DESC";
    } else if (value === "CREATED_AT") {
      newFilter.sortBy = "epochCreatedAt";
      newFilter.sortDir = "DESC";
    } else if (value === "AGING") {
      newFilter.sortBy = "epochCreatedAt";
      newFilter.sortDir = "ASC";
    } else if (value === "PRIORITY") {
      newFilter.sortBy = "urgency";
      newFilter.sortDir = "DESC";
    } else {
      newFilter.sort = "";
    }
    setActiveFilterV3({
      ...newFilter,
    });
  };

  const handleFilterShow = () => {
    setShowFilter(!showFilter);
    setShowSort(false);
  };
  const handleSortShow = () => {
    setShowSort(!showSort);
    setShowFilter(false);
  };

  const onTeamChange = async (checkedValues) => {
    setActiveFilterV3({
      ...activeFilterV3,
      teamId: checkedValues,
      agentId: "",
    });
  };

  const onBusinesChange = async (checkedValues) => {
    setActiveFilterV3({
      ...activeFilterV3,
      businessUnit: checkedValues.toUpperCase() === "TANAM GIGI" ? "TANAM" : checkedValues.toUpperCase()
    });
  };

  const onClinicNameChange = async (checkedValues) => {
    setActiveFilterV3({
      ...activeFilterV3,
      clinicName: checkedValues
    });
  };

  const onAgentChange = async (checkedValues) => {
    setActiveFilterV3({
      ...activeFilterV3,
      agentId: checkedValues,
      status: "",
    });
  };

  const onTicketStatusChange = async (checkedValues) => {
    setIsTicketStatus({
      status: checkedValues,
      condition: true,
    });
  };

  const onCategoryChange = (checkedValues) => {
    setActiveFilterV3({
      ...activeFilterV3,
      categoryId: checkedValues,
    });
  };

  const onSubCategory1Change = (checkedValues) => {
    setActiveFilterV3({
      ...activeFilterV3,
      subCategory1Id: checkedValues,
    });
  };

  const onSubCategory2Change = (checkedValues) => {
    setActiveFilterV3({
      ...activeFilterV3,
      subCategory2Id: checkedValues,
    });
  };

  const filterComponent = (
    <Filter
      setIsTicketStatus={setIsTicketStatus}
      setTickets={setTickets}
      resetFilter={resetFilter}
      setActiveFilter={setActiveFilterV3}
      activeFilter={activeFilterV3}
      // innerRef={innerRef}
      onTeamChange={onTeamChange}
      onBusinesChange={onBusinesChange}
      onClinicNameChange={onClinicNameChange}
      onAgentChange={onAgentChange}
      onTicketStatusChange={onTicketStatusChange}
      onCategoryChange={onCategoryChange}
      onSubCategory1Change={onSubCategory1Change}
      onSubCategory2Change={onSubCategory2Change}
      show={showFilter}
    />
  );

  const handleLoadMoreTicketList = async (nextValue, columnName) => {
    setLoadingPageLoadMore(true);
    const column = columns[columnName];
    const newColumnName =
      column.name === "On Progress" ? "In Progress" : column.name;

    if (pathname.includes("unassigned-tickets")) {
      const paramsUnassignedTickets = {
        page: currentPageByColumn[columnName] + 1,
        size: 10,
        team: localStorage.getItem("team_id"),
        status: newColumnName?.split(" ")?.join("_")?.toUpperCase(),
      };
      const { data } = await TicketApi.getUnassignedTickets(
        queryStringify(
          removeEmptyAttributes({
            ...paramsUnassignedTickets,
          })
        )
      );
      const { currentElements } = data;
      const mergedItems = [...column.items, ...currentElements];
      if (pathname.includes("unassigned-tickets")) {
        if (currentElements.length === 0) {
          openNotificationLoadMore(newColumnName);
        }
      } else {
        if (data.data.length == 0) {
          openNotificationLoadMore();
        }
      }

      setColumns({
        ...columns,
        [columnName]: {
          ...column,
          items: mergedItems,
        },
      });
      setCurrentPageByColumn({
        ...currentPageByColumn,
        [columnName]: currentPageByColumn[columnName] + 1,
      });
      setLoadingPageLoadMore(false);
    } else {
      const params = {
        totalRow: 10,
        nextValue,
        status: isTicketStatus.status
          ? isTicketStatus.status
          : newColumnName?.split(" ")?.join("_")?.toUpperCase(),
        agentId: pathname.includes("my-tickets")
          ? localStorage.getItem("user_id")
          : activeFilterV3?.agentId,
        teamId:
          `${location?.pathname}${location?.search}` === "/all-tickets?my-teams"
            ? localStorage.getItem("team_id")
            : activeFilterV3?.teamId,
        categoryId: activeFilterV3?.categoryId,
        subcategory1Id: activeFilterV3?.subCategory1Id,
        subcategory2Id: activeFilterV3?.subCategory2Id,
        minDate: activeFilterV3?.minDate,
        maxDate: activeFilterV3?.maxDate,
      };

      const { data } = await TicketApi.getTicketListV3(
        queryStringify(
          removeEmptyAttributes({
            ...params,
          })
        )
      );
      if (data.data.length == 0) {
        openNotificationLoadMore();
      }
      const mergedItems = [...column.items, ...data.data];

      setColumns({
        ...columns,
        [columnName]: {
          ...column,
          items: mergedItems,
        },
      });
      setCurrentPageByColumn({
        ...currentPageByColumn,
        [columnName]: currentPageByColumn[columnName] + 1,
      });
      setLoadingPageLoadMore(false);
    }
  };
  const openNotificationLoadMore = () => {
    notification.open({
      message: "Info",
      description: `No Data on next page!`,
      icon: (
        <WarningOutlined
          style={{
            color: "#FAAD14",
          }}
        />
      ),
    });
  };

  useOuterClickNotifier(handleFilterShow, innerRef);
  useOuterClickNotifier(handleSortShow, innerRef);

  return (
    <Layout>
      <Content>
        <Typography.Title
          style={{ color: "#5b5c5d", margin: "0px 10px 15px 10px" }}
          level={3}
        >
          {`${location?.pathname}${location?.search}` ===
          "/all-tickets?my-teams"
            ? "My Team Tickets"
            : location?.pathname === "/all-tickets"
              ? "All Tickets"
              : location?.pathname === "/my-tickets"
                ? "My Tickets"
                : `${location?.pathname} === "/unassigned-tickets` &&
                  "Unassigned Tickets"}
        </Typography.Title>
        <CardReminderNotification
          setSelectedSorting={setSelectedSorting}
          isLoading={loadingPage}
          myTicketCount={summaryUnassignedTickets?.data?.totalMyTickets}
          unassignedTicketCount={
            summaryUnassignedTickets?.data?.totalMyTeamUnassignedTickets
          }
          myTeamCount={summaryUnassignedTickets?.data?.totalMyTeamTickets}
        />

        {/* All Tickets - Component Action like, Filter, Search, Sort, etc..   */}
        <ActionFilter
          isInputChange={isInputChange}
          onInputChange={onInputChange}
          pathname={pathname}
          handleFilterShow={handleFilterShow}
          showFilter={showFilter}
          handleSortShow={handleSortShow}
          showSort={showSort}
          sortingOptions={sortingOptions}
          onSortingChange={onSortingChange}
          selectedSorting={selectedSorting}
          filterComponent={filterComponent}
          downloadTicket={downloadTicket}
          setIsModalConfirmVisible={setIsModalConfirmVisible}
        />
        {/* List Bucket */}
        <BucketList
          loadingPage={loadingPage}
          columns={columns}
          editOpenCard={editOpenCard}
          editProgressCard={editProgressCard}
          editEscalateCard={editEscalateCard}
          editFeedbackCard={editFeedbackCard}
          editFollowUpCard={editFollowUpCard}
          editClosedCard={editClosedCard}
          handleIconCard={handleIconCard}
          isOpenCardChecked={isOpenCardChecked}
          isProgressCardChecked={isProgressCardChecked}
          isEscalateCardChecked={isEscalateCardChecked}
          isFeedbackCardChecked={isFeedbackCardChecked}
          isFollowUpCardChecked={isFollowUpCardChecked}
          onChangeClosedCard={onChangeClosedCard}
          onChangeProgressCard={onChangeProgressCard}
          onChangeEscalateCard={onChangeEscalateCard}
          onChangeFeedbackCard={onChangeFeedbackCard}
          onChangeFollowUpCard={onChangeFollowUpCard}
          onChangeOpenCard={onChangeOpenCard}
          handleLoadMoreTicketList={handleLoadMoreTicketList}
          loadingPageLoadMore={loadingPageLoadMore}
          summaryUnassignedTickets={summaryUnassignedTickets}
          pathname={pathname}
        />

        <ModalConfirm
          isVisible={isModalConfirmVisible}
          handleCancel={() => setIsModalConfirmVisible(false)}
        />

        <ModalAddData
          checkStatus={checkStatus}
          setActiveFilter={setActiveFilterV3}
          activeFilter={activeFilterV3}
          showModalAddData={
            checkStatus === "Open"
              ? showModalAddOpenData
              : checkStatus === "Closed"
                ? showModalAddClosedData
                : checkStatus === "Escalate"
                  ? showModalAddEscalateData
                  : checkStatus === "Feedback"
                    ? showModalAddFeedbackData
                    : checkStatus === "Follow Up"
                      ? showModalAddFollowUpData
                      : showModalAddProgressData
          }
          handleHideModalAddData={
            checkStatus === "Open"
              ? handleHideModalAddOpenData
              : checkStatus === "Closed"
                ? handleHideModalAddClosedData
                : checkStatus === "Escalate"
                  ? handleHideModalAddEscalateData
                  : checkStatus === "Feedback"
                    ? handleHideModalAddFeedbackData
                    : checkStatus === "Follow Up"
                      ? handleHideModalAddFollowUpData
                      : handleHideModalAddProgressData
          }
          setShowModalAddData={
            checkStatus === "Open"
              ? setShowModalAddOpenData
              : checkStatus === "Closed"
                ? setShowModalAddClosedData
                : checkStatus === "Escalate"
                  ? setShowModalAddEscalateData
                  : checkStatus === "Feedback"
                    ? setShowModalAddFeedbackData
                    : checkStatus === "Follow Up"
                      ? setShowModalAddFollowUpData
                      : setShowModalAddProgressData
          }
        />

        {/*  modal assignTo */}
        <ModalAssignTo
          showModalAssignTo={showModalAssignTo}
          selectedTickets={selectedTickets}
          withoutSaveCallback={handleHideModalAssignTo}
          saveCallback={[
            () => {
              handleListRefresh(1, 100);
            },
            () => {
              editStateFuncByColumnName(checkStatus)(false);
              setCheckedFuncByColumnName(checkStatus)(false);
            },
            handleHideModalAssignTo,
          ]}
        />
        <ModalChangeStatus
          showModalChangeStatus={showModalChangeStatus}
          selectedTickets={selectedTickets}
          withoutSaveCallback={handleHideModalChangeStatus}
          saveCallback={[
            () => {
              handleListRefresh(1, 100);
            },
            () => {
              editStateFuncByColumnName(checkStatus)(false);
              setCheckedFuncByColumnName(checkStatus)(false);
            },
            handleHideModalChangeStatus,
          ]}
        />
      </Content>
    </Layout>
  );
}

const mapStateToProps = ({
  ticketList,
  userById,
  categoryList,
  teamList,
  summaryUnassignedTickets,
}) => ({
  ticketList,
  userById,
  categoryList,
  teamList,
  summaryUnassignedTickets,
});

export default connect(mapStateToProps, {
  getSummaryUnassignedTickets,
  getTeamList,
  getCategoryList,
})(TicketList);
