// 处理token的模块
export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken(): string {
  return localStorage.getItem("token") || "";
}

export function removeToken() {
  localStorage.removeItem("token");
}
