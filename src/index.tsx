import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "normalize.css";
import "./index.scss";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Provider } from "react-redux";
import { store } from "./store";
import { Spin } from "antd";

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root container "#root" not found');
}

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* 🔥 包裹 Suspense 处理懒加载，设置加载占位符 */}
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              backgroundColor: "#f5f5f5",
            }}
          >
            <Spin size="large" tip="系统加载中..." />
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  </React.StrictMode>,
);
