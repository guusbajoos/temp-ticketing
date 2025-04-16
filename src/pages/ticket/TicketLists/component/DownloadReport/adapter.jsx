import {
  diffTicketTimestamp,
  filterTeamByID,
  filterTeamsByUser,
  formatAsHours,
  formatReportDateTime,
  removeHtmlTags,
} from '../../../helper';
import { isEmpty } from 'lodash';
import _ from 'lodash';
import moment from 'moment';

export const ticketsToCsv = (tickets, teamList) => {
  const ticketCsvs = [];
  for (let ticket of tickets) {
    const ticketCsv = {};
    ticketCsv.incomingAt = formatReportDateTime(ticket.incomingAt);
    ticketCsv.number = ticket.number;
    ticketCsv.category = ticket.category;
    ticketCsv.createdAt = formatReportDateTime(ticket.createdAt);
    ticketCsv.closedAt = formatReportDateTime(ticket.closedAt);
    ticketCsv.description = ticket.description;
    ticketCsv.dueAt = formatReportDateTime(ticket.dueAt);
    ticketCsv.medicalRecord = ticket.medicalRecord;
    ticketCsv.patientId = ticket.patientId;
    ticketCsv.patientName = ticket.patientName;
    ticketCsv.patientPhone = ticket.patientPhone;
    ticketCsv.reporter = ticket.reporter;
    ticketCsv.soNumber = ticket.soNumber;
    ticketCsv.source = ticket.source;
    ticketCsv.status = ticket.status;
    ticketCsv.subCategory1 = ticket.subCategory1;
    ticketCsv.subCategory2 = ticket.subCategory2;
    ticketCsv.team = ticket.team;
    ticketCsv.agent = ticket.agent;
    ticketCsv.title = ticket.title;
    ticketCsv.updatedAt = formatReportDateTime(ticket.updatedAt);
    ticketCsv.urgency = ticket.urgency;

    // get ticket sla objects
    const ticketSlaItems = getTicketSLA(ticket, teamList);
    for (let slaItem of ticketSlaItems) {
      if (slaItem.status === 'IN_PROGRESS') {
        ticketCsv.onProgressTeam = slaItem.team.name;
        ticketCsv.onProgressAgent = slaItem.agent.name;
        ticketCsv.onProgressCreatedAt = formatReportDateTime(
          slaItem.assignedAt
        );
      }
      if (slaItem.status === 'ESCALATE') {
        ticketCsv.onEscalatedTeam = slaItem.team.name;
        ticketCsv.onEscalatedAgent = slaItem.agent.name;
        ticketCsv.onEscalatedCreatedAt = formatReportDateTime(
          slaItem.assignedAt
        );
      }
      if (slaItem.status === 'FEEDBACK') {
        ticketCsv.onFeedbackTeam = slaItem.team.name;
        ticketCsv.onFeedbackAgent = slaItem.agent.name;
        ticketCsv.onFeedbackCreatedAt = formatReportDateTime(
          slaItem.assignedAt
        );
      }
      if (slaItem.status === 'CLOSED') {
        ticketCsv.onClosedTeam = slaItem.team.name;
        ticketCsv.onClosedAgent = slaItem.agent.name;
        ticketCsv.onClosedCreatedAt = formatReportDateTime(slaItem.assignedAt);
        ticketCsv.rawOnnClosedCreatedAt = slaItem.assignedAt;
      }
    }

    /**
     * Decide lastPerson, lastTeam
     */
    if (ticket.histories[0]) {
      ticketCsv.lastPersonUpdated = ticket.histories[0].user.name;
      ticketCsv.lastTeamUpdated = ticket.histories
        ? ticket.histories[0].user.roles[0].teams[0].name
        : '';
    } else if (ticket.histories.length === 0 && ticket.status === 'CLOSED') {
      ticketCsv.lastPersonUpdated = ticket.reporter ? ticket.reporter.name : '';
      ticketCsv.lastTeamUpdated = ticket.reporter
        ? ticket.reporter.roles[0].teams[0].name
        : '';
    }

    /**
     * Decide aging
     */
    if (ticket.status === 'CLOSED') {
      ticketCsv.aging = formatAsHours(
        diffTicketTimestamp(ticket.incomingAt, ticketCsv.rawOnnClosedCreatedAt)
      );
    } else {
      ticketCsv.aging = formatAsHours(diffTicketTimestamp(ticket.createdAt));
    }

    ticketCsvs.push(ticketCsv);
  }
  return ticketCsvs;
};

/**
 * constructs csv object for comment logs
 * @param tickets list of tickets
 * @return {*[]} csv object with related key prop
 */
export const ticketsToCommentLogCsv = (tickets) => {
  const csv = [];
  tickets.forEach(function (ticket) {
    ticket.comments.forEach(function (comment) {
      let commentCsvRow = {};
      commentCsvRow.createdAt = formatReportDateTime(comment.createdAt);
      commentCsvRow.ticketNumber = ticket.number;
      commentCsvRow.patientID = ticket.patientId;
      commentCsvRow.agent = comment.user.name;
      commentCsvRow.message = removeHtmlTags(comment.message);
      csv.push(commentCsvRow);
    });
  });
  return csv;
};
/**
 * transform tickets object to SLA reports
 * @param tickets all tickets
 * @param teamList teamList
 * @return {*[]} csv array with specified header contains following props
 * {
 *     number: <string>,
 *     patientId: <string>,
 *     team: {
 *         name: <string>
 *     },
 *     agent: {
 *         name: <string>
 *     },
 *     status: <string>,
 *     assignedAt: <string> with format MM/DD/YYYY HH:mm:ss timezone Asia/Jakarta
 * }
 */
export const ticketsToSLA = (tickets, teamList) => {
  let csv = [];
  const respectedChangedColumns = ['TEAM', 'AGENT', 'STATUS'];

  tickets.forEach(function (ticket) {
    let slaItems = [];
    const histories = ticket.histories;
    let slaItem = {
      number: ticket.number,
      patientId: ticket.patientId,
      team: ticket.team,
      agent: ticket.agent,
      status: ticket.status,
      assignedAt: ticket.updatedAt,
    };

    slaItems.push(slaItem);

    const historiesByCreatedAt = _.groupBy(histories, function (history) {
      return moment(
        formatReportDateTime(history.createdAt),
        'MM/DD/YYYY HH:mm:ss'
      ).valueOf();
    });
    const descSortedTimestamps = _.keys(historiesByCreatedAt).sort().reverse();
    const ascSortedTimestamps = _.keys(historiesByCreatedAt).sort();

    let descHistories = [];
    descSortedTimestamps.forEach(function (key) {
      descHistories.push(historiesByCreatedAt[key]);
    });
    let ascHistories = [];
    ascSortedTimestamps.forEach(function (key) {
      ascHistories.push(historiesByCreatedAt[key]);
    });

    const ascChanges = ascHistories.map(function (item) {
      return {
        columns: item.map(function (v) {
          return v.changedColumn;
        }),
        timestamp: item[0].createdAt,
        hasBeenSelected: false,
      };
    });

    descHistories.forEach(function (descHistory) {
      let mutated = _.cloneDeep(slaItem);

      let changedColumns = [];

      descHistory.forEach(function (changes) {
        if (changes.changedColumn === 'STATUS') {
          mutated.status = changes.oldValue;
        } else if (changes.changedColumn === 'TEAM') {
          const targetTeam = filterTeamByID(teamList, changes.oldValue);
          if (!isEmpty(targetTeam)) {
            mutated.team = targetTeam;
          } else {
            mutated.team = {
              name: '',
            };
          }
        } else if (changes.changedColumn === 'AGENT') {
          const selectedTeam = filterTeamsByUser(teamList, changes.oldValue);
          if (!isEmpty(selectedTeam)) {
            const targetTeam = _.first(selectedTeam);
            if (!isEmpty(targetTeam.users)) {
              mutated.agent = targetTeam.users.find(function (user) {
                return user.id === changes.oldValue;
              });
            } else {
              mutated.agent = {
                name: '',
              };
            }
          } else {
            mutated.agent = {
              name: '',
            };
          }
        } else if (changes.changedColumn === 'PATIENT_ID') {
          mutated.patientId = changes.oldValue;
        }
        changedColumns.push(changes.changedColumn);
        mutated.assignedAt = changes.createdAt;
      });
      /**
       * Check if changes include respected changed columns
       */
      const allowed = _.intersection(respectedChangedColumns, changedColumns);
      if (!isEmpty(allowed)) {
        slaItems.push(mutated);
      }
      slaItem = mutated;
    });

    const reversed = slaItems.reverse();
    const slaLength = reversed.length;
    const ascChangesLength = ascChanges.length;
    /**
     * Recalculate assigned timestamp
     */
    for (let i = 0; i < slaLength; i++) {
      if (histories.length === 0 && ticket.status === 'CLOSED') {
        reversed[i].assignedAt = ticket.incomingAt;
      } else if (i - 1 < 0) {
        reversed[i].assignedAt = ticket.createdAt;
      } else {
        /**
         * check what has been changed
         */
        const a = reversed[i - 1];
        const b = reversed[i];

        let hasBeenChanged = [];

        if (a.status !== b.status) {
          hasBeenChanged.push('STATUS');
        }
        if (!_.isEqual(a.team, b.team)) {
          hasBeenChanged.push('TEAM');
        }
        if (!_.isEqual(a.agent, b.agent)) {
          hasBeenChanged.push('AGENT');
        }

        /**
         * Traverse for each of ascChanges
         */
        for (let k = 0; k < ascChangesLength; k++) {
          let item = ascChanges[k];
          if (histories.length === 0 && ticket.status === 'CLOSED') {
            reversed[i].assignedAt = ticket.incomingAt;
          } else if (
            !item.hasBeenSelected &&
            isEmpty(_.difference(item.columns, hasBeenChanged))
          ) {
            reversed[i].assignedAt = item.timestamp;
            item.hasBeenSelected = true;
            break;
          }
        }
      }
    }

    /**
     * Calculate SLA aging
     */

    /**
     * Calculate aging
     * there are two formulas
     * 1. if element length is one
     * aging is calculate using this formula: now - assignedAt
     * 2. if element length > 1
     * we do pair difference. i.e. assignedAt[i+1] - assignedAt[i-1]
     */
    for (let i = 0; i < slaLength; i++) {
      if (histories.length === 0 && ticket.status === 'CLOSED') {
        reversed[i].aging = '0';
      } else if (i + 1 < slaLength) {
        reversed[i].aging = formatAsHours(
          diffTicketTimestamp(
            reversed[i].assignedAt,
            reversed[i + 1].assignedAt
          )
        );
      } else {
        reversed[i].aging = formatAsHours(
          diffTicketTimestamp(reversed[i].assignedAt)
        );
      }
      reversed[i].assignedAt = formatReportDateTime(reversed[i].assignedAt);
    }

    csv.push(...reversed);
  });
  return csv;
};

/**
 * Construct ticket SLA object of a ticket
 * @param ticket
 * {
 *     histories:[
 *         {
 *
 *         }
 *     ]
 * }
 * @param teamList
 * @param respectedChangedColumns, what changes need to be recorded
 * @return {*[]}
 * [
 * {
 *    number: ?
 *    patientId: ?,
 *    team: ?,
 *    agent: ?,
 *    status: ?,
 *    assignedAt: ?
 * }
 * ]
 *
 */
const getTicketSLA = (
  ticket,
  teamList,
  respectedChangedColumns = ['TEAM', 'AGENT', 'STATUS']
) => {
  let slaItems = [];
  const histories = ticket.histories;
  let slaItem = {
    number: ticket.number,
    patientId: ticket.patientId,
    team: ticket.team,
    agent: ticket.agent,
    status: ticket.status,
    assignedAt: ticket.updatedAt,
  };

  if (isEmpty(slaItem.agent)) {
    slaItem.agent = {
      name: '',
    };
  }
  if (isEmpty(slaItem.team)) {
    slaItem.team = {
      name: '',
    };
  }

  slaItems.push(slaItem);

  const historiesByCreatedAt = _.groupBy(histories, function (history) {
    return moment(
      formatReportDateTime(history.createdAt),
      'MM/DD/YYYY HH:mm:ss'
    ).valueOf();
  });

  const descSortedTimestamps = _.keys(historiesByCreatedAt).sort().reverse();
  const ascSortedTimestamps = _.keys(historiesByCreatedAt).sort();

  let descHistories = [];
  descSortedTimestamps.forEach(function (key) {
    descHistories.push(historiesByCreatedAt[key]);
  });
  let ascHistories = [];
  ascSortedTimestamps.forEach(function (key) {
    ascHistories.push(historiesByCreatedAt[key]);
  });

  const ascChanges = ascHistories.map(function (item) {
    return {
      columns: item.map(function (v) {
        return v.changedColumn;
      }),
      timestamp: item[0].createdAt,
      hasBeenSelected: false,
    };
  });

  descHistories.forEach(function (descHistory) {
    let mutated = _.cloneDeep(slaItem);

    let changedColumns = [];

    descHistory.forEach(function (changes) {
      if (changes.changedColumn === 'STATUS') {
        mutated.status = changes.oldValue;
      } else if (changes.changedColumn === 'TEAM') {
        const targetTeam = filterTeamByID(teamList, changes.oldValue);
        if (!isEmpty(targetTeam)) {
          mutated.team = targetTeam;
        } else {
          mutated.team = {
            name: '',
          };
        }
      } else if (changes.changedColumn === 'AGENT') {
        const selectedTeam = filterTeamsByUser(teamList, changes.oldValue);
        if (!isEmpty(selectedTeam)) {
          const targetTeam = _.first(selectedTeam);
          if (!isEmpty(targetTeam.users)) {
            mutated.agent = targetTeam.users.find(function (user) {
              return user.id === changes.oldValue;
            });
          } else {
            mutated.agent = {
              name: '',
            };
          }
        } else {
          mutated.agent = {
            name: '',
          };
        }
      } else if (changes.changedColumn === 'PATIENT_ID') {
        mutated.patientId = changes.oldValue;
      }
      changedColumns.push(changes.changedColumn);
      mutated.assignedAt = changes.createdAt;
    });
    /**
     * Check if changes include respected changed columns
     */
    const allowed = _.intersection(respectedChangedColumns, changedColumns);
    if (!isEmpty(allowed)) {
      slaItems.push(mutated);
    }
    slaItem = mutated;
  });

  const reversed = slaItems.reverse();
  const slaLength = reversed.length;
  const ascChangesLength = ascChanges.length;
  /**
   * Recalculate assigned timestamp
   */
  for (let i = 0; i < slaLength; i++) {
    if (histories.length === 0 && ticket.status === 'CLOSED') {
      reversed[i].assignedAt = ticket.incomingAt;
    } else if (i - 1 < 0) {
      reversed[i].assignedAt = ticket.createdAt;
    } else {
      /**
       * check what has been changed
       */
      const a = reversed[i - 1];
      const b = reversed[i];

      let hasBeenChanged = [];

      if (a.status !== b.status) {
        hasBeenChanged.push('STATUS');
      }
      if (!_.isEqual(a.team, b.team)) {
        hasBeenChanged.push('TEAM');
      }
      if (!_.isEqual(a.agent, b.agent)) {
        hasBeenChanged.push('AGENT');
      }

      /**
       * Traverse for each of ascChanges
       */
      for (let k = 0; k < ascChangesLength; k++) {
        let item = ascChanges[k];
        if (histories.length === 0 && ticket.status === 'CLOSED') {
          reversed[i].assignedAt = ticket.incomingAt;
        } else if (
          !item.hasBeenSelected &&
          isEmpty(_.difference(item.columns, hasBeenChanged))
        ) {
          reversed[i].assignedAt = item.timestamp;
          item.hasBeenSelected = true;
          break;
        }
      }
    }
  }
  return slaItems;
};
