import { useState, useRef } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllCsatSummary, getAllTicketCSAT } from "store/action/CSATAction";
import { queryStringify, removeEmptyAttributes } from "utils/index";
import QueryString from "qs";
import { notification } from "antd";

export const useCSAT = () => {
  const [api, contextHolder] = notification.useNotification();
  const location = useLocation();
  const params = QueryString.parse(location.search);
  const [tableParams, setTableParams] = useState({
    keyword: "",
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState({
    minDate: moment().subtract(1, "days").format("YYYY-MM-DD"),
    maxDate: moment().subtract(1, "days").format("YYYY-MM-DD"),
    businessId: "",
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { csatSummaryList } = useSelector((state) => state);
  const { ticketCsatList } = useSelector((state) => state);
  const [isStatusCSATTable, setIsStatusCSATTable] = useState(true);
  const isMounted = useRef(true);
  const status = csatSummaryList?.error?.response?.status;

  async function getDataSummaryCSAT(activeFilter) {
    if (!isMounted.current) {
      setLoading(true);
      await dispatch(
        getAllCsatSummary(
          queryStringify(removeEmptyAttributes({ ...activeFilter }))
        )
      );
      setLoading(false);
    } else {
      setLoading(true);
      const queryParams =
        Object.values(params).length > 0 ? params : activeFilter;
      if (queryParams.minDate > queryParams.maxDate) {
        api.info({
          message: "Info",
          description:
            "Minimum date exceeds maximum date, data will not be output.",
        });
      }
      delete queryParams["?summary"];
      await dispatch(
        getAllCsatSummary(
          queryStringify(removeEmptyAttributes({ ...queryParams }))
        )
      );
      setLoading(false);
    }
  }

  async function getDataTableCSAT(activeFilter) {
    setIsStatusCSATTable(true);
    setLoading(true);
    const queryParams =
      Object.values(params).length > 0 ? params : activeFilter;
    let newParams = {
      ...queryParams,
      keyword: tableParams.keyword,
      csatStatus:
        queryParams["?summary"] === "RESPONSE"
          ? "ALL"
          : queryParams["?summary"] || "ALL",
      page: tableParams.pagination.current,
      size: tableParams.pagination.pageSize,
    };

    delete newParams["?summary"];
    delete newParams["summary"];
    delete newParams["?keyword"];

    const data = await dispatch(
      getAllTicketCSAT(queryStringify(removeEmptyAttributes({ ...newParams })))
    );
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: data?.totalElements,
      },
    });
    setLoading(false);
    setIsStatusCSATTable(false);
  }

  const handleFilterSummary = async (titleSummary) => {
    const params = {
      csatStatus: titleSummary,
      minDate: activeFilter.minDate,
      maxDate: activeFilter.maxDate,
      businessId: activeFilter.businessId,
    };
    const data = await dispatch(
      getAllTicketCSAT(queryStringify(removeEmptyAttributes({ ...params })))
    );
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: data?.totalElements,
      },
    });
    const queryParams = `?summary=${params.csatStatus.toUpperCase()}&minDate=${
      params.minDate
    }&maxDate=${params.maxDate}&businessId=${activeFilter.businessId}`;
    navigate(queryParams);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setIsStatusCSATTable(true);

    setTableParams({
      ...tableParams,
      pagination,
      filters,
      ...sorter,
    });
  };

  const handleSearchTable = async () => {
    let newParams = {
      keyword: tableParams.keyword,
      page: tableParams.pagination.current,
      size: tableParams.pagination.pageSize,
      csatStatus: params["?summary"],
      ...params,
    };
    delete newParams["?summary"];
    if (location.search === "") {
      newParams.minDate = activeFilter.minDate;
      newParams.maxDate = activeFilter.maxDate;
      newParams.csatStatus = "ALL";
      newParams.businessId = activeFilter.businessId;
    }
    const data = await dispatch(
      getAllTicketCSAT(queryStringify(removeEmptyAttributes({ ...newParams })))
    );
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: data?.totalElements,
      },
    });
  };

  return {
    csatSummaryList,
    ticketCsatList,
    status,
    loading,
    activeFilter,
    tableParams,
    contextHolder,
    isStatusCSATTable,
    setTableParams,
    handleFilterSummary,
    setActiveFilter,
    getDataSummaryCSAT,
    getDataTableCSAT,
    handleTableChange,
    handleSearchTable,
    setIsStatusCSATTable,
    isMounted,
    params,
  };
};
