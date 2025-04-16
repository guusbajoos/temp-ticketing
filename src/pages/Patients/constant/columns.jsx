import { EditOutlined, SelectOutlined } from "@ant-design/icons";
import { Row } from "antd";
import { Tooltip } from "antd/lib";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { wordsCapitalize } from "utils/index";

export const columnsPatientList = [
  {
    title: "Patient Name",
    dataIndex: "patientName",
    render: (v) => wordsCapitalize(v) || "-",
  },
  {
    title: "Phone",
    dataIndex: "mainPhone",
    render: (v) => v || "-",
  },
  {
    title: "Secondary Phone",
    dataIndex: "secondaryPhone",
    render: (v) => v || "-",
  },
  {
    title: "Total Ticket",
    dataIndex: "totalTicket",
  },
  {
    title: "Action",
    render: (row) => (
      <Row>
        <div style={{ marginRight: 16 }}>
          <Tooltip title="Edit Patient">
            <Link to={`/patients/edit/${row.mainPhone}?from=patient-list`}>
              <EditOutlined />
            </Link>
          </Tooltip>
        </div>
        <div>
          <Tooltip title="Detail Patient">
            <Link to={`/patients/detail/${row.mainPhone}`}>
              <SelectOutlined style={{ transform: "rotate(90deg)" }} />
            </Link>
          </Tooltip>
        </div>
      </Row>
    ),
  },
];

export const columnsPatientRelatedTicketList = [
  {
    title: "Ticket Number",
    dataIndex: "ticketNumber",
    render: (v) => v || "-",
  },
  {
    title: "Status",
    dataIndex: "ticketStatus",
    render: (v) => v || "-",
  },
  {
    title: "Title",
    dataIndex: "ticketTitle",
    render: (v) => wordsCapitalize(v) || "-",
  },
  {
    title: "Created Date",
    dataIndex: "createdAt",
    render: (v) => (v ? dayjs(v).format("DD MMMM YYYY - HH:mm:ss A") : "-"),
  },
  {
    title: "Closed Date",
    dataIndex: "closedAt",
    render: (v) => (v ? dayjs(v).format("DD MMMM YYYY - HH:mm:ss A") : "-"),
  },
  {
    title: "Action",
    render: (row) => (
      <Row>
        <div>
          <Tooltip title="Detail Ticket">
            <a
              href={`/edit-ticket/edit?id=${row.ticketNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              <SelectOutlined style={{ transform: "rotate(90deg)" }} />
            </a>
          </Tooltip>
        </div>
      </Row>
    ),
  },
];
