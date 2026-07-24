import api from "./axiosInstance.js";

export const getInterviewsRequest = async (params) => {
  const { data } = await api.get("/interviews", { params });
  return data.data;
};

export const getInterviewByIdRequest = async (id) => {
  const { data } = await api.get(`/interviews/${id}`);
  return data.data.interview;
};

export const createInterviewRequest = async (payload) => {
  const { data } = await api.post("/interviews", payload);
  return data.data.interview;
};

export const updateInterviewRequest = async (id, payload) => {
  const { data } = await api.put(`/interviews/${id}`, payload);
  return data.data.interview;
};

export const rescheduleInterviewRequest = async (id, payload) => {
  const { data } = await api.patch(`/interviews/${id}/reschedule`, payload);
  return data.data.interview;
};

export const cancelInterviewRequest = async (id, reason) => {
  const { data } = await api.patch(`/interviews/${id}/cancel`, { reason });
  return data.data.interview;
};

export const changeInterviewStatusRequest = async (id, status) => {
  const { data } = await api.patch(`/interviews/${id}/status`, { status });
  return data.data.interview;
};

export const completeInterviewRequest = async (id) => {
  const { data } = await api.patch(`/interviews/${id}/complete`);
  return data.data.interview;
};

export const getCandidateInterviewsRequest = async (candidateId) => {
  const { data } = await api.get(`/interviews/candidate/${candidateId}`);
  return data.data;
};

export const getInterviewSummaryRequest = async () => {
  const { data } = await api.get("/interviews/summary");
  return data.data;
};

export const getUpcomingInterviewsRequest = async (params = {}) => {
  const { data } = await api.get("/interviews/upcoming", { params });
  return data.data;
};

export const getTodayInterviewsRequest = async (params = {}) => {
  const { data } = await api.get("/interviews/today", { params });
  return data.data;
};

export const submitInterviewFeedbackRequest = async (id, payload) => {
  const { data } = await api.post(`/interviews/${id}/feedback`, payload);
  return data.data.interview;
};

export const editInterviewFeedbackRequest = async (id, feedbackId, payload) => {
  const { data } = await api.put(`/interviews/${id}/feedback/${feedbackId}`, payload);
  return data.data.interview;
};

export const generateQuestionsRequest = async (id, payload) => {
  const { data } = await api.post(`/interviews/${id}/generate-questions`, payload);
  return data.data;
};
