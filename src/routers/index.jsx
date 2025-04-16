import Dashboard from "pages/Dashboard";
import { RoleList } from "pages/Role";
import { EditTeam } from "pages/Team/EditDetail";
import { TeamList } from "pages/Team";
import { EditInfoDetail } from "pages/ticket/EditInfoDetail";
import { EditTicket } from "pages/ticket/EditTicket";
import { TicketList } from "pages/ticket/TicketLists";
import { TicketTable } from "pages/ticket/TicketTables";
import { UserManagementList } from "pages/UserManagement";
import { EditUserManagement } from "pages/UserManagement/EditDetail";
import { EditRole } from "pages/Role/EditDetail";

const routersApp = [
  {
    exact: true,
    path: "/",
  },
  {
    exact: true,
    path: "/dashboard",
    component: Dashboard,
  },
  {
    exact: true,
    path: "/user-management",
    component: UserManagementList,
  },
  {
    exact: true,
    path: "/user-management/:id",
    component: EditUserManagement,
  },
  {
    exact: true,
    path: "/role",
    component: RoleList,
  },
  {
    exact: true,
    path: "/role/:id",
    component: EditRole,
  },
  {
    exact: true,
    path: "/team",
    component: TeamList,
  },
  {
    exact: true,
    path: "/team/:id",
    component: EditTeam,
  },
  {
    exact: true,
    path: "/all-tickets",
    component: TicketList,
  },
  {
    exact: true,
    path: "/my-tickets",
    component: TicketList,
  },
  {
    exact: true,
    path: "/edit-ticket/:id",
    component: EditTicket,
  },
  {
    exact: true,
    path: "/edit-info-ticket/:id",
    component: EditInfoDetail,
  },
  {
    exact: true,
    path: "/recent-closed-tickets",
    component: TicketTable,
  },
  {
    exact: true,
    path: "/recent-closed-tickets/:id",
    component: EditTicket,
  },
  {
    exact: true,
    path: "/search-inactive-tickets",
    component: EditInfoDetail,
  },
  {
    exact: true,
    path: "/search-inactive-tickets/:id",
    component: EditTicket,
  },
];

export { routersApp };
