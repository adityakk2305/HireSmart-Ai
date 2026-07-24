import api from "./axiosInstance.js";

export const registerUser = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data.data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data.data;
};

export const logoutUser = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

export const refreshAccessToken = async () => {
  const { data } = await api.post("/auth/refresh-token", undefined, { skipAuthRefresh: true });
  return data.data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get("/auth/me");
  return data.data;
};

export const forgotPassword = async (payload) => {
  const { data } = await api.post("/auth/forgot-password", payload);
  return data.data;
};

export const resetPassword = async (token, payload) => {
  const { data } = await api.post(`/auth/reset-password/${token}`, payload);
  return data;
};
