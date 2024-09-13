import {
  Avatar,
  Badge,
  Breadcrumb,
  Dropdown,
  Input,
  Layout,
  Menu,
  theme,
} from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { path } from '../../common/path';
import { useDispatch, useSelector } from 'react-redux';
import './HomeTemplate.scss';

const userMenu = {
  items: [
    {
      key: 'dashboard',
      label: <Link to={path.home}>Dashboard</Link>,
      icon: <i className="fa-brands fa-aws"></i>,
    },
    {
      key: 'lockScreen',
      label: <Link to="/lock-screen">Lock Screen</Link>,
      icon: <i className="fa-solid fa-lock"></i>,
    },
    {
      key: 'profile',
      label: <Link to="/profile">Profile</Link>,
      icon: <i className="fa-solid fa-user"></i>,
    },
    {
      key: 'logout',
      label: <Link to="/logout">Logout</Link>,
      icon: <i className="fa-solid fa-right-from-bracket"></i>,
    },
  ],
};
// CRM là Quản lý quan hệ khách hàng hay CRM là một phương pháp giúp các doanh nghiệp tiếp cận và giao tiếp với khách hàng một cách có hệ thống và hiệu quả, quản lý các thông tin của khách hàng như thông tin về tài khoản, nhu cầu, liên lạc và các vấn đề khác nhằm phục vụ khách hàng tốt hơn.
const arrMenu = [
  {
    key: 'dashBoard',
    type: 'group',
    children: [
      {
        key: 'dashboard',
        label: <Link to={path.home}>Dashboard</Link>,
        icon: <i className="fa-solid fa-house"></i>,
      },
    ],
  },
  {
    key: 'taskManager',
    type: 'group',
    label: 'Task Manager',
    children: [
      {
        key: 'taskManager',
        label: <Link to={path.taskManager}>Task Manager</Link>,
        icon: <i className="fa-solid fa-tasks"></i>,
      },
    ],
  },
];

const HomeTemplate = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const isLoading = useSelector((state) => state.loadingSlice.isLoading);
  const dispatch = useDispatch();

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Sider */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          height: '100vh',
          overflow: 'auto',
          backgroundColor: '#232F3E',
        }}
      >
        <div className="demo-logo-verticals">
          <Link to={path.homepage}>
            <i className="fa-brands fa-aws"></i>
          </Link>
        </div>
        <Menu theme="dark" mode="inline" items={arrMenu} />
      </Sider>

      {/* Main Layout */}
      <Layout style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Header
          style={{
            backgroundColor: 'white',
            padding: '0 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            height: '64px',
          }}
        >
          {/* Search Bar */}
          <Input
            placeholder="Search..."
            style={{ width: 300, height: 40 }}
            suffix={
              <i
                className="fa-solid fa-magnifying-glass"
                style={{ color: 'rgba(0,0,0,.45)' }}
              ></i>
            }
          />

          {/* Right Side User Profile */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Notification Icon with Badge */}
            <Badge
              size="medium"
              count={9}
              style={{ marginRight: 19 }}
              offset={[-7, 5]}
            >
              <i className="fa-regular fa-bell text-[17px] bell-icon"></i>
            </Badge>

            {/* Chat Icon with Badge */}
            <Badge
              size="medium"
              count={5}
              style={{ marginRight: 19 }}
              offset={[-7, 5]}
            >
              <i className="fa-regular fa-message text-[16px] bell-icon"></i>
            </Badge>

            {/* User Dropdown Menu */}
            <Dropdown menu={userMenu} placement="bottomRight">
              <div
                className="user-info"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                {/* Avatar with Custom Badge */}
                <Avatar
                  size={36}
                  shape="square"
                  src="https://randomuser.me/api/portraits/men/25.jpg"
                  style={{ borderRadius: '10px' }}
                />

                {/* Custom Badge for Online Status */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    background: '#52c41a', // Green color for online status
                    width: '13px',
                    height: '13px',
                    borderRadius: '50%',
                    border: '2px solid white',
                  }}
                ></span>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content style={{ padding: '16px', flex: 1, overflow: 'auto' }}>
          <Breadcrumb style={{ margin: '4px 0 18px 0' }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: 'center' }}>
          AWS Manager ©{new Date().getFullYear()} Created by AWS
        </Footer>
      </Layout>
    </Layout>
  );
};

export default HomeTemplate;
