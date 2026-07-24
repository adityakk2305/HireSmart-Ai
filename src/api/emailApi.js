import api from "./axiosInstance.js";

export const getEmailSummaryRequest = async () => {
  const { data } = await api.get("/emails/summary");
  return data.data;
};

export const getEmailLogsRequest = async (params) => {
  const { data } = await api.get("/emails/logs", { params });
  return data.data;
};

export const getEmailLogByIdRequest = async (id) => {
  const { data } = await api.get(`/emails/logs/${id}`);
  return data.data.log;
};

export const retryEmailRequest = async (id) => {
  const { data } = await api.post(`/emails/logs/${id}/retry`);
  return data.data.log;
};

export const cancelEmailRequest = async (id) => {
  const { data } = await api.post(`/emails/logs/${id}/cancel`);
  return data.data.log;
};

export const getEmailSettingsRequest = async () => {
  const { data } = await api.get("/emails/settings");
  return data.data;
};

export const updateEmailSettingsRequest = async (payload) => {
  const { data } = await api.put("/emails/settings", payload);
  return data.data;
};

export const verifyEmailConfigRequest = async () => {
  const { data } = await api.post("/emails/verify");
  return data.data;
};

export const sendTestEmailRequest = async (payload) => {
  const { data } = await api.post("/emails/test", payload);
  return data.data;
};

export const sendManualCandidateEmailRequest = async (payload) => {
  const { data } = await api.post("/emails/manual-candidate", payload);
  return data.data;
};

export const sendBulkCandidateEmailsRequest = async (payload) => {
  const { data } = await api.post("/emails/bulk-candidates", payload);
  return data.data;
};

export const sendCandidateStatusEmailRequest = async (candidateId, payload) => {
  const { data } = await api.post(`/emails/candidates/${candidateId}/status-email`, payload);
  return data.data;
};

export const sendInterviewInvitationRequest = async (interviewId, payload = {}) => {
  const { data } = await api.post(`/emails/interviews/${interviewId}/invitation`, payload);
  return data.data;
};

export const sendInterviewReminderRequest = async (interviewId, payload = {}) => {
  const { data } = await api.post(`/emails/interviews/${interviewId}/reminder`, payload);
  return data.data;
};

export const sendInterviewRescheduledRequest = async (interviewId, payload = {}) => {
  const { data } = await api.post(`/emails/interviews/${interviewId}/rescheduled`, payload);
  return data.data;
};

export const sendInterviewCancelledRequest = async (interviewId, payload = {}) => {
  const { data } = await api.post(`/emails/interviews/${interviewId}/cancelled`, payload);
  return data.data;
};

export const getEmailTemplatesRequest = async (params = {}) => {
  const { data } = await api.get("/email-templates", { params });
  return data.data.templates;
};

export const getEmailTemplateByIdRequest = async (id) => {
  const { data } = await api.get(`/email-templates/${id}`);
  return data.data.template;
};

export const createEmailTemplateRequest = async (payload) => {
  const { data } = await api.post("/email-templates", payload);
  return data.data.template;
};

export const updateEmailTemplateRequest = async (id, payload) => {
  const { data } = await api.put(`/email-templates/${id}`, payload);
  return data.data.template;
};

export const duplicateEmailTemplateRequest = async (id) => {
  const { data } = await api.post(`/email-templates/${id}/duplicate`);
  return data.data.template;
};

export const resetEmailTemplateRequest = async (id) => {
  const { data } = await api.post(`/email-templates/${id}/reset`);
  return data.data.template;
};

export const deleteEmailTemplateRequest = async (id) => {
  const { data } = await api.delete(`/email-templates/${id}`);
  return data.data;
};

export const previewEmailTemplateRequest = async (payload) => {
  const { data } = await api.post("/email-templates/preview", payload);
  return data.data.preview;
};
