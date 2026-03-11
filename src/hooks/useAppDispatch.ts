import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";

// 自定义 hook，返回带精确类型的 dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
