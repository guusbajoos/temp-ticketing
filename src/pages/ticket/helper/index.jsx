import { isEmpty } from 'lodash'
import { diffFromNow, timeDiff } from '../../../utils'
import pluralize from 'pluralize'
import moment from 'moment-timezone'
import _ from 'lodash'

export const sourceOptions = [
    { label: 'Account Executive', value: 'ACCOUNT EXECUTIVE' },
    { label: 'Clinic', value: 'CLINIC' },
    { label: 'Contact Center', value: 'CONTACT CENTER' },
    { label: 'Customer Apps', value: 'CUSTOMER APPS' },
    { label: 'Design', value: 'DESIGN' },
    { label: 'E-mail', value: 'E-MAIL' },
    { label: 'Marketing', value: 'MARKETING' },
    { label: 'Online Consultation', value: 'ONLINE CONSULTATION' },
    { label: 'Others', value: 'OTHERS' },
    { label: 'Outbond', value: 'OUTBOND' },
    { label: 'PAYG', value: 'PAYG' },
    { label: 'Sales', value: 'SALES' },
    { label: 'Scheduling', value: 'SCHEDULING' },
    { label: 'Social Media', value: 'SOCIAL MEDIA' },
    { label: 'Smile', value: 'Smile' },
    { label: 'Tanam Consultant', value: 'TANAM CONSULTANT' },
]

export const statusOptions = [
    { label: 'Open', value: 'OPEN' },
    { label: 'On Progress', value: 'IN_PROGRESS' },
    { label: 'Escalate', value: 'ESCALATE' },
    { label: 'Feedback', value: 'FEEDBACK' },
    { label: 'Closed', value: 'CLOSED' },
    { label: 'Follow Up', value: 'FOLLOW_UP' },
]

export const urgencyOptions = [
    { label: 'Normal (3 Days)', value: 'NORMAL' },
    { label: 'High (5 Days)', value: 'HIGH' },
    { label: 'Priority (3 Days)', value: 'PRIORITY' },
]

export const sortingOptions = [
    { label: 'Due Date', value: 'DUE_DATE' },
    { label: 'Created At', value: 'CREATED_AT' },
    { label: 'Latest Update', value: 'LATEST_UPDATE' },
    { label: 'Aging', value: 'AGING' },
    //   { label: 'Priority', value: 'PRIORITY' },
]

export const filterByActorOptions = [
    { label: 'Show All Tickets', value: 'SHOW_ALL_TICKETS' },
    { label: 'Show only my ticket', value: 'SHOW_ONLY_MY_TICKETS' },
    { label: 'Show only my teams', value: 'SHOW_ONLY_MY_TEAMS' },
]

export const handleBusinesBadgeColor = (busines) => {
    switch (busines){
        case "TANAM":
            return '#1C7C70C7'
        case "VINIR":
            return '#0047F9BA'
        case "RATA":
            return '#BE0D1EB2'
        default:
            return '#BE0D1EB2'
    }
}

export const headerCsvTicketsReport = [
    { label: 'Incoming Datetime', key: 'incomingAt' },
    { label: 'Created Datetime', key: 'createdAt' },
    { label: 'Ticket Number', key: 'number' },
    { label: 'Reporter', key: 'reporter.name' },
    { label: 'Customer ID', key: 'patientId' },
    { label: 'Customer Name', key: 'patientName' },
    { label: 'Phone Number', key: 'patientPhone' },
    { label: 'SO Number', key: 'soNumber' },
    { label: 'Medical Record', key: 'medicalRecord' },
    { label: 'Title', key: 'title' },
    { label: 'Urgency', key: 'urgency' },
    { label: 'Category', key: 'category.name' },
    { label: 'Subcategory 1', key: 'subCategory1.name' },
    { label: 'Subcategory 2', key: 'subCategory2.name' },
    { label: 'Description', key: 'description' },
    { label: 'Source', key: 'source' },
    { label: 'Due Date', key: 'dueAt' },
    { label: 'On Progress Datetime', key: 'onProgressCreatedAt' },
    { label: 'On Progress Team', key: 'onProgressTeam' },
    { label: 'On Progress Agent', key: 'onProgressAgent' },
    { label: 'Escalated Datetime', key: 'onEscalatedCreatedAt' },
    { label: 'Escalated to Team', key: 'onEscalatedTeam' },
    { label: 'Escalated to Agent', key: 'onEscalatedAgent' },
    { label: 'Feedback Datetime', key: 'onFeedbackCreatedAt' },
    { label: 'Feedback to Team', key: 'onFeedbackTeam' },
    { label: 'Feedback to Agent', key: 'onFeedbackAgent' },
    { label: 'Aging', key: 'aging' },
    { label: 'Closed Datetime', key: 'onClosedCreatedAt' },
    { label: 'Closed to Team', key: 'onClosedTeam' },
    { label: 'Closed to Agent', key: 'onClosedAgent' },
    { label: 'Last Status Updated', key: 'status' },
    { label: 'Last Updated Datetime', key: 'updatedAt' },
    { label: 'Last Team Updated', key: 'lastTeamUpdated' },
    { label: 'Last Person Updated', key: 'lastPersonUpdated' },
]

export const headerTicketCommentLogs = [
    { label: 'Datetime', key: 'createdAt' },
    { label: 'Ticket Number', key: 'ticketNumber' },
    { label: 'Patient ID', key: 'patientID' },
    { label: 'Agent', key: 'agent' },
    { label: 'Comment', key: 'message' },
]
export const headerTicketSLAReport = [
    { label: 'Ticket Number', key: 'number' },
    { label: 'Patient ID', key: 'patientId' },
    { label: 'Assigned to team', key: 'team.name' },
    { label: 'Assigned to agent', key: 'agent.name' },
    { label: 'Status', key: 'status' },
    { label: 'Assigned Datetime', key: 'assignedAt' },
    { label: 'Aging Status', key: 'aging' },
]

export const datePeriodFilterOptions = [
    { label: '7 Days', value: '7 Days' },
    { label: '1 Month', value: '1 Month' },
    { label: '1 Year', value: '1 Year' },
    { label: 'Custom', value: 'Custom' },
]

export const ticketStatusList = [
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Escalate', value: 'ESCALATE' },
    { label: 'Feedback', value: 'FEEDBACK' },
    { label: 'Follow Up', value: 'FOLLOW_UP' },
]

/**
 * get initial select value
 * this function should be used because
 * it will facilitate type conversion between int and string
 * @param {object} ticket with following {
 *     agent {?teams: [{?id: ?}]}
 *     team {id: ?}
 * }
 * @return {string} initial value for team
 */
export const initialSelectValueTeam = (ticket) => {
    return (!isEmpty(ticket.agent) && !isEmpty(ticket.team)) ||
        !isEmpty(ticket.team)
        ? String(ticket.team.id)
        : !isEmpty(ticket.agent)
            ? String(_.get(_.first(_.get(ticket, 'agent.teams')), 'id', ''))
            : ''
}

/**
 * get initial select value for agent select box
 * @param {object} ticket with the following props {
 *     agent {id: ?},
 *     team
 * }
 * @return {string}
 */
export const initialSelectValueAgent = (ticket, value = 'id') => {
    return !isEmpty(ticket.agent) && !isEmpty(ticket.team)
        ? String(ticket.agent[value])
        : ''
}

/**
 * get initial select value for category select box
 * @param {object} ticket with the following props {
 *     category {id: ?}
 * }
 * @return {string}
 */
export const initialSelectValueCategory = (ticket) => {
    return !isEmpty(ticket.category)
        ? { category: String(ticket.category.id) }
        : ''
}

/**
 * get initial select value for subcategory1 select box
 * @param {object} ticket with the following props {
 *     subcategory1 {id: ?}
 * }
 * @return {string}
 */
export const initialSelectValueSubCategory1 = (ticket) => {
    return !isEmpty(ticket.subCategory1)
        ? { sub_category_1: String(ticket.subCategory1.id) }
        : ''
}

/**
 * get initial select value for subcategory2 select box
 * @param {object} ticket with the following props {
 *     subcategory2 {id: ?}
 * }
 * @return {string}
 */
export const initialSelectValueSubCategory2 = (ticket) => {
    return !isEmpty(ticket.subCategory2)
        ? { sub_category_2: String(ticket.subCategory2.id) }
        : ''
}

/**
 * Apply filtering logic for selectedTeam for providing data to select box
 * This function has two condition
 * 1. Return all matching team.id if selectedId is not empty
 * 2. If selectedId is empty, we assume the data was from currentTicket
 * @param {[]} teamList all team list or empty if no matching elements found
 * has prop
 * {
 *     currentElements: [{
 *         id: ?
 *     }],
 *
 * }
 * @param {string} selectedId selectedId, can be empty
 * @param {object} ticket current ticket, can be empty
 * has prop
 * {
 *     team: {
 *         name: ?
 *         id: ?
 *     },
 *     agent: {
 *         teams: [
 *             {
 *                 name: ?
 *             }
 *         ]
 *     }
 * }
 * @return {*[]|*}
 */
export const filterSelectedTeamForSelectBox = (
    teamList,
    selectedId,
    ticket
) => {
    if (isEmpty(teamList) || isEmpty(teamList.currentElements)) {
        return []
    }
    return teamList.currentElements.filter((team) =>
        selectedId
            ? String(team.id) === String(selectedId)
            : !isEmpty(ticket) && !isEmpty(ticket.team)
                ? team.name === ticket.team.name
                : team.name ===
                (!isEmpty(ticket) &&
                    _.get(_.first(_.get(ticket, 'agent.teams')), 'name', ''))
    )
}

/**
 * filter selected category for select box
 * @param categoryList item of category
 * has prop
 * {
 *     id: ?,
 * }
 * @param {string} selectedId selected category id
 * @param {object} ticket
 * has prop as specified with targetAttr
 * {
 *     ${targetAttr}: {
 *         id: ?
 *     }
 * }
 * @param targetAttr target attribute inside ticket object
 * @return {*[]|*} list of filtered categories or empty
 */
export const filterSelectedCategory = (
    categoryList,
    selectedId,
    ticket,
    targetAttr
) => {
    if (isEmpty(categoryList)) {
        return []
    }
    const x = categoryList.filter((category) =>
        selectedId
            ? String(category.id) === String(selectedId)
            : !isEmpty(ticket) && !isEmpty(ticket[targetAttr])
                ? category.id === ticket[targetAttr].id
                : []
    )
    return x
}

/**
 * filterTeamByUser returns all matching teams with userID
 * @param {[]} teamList list of objects with the following props
 * {
 *     users: [
 *        {
 *            id: ? (string)
 *        }
 *     ]
 * }
 * @param {string} userID user.id
 * @return {*[]|*} list of teams
 */
export const filterTeamsByUser = (teamList, userID) => {
    if (isEmpty(teamList) || isEmpty(teamList.currentElements)) {
        return []
    }
    return teamList.currentElements.filter((team) => {
        if (!isEmpty(team.users)) {
            return (
                team.users.filter(function (u) {
                    return u.id === userID
                }).length > 0
            )
        }
        return false
    })
}
/**
 * formatTicketAge based on PRD
 * < 24 hours, will display in hour(s) unit
 * otherwise, we display in day(s) unit
 * @param ticketTs
 * @param ticketTs2 optional, if defined, it will diff t2 and t1
 * @returns {string} formatted timestamp according to aging format
 */
export const formatTicketAge = (ticketTs, ticketTs2) => {
    const diffTs = diffTicketTimestamp(ticketTs, ticketTs2)
    return formatAsDayHour(diffTs)
}
/**
 * Format moment duration object
 * to day or hours
 * @param ts
 * @return {*}
 */
export const formatAsDayHour = (ts) => {
    return ts.get('days') > 0
        ? pluralize('day', Math.round(ts.asDays()), true)
        : pluralize('hour', ts.get('hours'), true)
}
/**
 * Get hours duration from moment duration object
 * @param ts
 * @return {*}
 */
export const formatAsHours = (ts, round = true) => {
    const result = ts.asHours()
    if (round) {
        return Math.round(result)
    }
    return result
}
/**
 * Format report date time
 * @param value Timestamp
 * @return {string} formatted dateTime
 */
export const formatReportDateTime = (value) => {
    return moment(value).tz('Asia/Jakarta').format('MM/DD/YYYY HH:mm:ss')
}
/**
 * get team by ID
 * @param {Array} teamList
 * @param {int} ID targetID
 * @return {undefined|*} undefined if no matching item found. Otherwise, it returns team object
 */
export const filterTeamByID = (teamList, ID) => {
    if (isEmpty(teamList) || isEmpty(teamList.currentElements)) {
        return undefined
    }
    return teamList.currentElements.find(function (team) {
        return team.id === parseInt(ID)
    })
}
/**
 * diff of timestamp
 * @param ticketTs
 * @param ticketTs2
 * @return {moment.Duration|moment.Duration}
 */
export const diffTicketTimestamp = (ticketTs, ticketTs2) => {
    const diffTs = isEmpty(ticketTs2)
        ? diffFromNow(ticketTs)
        : timeDiff(ticketTs, ticketTs2)
    return diffTs
}

// Function to remove HTML Tags
export const removeHtmlTags = (data) => {
    return data.replace(/<[^>]*>?/gm, '')
}

export const removeSpaceTickets = (ticket) => {
    return ticket
        .split(' ')
        .filter((val) => val !== '')
        .join(' ')
}
