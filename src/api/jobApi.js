import api from "./axiosInstance.js";

export const createJobRequest = async (payload) => {
  const { data } = await api.post("/jobs", payload);
  return data.data;
};

export const getJobsRequest = async (params) => {
  const { data } = await api.get("/jobs", { params });
  return data.data;
};

export const getJobByIdRequest = async (id) => {
  const { data } = await api.get(`/jobs/${id}`);
  return data.data;
};

export const getJobSummaryRequest = async () => {
  const { data } = await api.get("/jobs/summary");
  return data.data;
};

export const updateJobRequest = async (id, payload) => {
  const { data } = await api.put(`/jobs/${id}`, payload);
  return data.data;
};

export const deleteJobRequest = async (id) => {
  const { data } = await api.delete(`/jobs/${id}`);
  return data.data;
};

export const changeJobStatusRequest = async (id, status) => {
  const { data } = await api.patch(`/jobs/${id}/status`, { status });
  return data.data;
};

export const getPublicJobBySlugRequest = async (slug) => {
  const { data } = await api.get(`/jobs/public/${slug}`, { skipAuthRefresh: true });
  return data.data;
};
