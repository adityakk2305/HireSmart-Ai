import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  cancelEmailRequest,
  createEmailTemplateRequest,
  deleteEmailTemplateRequest,
  duplicateEmailTemplateRequest,
  getEmailLogByIdRequest,
  getEmailLogsRequest,
  getEmailSettingsRequest,
  getEmailSummaryRequest,
  getEmailTemplateByIdRequest,
  getEmailTemplatesRequest,
  previewEmailTemplateRequest,
  resetEmailTemplateRequest,
  retryEmailRequest,
  sendBulkCandidateEmailsRequest,
  sendCandidateStatusEmailRequest,
  sendInterviewCancelledRequest,
  sendInterviewInvitationRequest,
  sendInterviewReminderRequest,
  sendInterviewRescheduledRequest,
  sendManualCandidateEmailRequest,
  sendTestEmailRequest,
  updateEmailSettingsRequest,
  updateEmailTemplateRequest,
  verifyEmailConfigRequest
} from "../../api/emailApi.js";
import { DEFAULT_EMAIL_LOG_FILTERS } from "../../utils/emailConstants.js";

const getErrorMessage = (error) => error.response?.data?.message || error.message || "Email request failed";

const initialState = {
  summary: null,
  logs: [],
  selectedLog: null,
  templates: [],
  selectedTemplate: null,
  preview: null,
  settings: null,
  providerStatus: null,
  pagination: { page: 1, limit: 10, total: 0, pages: 1, hasNextPage: false, hasPreviousPage: false },
  filters: DEFAULT_EMAIL_LOG_FILTERS,
  loading: false,
  detailsLoading: false,
  templatesLoading: false,
  saving: false,
  sending: false,
  error: null
};

export const fetchEmailSummary = createAsyncThunk("emails/fetchSummary", async (_, { rejectWithValue }) => {
  try { return await getEmailSummaryRequest(); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const fetchEmailLogs = createAsyncThunk("emails/fetchLogs", async (filters, { rejectWithValue }) => {
  try { return await getEmailLogsRequest(filters); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const fetchEmailLogById = createAsyncThunk("emails/fetchLog", async (id, { rejectWithValue }) => {
  try { return await getEmailLogByIdRequest(id); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const retryEmailLog = createAsyncThunk("emails/retryLog", async (id, { rejectWithValue }) => {
  try { return await retryEmailRequest(id); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const cancelEmailLog = createAsyncThunk("emails/cancelLog", async (id, { rejectWithValue }) => {
  try { return await cancelEmailRequest(id); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const fetchEmailTemplates = createAsyncThunk("emails/fetchTemplates", async (params, { rejectWithValue }) => {
  try { return await getEmailTemplatesRequest(params); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const fetchEmailTemplateById = createAsyncThunk("emails/fetchTemplate", async (id, { rejectWithValue }) => {
  try { return await getEmailTemplateByIdRequest(id); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const createEmailTemplate = createAsyncThunk("emails/createTemplate", async (payload, { rejectWithValue }) => {
  try { return await createEmailTemplateRequest(payload); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const updateEmailTemplate = createAsyncThunk("emails/updateTemplate", async ({ id, payload }, { rejectWithValue }) => {
  try { return await updateEmailTemplateRequest(id, payload); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const duplicateEmailTemplate = createAsyncThunk("emails/duplicateTemplate", async (id, { rejectWithValue }) => {
  try { return await duplicateEmailTemplateRequest(id); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const resetEmailTemplate = createAsyncThunk("emails/resetTemplate", async (id, { rejectWithValue }) => {
  try { return await resetEmailTemplateRequest(id); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const deleteEmailTemplate = createAsyncThunk("emails/deleteTemplate", async (id, { rejectWithValue }) => {
  try { await deleteEmailTemplateRequest(id); return id; } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const previewEmailTemplate = createAsyncThunk("emails/previewTemplate", async (payload, { rejectWithValue }) => {
  try { return await previewEmailTemplateRequest(payload); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const fetchEmailSettings = createAsyncThunk("emails/fetchSettings", async (_, { rejectWithValue }) => {
  try { return await getEmailSettingsRequest(); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const updateEmailSettings = createAsyncThunk("emails/updateSettings", async (payload, { rejectWithValue }) => {
  try { return await updateEmailSettingsRequest(payload); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const verifyEmailConfig = createAsyncThunk("emails/verifyConfig", async (_, { rejectWithValue }) => {
  try { return await verifyEmailConfigRequest(); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const sendTestEmail = createAsyncThunk("emails/sendTest", async (payload, { rejectWithValue }) => {
  try { return await sendTestEmailRequest(payload); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const sendManualCandidateEmail = createAsyncThunk("emails/sendManualCandidate", async (payload, { rejectWithValue }) => {
  try { return await sendManualCandidateEmailRequest(payload); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const sendBulkCandidateEmails = createAsyncThunk("emails/sendBulk", async (payload, { rejectWithValue }) => {
  try { return await sendBulkCandidateEmailsRequest(payload); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const sendCandidateStatusEmail = createAsyncThunk("emails/sendCandidateStatus", async ({ candidateId, payload }, { rejectWithValue }) => {
  try { return await sendCandidateStatusEmailRequest(candidateId, payload); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const sendInterviewInvitation = createAsyncThunk("emails/sendInterviewInvitation", async ({ interviewId, payload = {} }, { rejectWithValue }) => {
  try { return await sendInterviewInvitationRequest(interviewId, payload); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const sendInterviewReminder = createAsyncThunk("emails/sendInterviewReminder", async ({ interviewId, payload = {} }, { rejectWithValue }) => {
  try { return await sendInterviewReminderRequest(interviewId, payload); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const sendInterviewRescheduled = createAsyncThunk("emails/sendInterviewRescheduled", async ({ interviewId, payload = {} }, { rejectWithValue }) => {
  try { return await sendInterviewRescheduledRequest(interviewId, payload); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

export const sendInterviewCancelled = createAsyncThunk("emails/sendInterviewCancelled", async ({ interviewId, payload = {} }, { rejectWithValue }) => {
  try { return await sendInterviewCancelledRequest(interviewId, payload); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

const upsertLog = (state, log) => {
  if (!log) return;
  state.logs = state.logs.some((item) => item.id === log.id)
    ? state.logs.map((item) => (item.id === log.id ? log : item))
    : [log, ...state.logs];
  if (state.selectedLog?.id === log.id) state.selectedLog = log;
};

const emailSlice = createSlice({
  name: "emails",
  initialState,
  reducers: {
    setEmailLogFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetEmailLogFilters: (state) => {
      state.filters = DEFAULT_EMAIL_LOG_FILTERS;
    },
    clearEmailPreview: (state) => {
      state.preview = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmailSummary.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEmailSummary.fulfilled, (state, action) => { state.loading = false; state.summary = action.payload; state.providerStatus = action.payload.providerStatus; })
      .addCase(fetchEmailSummary.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchEmailLogs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEmailLogs.fulfilled, (state, action) => { state.loading = false; state.logs = action.payload.logs; state.pagination = action.payload.pagination; })
      .addCase(fetchEmailLogs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchEmailLogById.pending, (state) => { state.detailsLoading = true; state.error = null; })
      .addCase(fetchEmailLogById.fulfilled, (state, action) => { state.detailsLoading = false; state.selectedLog = action.payload; })
      .addCase(fetchEmailLogById.rejected, (state, action) => { state.detailsLoading = false; state.error = action.payload; })
      .addCase(fetchEmailTemplates.pending, (state) => { state.templatesLoading = true; state.error = null; })
      .addCase(fetchEmailTemplates.fulfilled, (state, action) => { state.templatesLoading = false; state.templates = action.payload; })
      .addCase(fetchEmailTemplates.rejected, (state, action) => { state.templatesLoading = false; state.error = action.payload; })
      .addCase(fetchEmailTemplateById.fulfilled, (state, action) => { state.selectedTemplate = action.payload; })
      .addCase(createEmailTemplate.pending, (state) => { state.saving = true; })
      .addCase(createEmailTemplate.fulfilled, (state, action) => { state.saving = false; state.selectedTemplate = action.payload; state.templates = [action.payload, ...state.templates]; })
      .addCase(createEmailTemplate.rejected, (state, action) => { state.saving = false; state.error = action.payload; })
      .addCase(updateEmailTemplate.pending, (state) => { state.saving = true; })
      .addCase(updateEmailTemplate.fulfilled, (state, action) => { state.saving = false; state.selectedTemplate = action.payload; state.templates = state.templates.map((item) => item.id === action.payload.id ? action.payload : item); })
      .addCase(updateEmailTemplate.rejected, (state, action) => { state.saving = false; state.error = action.payload; })
      .addCase(duplicateEmailTemplate.fulfilled, (state, action) => { state.templates = [action.payload, ...state.templates]; })
      .addCase(resetEmailTemplate.fulfilled, (state, action) => { state.templates = state.templates.map((item) => item.id === action.payload.id ? action.payload : item); state.selectedTemplate = action.payload; })
      .addCase(deleteEmailTemplate.fulfilled, (state, action) => { state.templates = state.templates.filter((item) => item.id !== action.payload); })
      .addCase(previewEmailTemplate.fulfilled, (state, action) => { state.preview = action.payload; })
      .addCase(fetchEmailSettings.fulfilled, (state, action) => { state.settings = action.payload.settings; state.providerStatus = action.payload.providerStatus; })
      .addCase(updateEmailSettings.pending, (state) => { state.saving = true; })
      .addCase(updateEmailSettings.fulfilled, (state, action) => { state.saving = false; state.settings = action.payload.settings; state.providerStatus = action.payload.providerStatus; })
      .addCase(updateEmailSettings.rejected, (state, action) => { state.saving = false; state.error = action.payload; })
      .addCase(verifyEmailConfig.fulfilled, (state, action) => { state.providerStatus = { ...(state.providerStatus || {}), lastVerify: action.payload }; })
      .addCase(retryEmailLog.fulfilled, (state, action) => { upsertLog(state, action.payload); })
      .addCase(cancelEmailLog.fulfilled, (state, action) => { upsertLog(state, action.payload); })
      .addCase(sendTestEmail.pending, (state) => { state.sending = true; })
      .addCase(sendTestEmail.fulfilled, (state, action) => { state.sending = false; upsertLog(state, action.payload.log); })
      .addCase(sendTestEmail.rejected, (state, action) => { state.sending = false; state.error = action.payload; })
      .addCase(sendManualCandidateEmail.pending, (state) => { state.sending = true; })
      .addCase(sendManualCandidateEmail.fulfilled, (state, action) => { state.sending = false; upsertLog(state, action.payload.log); })
      .addCase(sendManualCandidateEmail.rejected, (state, action) => { state.sending = false; state.error = action.payload; })
      .addCase(sendBulkCandidateEmails.fulfilled, (state) => { state.sending = false; })
      .addCase(sendCandidateStatusEmail.fulfilled, (state, action) => { upsertLog(state, action.payload.log); })
      .addCase(sendInterviewInvitation.fulfilled, (state, action) => { upsertLog(state, action.payload.log); })
      .addCase(sendInterviewReminder.fulfilled, (state, action) => { upsertLog(state, action.payload.log); })
      .addCase(sendInterviewRescheduled.fulfilled, (state, action) => { upsertLog(state, action.payload.log); })
      .addCase(sendInterviewCancelled.fulfilled, (state, action) => { upsertLog(state, action.payload.log); });
  }
});

export const { clearEmailPreview, resetEmailLogFilters, setEmailLogFilters } = emailSlice.actions;
export default emailSlice.reducer;
