import api from "./axiosInstance.js";

export const createCompanyRequest = async (payload) => {
  const { data } = await api.post("/companies", payload);
  return data.data;
};

export const getMyCompanyRequest = async () => {
  const { data } = await api.get("/companies/me");
  return data.data;
};

export const updateCompanyRequest = async (payload) => {
  const { data } = await api.put("/companies/me", payload);
  return data.data;
};

export const getCompanyOnboardingStatusRequest = async () => {
  const { data } = await api.get("/companies/onboarding-status");
  return data.data;
};

export const uploadCompanyLogoRequest = async (file) => {
  const formData = new FormData();
  formData.append("logo", file);
  const { data } = await api.post("/companies/logo", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data.data;
};
