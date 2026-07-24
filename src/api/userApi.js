import api from "./axiosInstance.js";

export const getProfileRequest = async () => {
  const { data } = await api.get("/users/profile");
  return data.data;
};

export const updateProfileRequest = async (payload) => {
  const { data } = await api.put("/users/profile", payload);
  return data.data;
};

export const changePasswordRequest = async (payload) => {
  const { data } = await api.put("/users/change-password", payload);
  return data;
};

export const uploadProfileImageRequest = async (file) => {
  const formData = new FormData();
  formData.append("profileImage", file);
  const { data } = await api.post("/users/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data.data;
};
