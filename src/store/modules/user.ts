import {
  createSlice,
  type PayloadAction,
  type Dispatch,
} from "@reduxjs/toolkit";
import { setToken as _setToken, getToken } from "@/utils/token";
import { getUserInfo, type UserResponse } from "@/api/user";
import { getLogin, type LoginParams, type LoginData } from "@/api/login";

const userStore = createSlice({
  name: "user",
  // 数据状态
  initialState: {
    token: getToken() || "",
    userInfo: {} as UserResponse,
  },
  // 同步修改方法
  reducers: {
    setToken(state, actions: PayloadAction<string>) {
      state.token = actions.payload;
      _setToken(actions.payload);
    },
    setUserInfo(state, actions: PayloadAction<UserResponse>) {
      state.userInfo = actions.payload;
    },
  },
});

//解构出actionCreater
const { setToken, setUserInfo } = userStore.actions;

//获取reducer函数
const userReducer = userStore.reducer;

//异步方法
const fetchLogin = (loginForm: LoginParams) => {
  return async (dispatch: Dispatch) => {
    //发送请求
    const res = await getLogin(loginForm);
    //提交同步action进行token传入
    dispatch(setToken(res.data.token));
  };
};

// 获取个人用户信息
const fetchUserInfo = () => {
  return async (dispatch: Dispatch) => {
    const res = await getUserInfo();
    dispatch(setUserInfo(res.data));
    return res.data;
  };
};

export { setToken, fetchLogin, fetchUserInfo };
export default userReducer;
