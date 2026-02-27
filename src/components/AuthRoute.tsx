import { getToken } from "@/utils";
import { Navigate } from "react-router-dom";

function AuthRoute({ children }: { children: React.ReactNode }) {
  const token = getToken();
  if (!token) {
    // 没有token，重定向到登录页
    return <Navigate to={"/login"} replace />;
  }
  return <>{children}</>;
}
export default AuthRoute;
