import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchUserInfo } from "@/store/modules/user";

const Layout = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);
  return <div>this is Layout</div>;
};
export default Layout;
