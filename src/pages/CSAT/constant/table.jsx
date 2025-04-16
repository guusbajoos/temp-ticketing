import { SelectOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd/lib'
import moment from 'moment'

export const columns = [
    {
        title: 'Ticket Number',
        dataIndex: 'ticketNumber',
    },
    {
        title: 'Title',
        dataIndex: 'ticketTitle',
        ellipsis: true
    },
    {
        title: 'Patient Name',
        dataIndex: 'patientName',
        ellipsis: true,
    },
    {
        title: 'Response Date',
        dataIndex: 'responseDate',
        ellipsis: true,
        render: (date) => {
            return `${moment(date).format("DD MMMM YYYY - h:mm:ss A")}`
        }
    },
    {
        title: 'Response',
        dataIndex: 'response',
        width: "10%",
        render: (response) => `${response === "1" ? "Good" : "Bad"}`
    },
    {
        title: 'Infobip Chat',
        key: 'infoBipChat',
        width: "10%",
        render: (row) => row.infoBipChat !== null && (
            <Tooltip title='Infobip Chat - Open in New Tab'>
                <a href={`https://portal.infobip.com/conversations/my-work?conversationId=${row.infoBipChat}`} rel='noopener noreferrer' target='_blank'>
                    <SelectOutlined style={{ transform: 'rotate(90deg)' }} />
                </a>
            </Tooltip>
        ),
    },
    {
        title: 'Action',
        key: 'ticketNumber',
        width: "10%",
        render: (row) => (
            <Tooltip title='Detail Ticket - Open in New Tab'>
                <a href={`/edit-ticket/edit?id=${row.ticketNumber}`} rel='noopener noreferrer' target='_blank'>
                    <SelectOutlined style={{ transform: 'rotate(90deg)' }} />
                </a>
            </Tooltip>
        )
    },
]
