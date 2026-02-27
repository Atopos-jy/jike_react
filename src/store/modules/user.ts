import {
  createSlice,
  type PayloadAction,
  type Dispatch,
} from "@reduxjs/toolkit";
import { request } from "@/utils";
import type { ApiResponse } from "@/utils/request";
import { setToken as _setToken, getToken } from "@/utils/token";
/** 登录表单参数类型 */
interface LoginForm {
  mobile: string;
  code: string;
}

/** 登录接口返回的 data 类型 */
interface LoginResponseData {
  token: string;
}
const userStore = createSlice({
  name: "user",
  // 数据状态
  initialState: {
    token: getToken(),
  },
  //同步修改方法
  reducers: {
    setToken(state, actions: PayloadAction<string>) {
      state.token = actions.payload;
      _setToken(actions.payload);
    },
  },
});

//解构出actionCreater
const { setToken } = userStore.actions;

//获取reducer函数
const userReducer = userStore.reducer;

//异步方法
const fetchLogin = (loginForm: LoginForm) => {
  return async (dispatch: Dispatch) => {
    //发送请求
    const res = await request.post<ApiResponse<LoginResponseData>>(
      "/authorizations",
      loginForm,
    );
    console.log(res);

    //提交同步action进行token传入
    dispatch(setToken(res.data.data.token));
  };
};
export { setToken, fetchLogin };
export default userReducer;
