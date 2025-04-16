/* eslint-disable */
import {
  BrowserRouter,
  Route,
  Routes,
  Outlet, Navigate
} from "react-router-dom";
import { Layout } from "antd";
import "rc-color-picker/assets/index.css";

// component
import LoginPage from "pages/Login";
import DashboardList from "pages/Dashboard";
import CSATReportList from "pages/CSAT/CsatReport";
import UserManagementList from "pages/UserManagement";
import EditUserManagement from "pages/UserManagement/EditDetail";
import RoleList from "pages/Role";
import EditRole from "pages/Role/EditDetail";
import TeamList from "pages/Team";
import EditTeam from "pages/Team/EditDetail";
import PatientList from "pages/Patients/PatientList";
import PatientDetail from "pages/Patients/PatientDetail";
import PatientHistory from "pages/Patients/PatientHistory";
import PatientEdit from "pages/Patients/PatientEdit";
import TicketList from "pages/ticket/TicketLists";
import EditTicket from "pages/ticket/EditTicket";
import EditInfoDetail from "pages/ticket/EditInfoDetail";
import SearchInactiveTickets from "pages/ticket/SearchInactiveTickets";
import RecentCloseTickets from "pages/ticket/RecentCloseTickets";
import Sidebar from "components/Sidebar";
import Header from "components/Header";

import "antd/dist/reset.css";
import "./App.scss";
import { useEffect } from "react";
import { useState } from "react";
import CategoriesList from "pages/CategoriesManagement/CategoriesList";

function ContentManagement() {
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("access_token"));
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" /> : <LoginPage />}
      />
      <Route
        element={
          <Layout className="pd-cms">
            <Sidebar />
            <Layout>
              <Header />
              <Outlet />
            </Layout>
          </Layout>
        }
      >
        <Route path="/dashboard" element={<DashboardList />} />
        <Route path="/csat-report" element={<CSATReportList />} />
        <Route path="/user-management" element={<UserManagementList />} />
        <Route path="/user-management/:id" element={<EditUserManagement />} />
        <Route path="/role" element={<RoleList />} />
        <Route path="/role/:id" element={<EditRole />} />
        <Route path="/team" element={<TeamList />} />
        <Route path="/team/:id" element={<EditTeam />} />
        <Route path="/patients" element={<PatientList />} />
        <Route
          path="/patients/detail/:phoneNumber"
          element={<PatientDetail />}
        />
        <Route
          path="/patients/:phoneNumber/history"
          element={<PatientHistory />}
        />
        <Route path="/patients/edit/:phoneNumber" element={<PatientEdit />} />
        <Route path="/all-tickets" element={<TicketList />} />
        <Route path="/my-tickets" element={<TicketList />} />
        <Route path="/edit-ticket/:id" element={<EditTicket />} />
        <Route path="/edit-info-ticket/:id" element={<EditInfoDetail />} />
        <Route path="/recent-closed-tickets" element={<RecentCloseTickets />} />
        <Route path="/recent-closed-tickets/:id" element={<EditTicket />} />
        <Route
          path="/search-inactive-tickets"
          element={<SearchInactiveTickets />}
        />
        <Route path="/search-inactive-tickets/:id" element={<EditTicket />} />
        <Route path="/unassigned-tickets" element={<TicketList />} />
        <Route path="/categories" element={<CategoriesList />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ContentManagement />
    </BrowserRouter>
  );
}

export default App;
