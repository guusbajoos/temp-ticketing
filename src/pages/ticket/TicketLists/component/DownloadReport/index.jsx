/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Menu, message } from 'antd';
import { CloudDownloadOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { objectPropsToMenuItems } from 'utils';
import './styles/index.scss';
import { CSVLink } from 'react-csv';
import { isEmpty } from 'lodash';
import {
  headerCsvTicketsReport,
  headerTicketCommentLogs,
  headerTicketSLAReport,
} from '../../../helper';
import { ticketsToCommentLogCsv, ticketsToCsv, ticketsToSLA } from './adapter';

import { connect } from 'react-redux';
import { getTeamList } from '../../../../../store/action/TeamAction';

export function DownloadReport({
  ticketDataProvider,
  teamList,
  ticketDownloadCommentLog,
  ticketDownloadSla,
  ticketDownloadCustomerInteraction,
  ticketDownloadSolutionTicket,
}) {
  const [showMenuDownload, setShowMenuDownload] = useState('none');
  const [csvRows, setCsvRows] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [triggerDownload, setTriggerDownload] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('');
  const node = useRef();

  useEffect(() => {
    if (!isEmpty(csvRows) && !isEmpty(csvHeaders) && triggerDownload) {
      setTimeout(() => {
        document.getElementById('download-report__csv-link').click();
      }, 2000);
    }
  }, [csvRows, csvHeaders, triggerDownload]);

  const onMenuItemClicked = ({ item, key, keyPath, domEvent }) => {
    if (key === 'COMMENT_LOGS') {
      ticketDownloadCommentLog()
        .then((resp) => {
          setTriggerDownload(true);
          const link = document.createElement('a');
          link.href = resp.data.url;
          document.body.appendChild(link);
          link.click();

          message.success('Data berhasil diunduh, mohon tunggu');
        })
        .catch((err) => {
          const errMessage = err.response.data.message;
          message.error(errMessage);
        });
    }
    if (key === 'SLA_REPORT') {
      ticketDownloadSla()
        .then((resp) => {
          setTriggerDownload(true);
          const link = document.createElement('a');
          link.href = resp.data.url;
          document.body.appendChild(link);
          link.click();

          message.success('Data berhasil diunduh, mohon tunggu');
        })
        .catch((err) => {
          const errMessage = err.response.data.message;
          message.error(errMessage);
        });
    }
    if (key === 'CUSTOMER_INTERACTION') {
      ticketDownloadCustomerInteraction()
        .then((resp) => {
          const link = document.createElement('a');
          link.href = resp.data.url;
          document.body.appendChild(link);
          link.click();

          message.success('Data berhasil diunduh, mohon tunggu');
        })
        .catch((err) => {
          const errMessage = err.response.data.message;
          message.error(errMessage);
        });
    }

    if (key === 'TICKET_SOLUTIONS') {
      ticketDownloadSolutionTicket()
        .then((resp) => {
          const link = document.createElement('a');
          link.href = resp.data.url;
          document.body.appendChild(link);
          link.click();

          message.success('Data berhasil diunduh, mohon tunggu');
        })
        .catch((err) => {
          const errMessage = err.response.data.message;
          message.error(errMessage);
        });
    }
  };

  const handleClick = (e) => {
    if (node.current.contains(e.target)) {
      return;
    }
    setShowMenuDownload('none');
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  /**
   * ReportType structure
   * props
   * {
   *     ToString: func --> returns string value of this enum
   *     EnumValue: captilized separated by underscore for enum
   * }
   * @type {{CUSTOMER_INTERACTION: {EnumValue: (function(): string), ToString: (function(): string)}, COMMENT_LOGS: {EnumValue: (function(): string), ToString: (function(): string)}, SLA: {EnumValue: (function(): string), ToString: (function(): string)}}}
   */
  const ReportType = {
    CUSTOMER_INTERACTION: {
      MenuItemComp: {
        key: () => {
          return 'CUSTOMER_INTERACTION';
        },
        value: () => {
          return 'Customer Interactions';
        },
      },
      /**
       * generate csv conformed type
       * @param {callback} ticketDataProviderFunc provides tickets data
       */
      csv: (data) => {
        setCsvRows(ticketsToCsv(data, teamList));
        setCsvHeaders(headerCsvTicketsReport);
      },
    },
    SLA_REPORT: {
      MenuItemComp: {
        key: () => {
          return 'SLA_REPORT';
        },
        value: () => {
          return 'SLA Report';
        },
      },
      csv: (data) => {
        setCsvRows(ticketsToSLA(data, teamList));
        setCsvHeaders(headerTicketSLAReport);
      },
    },
    COMMENT_LOGS: {
      MenuItemComp: {
        key: () => {
          return 'COMMENT_LOGS';
        },
        value: () => {
          return 'Comment Logs';
        },
      },
      csv: (data) => {
        setCsvRows(ticketsToCommentLogCsv(data));
        setCsvHeaders(headerTicketCommentLogs);
      },
    },
    TICKET_SOLUTIONS: {
      MenuItemComp: {
        key: () => {
          return 'TICKET_SOLUTIONS';
        },
        value: () => {
          return 'Ticket Solutions';
        },
      },
      /**
       * generate csv conformed type
       * @param {callback} ticketDataProviderFunc provides tickets data
       */
      csv: (data) => {
        setCsvRows(ticketsToCsv(data, teamList));
        setCsvHeaders(headerCsvTicketsReport);
      },
    },
  };

  return (
    <div ref={node}>
      <Button
        style={{ float: 'right' }}
        className={'download-report__btn-dropdown'}
        key={'download-report__btn-download'}
        onClick={() => {
          if (showMenuDownload === 'none') {
            setShowMenuDownload('block');
          } else {
            setShowMenuDownload('none');
          }
        }}
        icon={<CloudDownloadOutlined />}
        size="large">
        Download
      </Button>
      <Menu
        key={'download-report__menu-item'}
        className={'download-report__menu-item'}
        onClick={onMenuItemClicked}
        style={{
          display: showMenuDownload,
          marginLeft: '9rem',
          marginTop: '3rem',
        }}>
        {objectPropsToMenuItems(ReportType)}
      </Menu>
      <CSVLink
        key={'download-report__csv-link'}
        id="download-report__csv-link"
        filename={selectedReportType + '.csv'}
        asyncOnClick={true}
        headers={csvHeaders}
        style={{ display: 'none' }}
        data={csvRows}
        separator={'|'}
      />
    </div>
  );
}

const mapStateToProps = ({ teamList }) => ({
  teamList,
});

export default connect(mapStateToProps, {
    getTeamList,
  })(DownloadReport)
