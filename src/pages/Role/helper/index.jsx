import { isEmpty } from 'lodash';

export const userManagementOptions = [
  { label: 'Create', value: 3 },
  { label: 'Show List', value: 2 },
  { label: 'Edit', value: 4 },
  { label: 'Delete', value: 5 },
];

export const roleManagementOptions = [
  { label: 'Create', value: 7 },
  { label: 'Show List', value: 6 },
  { label: 'Edit', value: 8 },
  { label: 'Delete', value: 9 },
];

export const teamManagementOptions = [
  { label: 'Create', value: 11 },
  { label: 'Show List', value: 10 },
  { label: 'Edit', value: 12 },
  { label: 'Delete', value: 13 },
];

export const ticketOptions = [
  { label: 'New Ticket', value: 15, determinatePropKey: 'new_ticket' },
  { label: 'Edit Ticket', value: 16, determinatePropKey: 'edit_ticket' },
  { label: 'Delete Ticket', value: 17, determinatePropKey: 'delete_ticket' },
  {
    label: 'View All Tickets',
    value: 14,
    determinatePropKey: 'view_all_tickets',
  },
  {
    label: 'Download Ticket',
    value: 36,
    determinatePropKey: 'download_ticket',
  },
  { label: 'View Comments', value: 18, determinatePropKey: 'view_comments' },
  {
    label: 'Add New Comment',
    value: 19,
    determinatePropKey: 'add_new_comment',
  },
  { label: 'Edit Comment', value: 20, determinatePropKey: 'edit_comment' },
  { label: 'Delete Comment', value: 21, determinatePropKey: 'delete_comment' },
  { label: 'Restore Ticket', value: 37, determinatePropKey: 'restore_ticket' },
];

export const ticketColumnOptions = [
  { label: 'Open Column', value: 29 },
  { label: 'Escalate Column', value: 31 },
  { label: 'On Progress Column', value: 30 },
  { label: 'Feedback Column', value: 32 },
  { label: 'Follow Up Column', value: 33 },
  //   { label: 'Closed Column', value: 34 },
];

export const RecentClosedTicketPageOptions = [
  { label: 'View Page', value: 34 },
];

export const SearchInActiveTicketOptions = [{ label: 'View Page', value: 35 }];

export const TicketCategoriesManagementOptions = [
  { label: 'Create', value: 39 },
  { label: 'Show List', value: 40 },
];

export const joinAllOptions = [
  { label: 'Dashboard', value: 1 },
  ...userManagementOptions,
  ...roleManagementOptions,
  ...teamManagementOptions,
  ...ticketOptions,
  ...ticketColumnOptions,
  ...RecentClosedTicketPageOptions,
  ...SearchInActiveTicketOptions,
  ...TicketCategoriesManagementOptions
];

export const getValueJoinAllOptions = joinAllOptions.map((value) => {
  return value.value;
});

export const initialSelectValueRoleTeam = (role) => {
  return !isEmpty(role) && !isEmpty(role.teams) ? String(role.teams[0].id) : '';
};
