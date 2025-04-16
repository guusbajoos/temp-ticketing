import { SelectOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import moment from 'moment';
import React from 'react';

export function Columns(pathname) {
  const EDIT_TICKET = true;

  const COLUMNS = [
    {
      title: 'Ticket Number',
      key: 'ticket number',
      dataIndex: 'number',
      sorter: (a, b) => {
        const { number } = a;
        const { number: num } = b;
        const numA = number.split('-').slice(-1);
        const numB = num.split('-').slice(-1);
        const resultA = numA.map((valA) => parseInt(valA))[0];
        const resultB = numB.map((valB) => parseInt(valB))[0];
        return resultA - resultB;
      },
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Patient Name',
      key: 'patient_name',
      dataIndex: 'patient_name',
      sorter: (a, b) => a.patient_name.localeCompare(b.patient_name),
    },
    {
      title: 'Created Date',
      key: 'created_at',
      dataIndex: 'created_at',
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      render: (created_at) =>
        moment(created_at)
          .tz('Asia/Jakarta')
          .format('DD MMMM YYYY - HH:mm:ss A'),
    },
    {
      title: 'Closed Date',
      key: 'closed_at',
      dataIndex: 'closed_at',
      sorter: (a, b) => a.closed_at.localeCompare(b.closed_at),
      render: (closed_at) =>
        closed_at !== null
          ? moment(closed_at)
              .tz('Asia/Jakarta')
              .format('DD MMMM YYYY - HH:mm:ss A')
          : 'null',
    },
    {
      ...(EDIT_TICKET && {
        title: 'Action',
        render: (row) => (
          <Tooltip title="Open in New Tab">
            <a
              href={`${pathname}/edit?id=${row.number}`}
              rel="noopener noreferrer"
              target="_blank">
              <SelectOutlined style={{ transform: 'rotate(90deg)' }} />
            </a>
          </Tooltip>
        ),
      }),
    },
  ];

  return { COLUMNS };
}
