import { lazy } from "react";
import { HomeOutlined, DiffOutlined, EditOutlined } from "@ant-design/icons";

const Home = lazy(() => import("@/pages/Home"));
const Article = lazy(() => import("@/pages/Article"));
const Publish = lazy(() => import("@/pages/Publish"));
export const menuItems = [
  {
    path: "/home",
    element: <Home />,
    key: "/home",
    icon: <HomeOutlined />,
    label: "数据概览",
  },
  {
    path: "/article",
    element: <Article />,
    key: "/article",
    icon: <DiffOutlined />,
    label: "内容管理",
  },
  {
    path: "/publish",
    element: <Publish />,
    key: "/publish",
    icon: <EditOutlined />,
    label: "发布文章",
  },
];

const layoutRoutes = menuItems.map(({ path, element }) => ({ path, element }));

export default layoutRoutes;
