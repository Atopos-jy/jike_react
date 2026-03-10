import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Popconfirm, type MenuProps } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import "./index.scss";
import { menuItems } from "@/router/layoutRoutes";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useEffect } from "react";
import { fetchUserInfo } from "@/store/modules/user";
const { Header, Sider } = Layout;

const items: MenuProps["items"] = menuItems.map((item) => ({
  key: item.key,
  icon: item.icon,
  label: item.label,
}));

const GeekLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = location.pathname;

  const dispath = useAppDispatch();
  useEffect(() => {
    dispath(fetchUserInfo());
  }, [dispath]);
  const onMenuClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">user.name</span>
          <span className="user-logout">
            <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消">
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[selectedKey]}
            style={{ height: "100%", borderRight: 0 }}
            items={items}
            onClick={onMenuClick}
          />
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default GeekLayout;
