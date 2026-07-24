import api from "./axiosInstance.js";

const params = (value = {}) => ({ params: value });
const dataOf = (response) => response.data.data;

export const getAnalyticsSummaryRequest = (query) => api.get("/analytics/summary", params(query)).then(dataOf);
export const getAnalyticsOverviewRequest = (query) => api.get("/analytics/overview", params(query)).then(dataOf);
export const getHiringFunnelRequest = (query) => api.get("/analytics/hiring-funnel", params(query)).then(dataOf);
export const getCandidateAnalyticsRequest = (query) => api.get("/analytics/candidates", params(query)).then(dataOf);
export const getCandidateSourcesRequest = (query) => api.get("/analytics/candidate-sources", params(query)).then(dataOf);
export const getAiScreeningAnalyticsRequest = (query) => api.get("/analytics/ai-screening", params(query)).then(dataOf);
export const getSkillAnalyticsRequest = (query) => api.get("/analytics/skills", params(query)).then(dataOf);
export const getJobAnalyticsRequest = (query) => api.get("/analytics/jobs", params(query)).then(dataOf);
export const getJobAnalyticsDetailsRequest = (jobId, query) => api.get(`/analytics/jobs/${jobId}`, params(query)).then(dataOf);
export const getInterviewAnalyticsRequest = (query) => api.get("/analytics/interviews", params(query)).then(dataOf);
export const getInterviewerAnalyticsRequest = (query) => api.get("/analytics/interviewers", params(query)).then(dataOf);
export const getEmailAnalyticsRequest = (query) => api.get("/analytics/emails", params(query)).then(dataOf);
export const getRecruiterAnalyticsRequest = (query) => api.get("/analytics/recruiters", params(query)).then(dataOf);

export const exportAnalyticsRequest = async (query) => {
  const response = await api.get("/analytics/export", {
    params: query,
    responseType: query?.format === "json" ? "json" : "blob"
  });
  return response;
};
