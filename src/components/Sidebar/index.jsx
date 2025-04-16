/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Menu, Layout, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { get } from "lodash";
import { connect } from "react-redux";

import {
  DashboardOutlined,
  TagOutlined,
  CrownOutlined,
  ApartmentOutlined,
  TeamOutlined,
  FundProjectionScreenOutlined,
  MedicineBoxOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import { checkPrivileges } from "../../utils";
import { getUserById } from "store/action/UserAction";
import { toggleSidebar } from "store/action/component-action/ToggleSidebarAction";
import "./style.scss";
// // import { AuthenticationContext } from 'contexts/Authentication';

const { Sider, Header, Content } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;

export const Sidebar = ({ isSidebarClose, userById, getUserById }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  //   // const { handleRefreshToken } = useContext(AuthenticationContext);

  useEffect(() => {
    //Calling redux getUserById for setting privileges
    async function getUserByIdData() {
      try {
        await getUserById(userId);
      } catch (error) {
        if (error.response.status === 401) {
          sessionStorage.clear();
          localStorage.clear();
          window.location.relaod();
          window.location.href = "/";
        }
      }
    }
    getUserByIdData();
  }, [userId]);

  const viewDashboard = checkPrivileges(userById, 1);
  const viewRoleList = checkPrivileges(userById, 6);
  const viewUserList = checkPrivileges(userById, 2);
  const viewTeamList = checkPrivileges(userById, 10);
  const viewTicketCategoryList = checkPrivileges(userById, 39);

  const menuOptions = [
    viewDashboard
      ? {
          type: "Menu",
          name: "Dashboard",
          link: "/dashboard",
          icon: DashboardOutlined,
        }
      : {},
    {
      type: "Menu",
      name: "CSAT Report",
      link: "/csat-report",
      icon: FundProjectionScreenOutlined,
    },
    viewUserList
      ? {
          type: "Menu",
          name: "User Management",
          link: "/user-management",
          icon: ApartmentOutlined,
        }
      : {},
    viewRoleList
      ? {
          type: "Menu",
          name: "Role",
          link: "/role",
          icon: CrownOutlined,
        }
      : {},
    viewTeamList
      ? {
          type: "Menu",
          name: "Team",
          link: "/team",
          icon: TeamOutlined,
        }
      : {},
    {
      type: "Menu",
      name: "Patients",
      link: "/patients",
      icon: MedicineBoxOutlined,
    },
    viewTicketCategoryList
      ? {
          type: "Menu",
          name: "Ticket Categories",
          link: "/categories",
          icon: SettingOutlined,
        }
      : {},
    {
      type: "SubMenu",
      name: "Tickets",
      icon: TagOutlined,
      children: [
        {
          type: "Menu-Submenu",
          name: "All Tickets",
          link: "/all-tickets",
          granted: checkPrivileges(userById, 14),
        },
        { type: "Menu-Submenu", name: "My Tickets", link: "/my-tickets" },
        {
          type: "Menu-Submenu",
          name: "Recent Closed Tickets",
          link: "/recent-closed-tickets",
        },
        {
          type: "Menu-Submenu",
          name: "Search Inactive Tickets",
          link: "/search-inactive-tickets",
        },
        {
          type: "Menu-Submenu",
          name: "Unassigned Tickets",
          link: "/unassigned-tickets",
        },
      ],
    },
  ];

  let filteredMenuOptions = menuOptions.filter(
    (value) => Object.keys(value).length !== 0
  );

  const renderMenu = (opt) => {
    const {
      name = "",
      link = "",
      type = "Menu",
      children = [],
      icon = "",
    } = opt;
    if (type === "Menu") {
      return (
        <Menu.Item
          key={link}
          className={`${isSidebarClose ? "" : "d-flex align-items-center"} `}
          icon={React.createElement(icon)}
        >
          <Link to={link}>{name}</Link>
        </Menu.Item>
      );
    } else if (type === "Menu-Submenu") {
      return (
        <Menu.Item
          key={link}
          className={`${isSidebarClose ? "" : "d-flex align-items-center"} `}
        >
          <Link to={link}>{name}</Link>
        </Menu.Item>
      );
    } else {
      return (
        <SubMenu key={name} icon={React.createElement(icon)} title={name}>
          {children.map((opt) => {
            if (!opt.hasOwnProperty("granted") || opt.granted) {
              return renderMenu(opt);
            }
            return undefined;
          })}
        </SubMenu>
      );
    }
  };

  const currentPath = get(location, "pathname");

  return (
    <Sider
      style={{
        backgroundColor: "#f2f5f7",
      }}
      collapsed={isSidebarClose}
      className="pd-cms-sidebar"
      width={220}
    >
      <Title level={3}>
        <Link to={"/"}>
          <div className="logo-container">
            <img
              src={`/img/logo/logo-red.png`}
              alt="Rata"
              style={{ width: isSidebarClose ? "50%" : "80%" }}
            />
          </div>
        </Link>
      </Title>
      <Menu
        mode="inline"
        collapsed={isSidebarClose}
        defaultSelectedKeys={[currentPath]}
        selectedKeys={[currentPath]}
        defaultOpenKeys={[
          get(
            filteredMenuOptions.find(
              (menu) =>
                menu.type === "SubMenu" &&
                get(menu, "children", []).find(
                  (child) => child.link === currentPath
                )
            ),
            "name"
          ),
        ]}
      >
        {filteredMenuOptions.map((opt) => renderMenu(opt))}
      </Menu>
    </Sider>
  );
};

const mapStateToProps = ({ isSidebarClose, userById }) => ({
  isSidebarClose,
  userById,
});

export default connect(mapStateToProps, { toggleSidebar, getUserById })(
  Sidebar
);
