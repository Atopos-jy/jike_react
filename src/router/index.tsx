import Layout from "@/pages/Layout";
import Login from "@/pages/Login";

import { createBrowserRouter } from "react-router-dom";
import AuthRoute from "@/components/AuthRoute";
import layoutRoutes from "./layoutRoutes";

//配置路由

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthRoute>
        <Layout />
      </AuthRoute>
    ),
    children: layoutRoutes,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
