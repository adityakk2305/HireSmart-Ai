import api from "./axiosInstance.js";

export const applyToJobRequest = async (jobSlug, formData) => {
  const { data } = await api.post(`/candidates/apply/${jobSlug}`, formData, {
    skipAuthRefresh: true
  });
  return data.data;
};

export const uploadCandidateByHRRequest = async (jobId, formData) => {
  const { data } = await api.post(`/candidates/upload/${jobId}`, formData);
  return data.data;
};

export const getCandidatesRequest = async (params) => {
  const { data } = await api.get("/candidates", { params });
  return data.data;
};

export const getCandidatesByJobRequest = async (jobId, params) => {
  const { data } = await api.get(`/candidates/job/${jobId}`, { params });
  return data.data;
};

export const getCandidateByIdRequest = async (id) => {
  const { data } = await api.get(`/candidates/${id}`);
  return data.data;
};

export const updateCandidateRequest = async (id, payload) => {
  const { data } = await api.put(`/candidates/${id}`, payload);
  return data.data;
};

export const updateCandidateStatusRequest = async (id, payload) => {
  const { data } = await api.patch(`/candidates/${id}/status`, payload);
  return data.data;
};

export const deleteCandidateRequest = async (id) => {
  const { data } = await api.delete(`/candidates/${id}`);
  return data.data;
};

export const deleteCandidateWithReasonRequest = async (id, deletionReason = "") => {
  const { data } = await api.delete(`/candidates/${id}`, { data: { deletionReason } });
  return data.data;
};

export const getCandidateStatusHistoryRequest = async (id) => {
  const { data } = await api.get(`/candidates/${id}/status-history`);
  return data.data;
};

export const lookupApplicationStatusRequest = async (params) => {
  const { data } = await api.get("/candidates/status-lookup", {
    params,
    skipAuthRefresh: true
  });
  return data.data;
};

export const getCandidateSummaryRequest = async () => {
  const { data } = await api.get("/candidates/summary");
  return data.data;
};

export const getCandidateAiSummaryRequest = async () => {
  const { data } = await api.get("/candidates/ai-summary");
  return data.data;
};

export const parseCandidateResumeRequest = async (id, force = false) => {
  const { data } = await api.post(`/candidates/${id}/parse-resume`, null, {
    params: { force: force ? "true" : "false" }
  });
  return data.data;
};

export const getCandidateResumeDataRequest = async (id) => {
  const { data } = await api.get(`/candidates/${id}/resume-data`);
  return data.data;
};

export const screenCandidateRequest = async (id, force = false) => {
  const { data } = await api.post(`/candidates/${id}/ai-screen`, null, {
    params: { force: force ? "true" : "false" }
  });
  return data.data;
};

export const getCandidateAiEvaluationRequest = async (id) => {
  const { data } = await api.get(`/candidates/${id}/ai-evaluation`);
  return data.data;
};

export const bulkScreenCandidatesRequest = async (candidateIds, force = false) => {
  const { data } = await api.post("/candidates/bulk-ai-screen", { candidateIds, force });
  return data.data;
};

export const addRecruiterNoteRequest = async (id, payload) => {
  const { data } = await api.post(`/candidates/${id}/notes`, payload);
  return data.data;
};

export const updateRecruiterNoteRequest = async (id, noteId, payload) => {
  const { data } = await api.put(`/candidates/${id}/notes/${noteId}`, payload);
  return data.data;
};

export const deleteRecruiterNoteRequest = async (id, noteId) => {
  const { data } = await api.delete(`/candidates/${id}/notes/${noteId}`);
  return data.data;
};

export const bulkCandidateActionRequest = async (payload) => {
  const { data } = await api.post("/candidates/bulk-actions", payload);
  return data.data;
};

export const compareCandidatesRequest = async (candidateIds) => {
  const { data } = await api.post("/candidates/compare", { candidateIds });
  return data.data;
};

export const exportCandidatesRequest = async (params = {}) => {
  const response = await api.get("/candidates/export", { params, responseType: "blob" });
  return response.data;
};

export const downloadCandidatesCsv = async (params = {}, filename = "hiresmart-candidates.csv") => {
  const blob = await exportCandidatesRequest(params);
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
};

export const getCandidateResumeUrl = (id) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
  return `${baseUrl}/candidates/${id}/resume`;
};

export const openCandidateResume = async (id) => {
  const response = await api.get(`/candidates/${id}/resume`, { responseType: "blob" });
  const blobUrl = URL.createObjectURL(response.data);
  window.open(blobUrl, "_blank", "noopener,noreferrer");
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
};
