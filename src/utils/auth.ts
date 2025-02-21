import { AuthResponse } from "../types";

export const setAuthData = (data: AuthResponse) => {
  const expiryTime = Date.now() + 60 * 60 * 1000;
  localStorage.setItem("token", data.token);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("tokenExpiry", expiryTime.toString());
};

export const removeAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("refreshToken");
};