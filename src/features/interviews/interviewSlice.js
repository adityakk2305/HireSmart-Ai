import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  cancelInterviewRequest,
  changeInterviewStatusRequest,
  completeInterviewRequest,
  createInterviewRequest,
  editInterviewFeedbackRequest,
  generateQuestionsRequest,
  getCandidateInterviewsRequest,
  getInterviewByIdRequest,
  getInterviewsRequest,
  getInterviewSummaryRequest,
  getTodayInterviewsRequest,
  getUpcomingInterviewsRequest,
  rescheduleInterviewRequest,
  submitInterviewFeedbackRequest,
  updateInterviewRequest
} from "../../api/interviewApi.js";
import { DEFAULT_INTERVIEW_FILTERS } from "../../utils/interviewConstants.js";

const initialState = {
  interviews: [],
  selectedInterview: null,
  candidateInterviews: [],
  upcomingInterviews: [],
  todayInterviews: [],
  summary: null,
  pagination: { page: 1, limit: 10, total: 0, pages: 0, hasNextPage: false, hasPreviousPage: false },
  filters: DEFAULT_INTERVIEW_FILTERS,
  loading: false,
  detailsLoading: false,
  creating: false,
  updating: false,
  rescheduling: false,
  cancelling: false,
  completing: false,
  feedbackSubmitting: false,
  generatingQuestions: false,
  error: null
};

const getErrorMessage = (error) => error.response?.data?.message || error.message || "Interview request failed";

export const fetchInterviews = createAsyncThunk("interviews/fetchInterviews", async (filters, { rejectWithValue }) => {
  try { return await getInterviewsRequest(filters); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});
export const fetchInterviewById = createAsyncThunk("interviews/fetchInterviewById", async (id, { rejectWithValue }) => {
  try { return await getInterviewByIdRequest(id); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});
export const createInterview = createAsyncThunk("interviews/createInterview", async (payload, { rejectWithValue }) => {
  try { return await createInterviewRequest(payload); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});
export const updateInterview = createAsyncThunk("interviews/updateInterview", async ({ id, payload }, { rejectWithValue }) => {
  try { return await updateInterviewRequest(id, payload); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});
export const rescheduleInterview = createAsyncThunk("interviews/rescheduleInterview", async ({ id, payload }, { rejectWithValue }) => {
  try { return await rescheduleInterviewRequest(id, payload); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});
export const cancelInterview = createAsyncThunk("interviews/cancelInterview", async ({ id, reason }, { rejectWithValue }) => {
  try { return await cancelInterviewRequest(id, reason); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});
export const changeInterviewStatus = createAsyncThunk("interviews/changeInterviewStatus", async ({ id, status }, { rejectWithValue }) => {
  try { return await changeInterviewStatusRequest(id, status); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});
export const completeInterview = createAsyncThunk("interviews/completeInterview", async (id, { rejectWithValue }) => {
  try { return await completeInterviewRequest(id); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});
export const fetchCandidateInterviews = createAsyncThunk("interviews/fetchCandidateInterviews", async (candidateId, { rejectWithValue }) => {
  try { return await getCandidateInterviewsRequest(candidateId); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});
export const fetchInterviewSummary = createAsyncThunk("interviews/fetchInterviewSummary", async (_, { rejectWithValue }) => {
  try { return await getInterviewSummaryRequest(); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});
export const fetchUpcomingInterviews = createAsyncThunk("interviews/fetchUpcomingInterviews", async (params, { rejectWithValue }) => {
  try { return await getUpcomingInterviewsRequest(params); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});
export const fetchTodayInterviews = createAsyncThunk("interviews/fetchTodayInterviews", async (params, { rejectWithValue }) => {
  try { return await getTodayInterviewsRequest(params); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});
export const submitInterviewFeedback = createAsyncThunk("interviews/submitInterviewFeedback", async ({ id, payload }, { rejectWithValue }) => {
  try { return await submitInterviewFeedbackRequest(id, payload); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});
export const editInterviewFeedback = createAsyncThunk("interviews/editInterviewFeedback", async ({ id, feedbackId, payload }, { rejectWithValue }) => {
  try { return await editInterviewFeedbackRequest(id, feedbackId, payload); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});
export const generateQuestions = createAsyncThunk("interviews/generateQuestions", async ({ id, payload }, { rejectWithValue }) => {
  try { return await generateQuestionsRequest(id, payload); } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

const setSelected = (state, interview) => {
  state.selectedInterview = interview;
  state.interviews = state.interviews.map((item) => item.id === interview.id ? interview : item);
};

const interviewSlice = createSlice({
  name: "interviews",
  initialState,
  reducers: {
    setInterviewFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    resetInterviewFilters: (state) => { state.filters = DEFAULT_INTERVIEW_FILTERS; },
    clearSelectedInterview: (state) => { state.selectedInterview = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = action.payload.interviews;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchInterviews.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchInterviewById.pending, (state) => { state.detailsLoading = true; state.error = null; })
      .addCase(fetchInterviewById.fulfilled, (state, action) => { state.detailsLoading = false; state.selectedInterview = action.payload; })
      .addCase(fetchInterviewById.rejected, (state, action) => { state.detailsLoading = false; state.error = action.payload; })
      .addCase(createInterview.pending, (state) => { state.creating = true; state.error = null; })
      .addCase(createInterview.fulfilled, (state, action) => { state.creating = false; state.selectedInterview = action.payload; })
      .addCase(createInterview.rejected, (state, action) => { state.creating = false; state.error = action.payload; })
      .addCase(updateInterview.pending, (state) => { state.updating = true; state.error = null; })
      .addCase(updateInterview.fulfilled, (state, action) => { state.updating = false; setSelected(state, action.payload); })
      .addCase(updateInterview.rejected, (state, action) => { state.updating = false; state.error = action.payload; })
      .addCase(rescheduleInterview.pending, (state) => { state.rescheduling = true; state.error = null; })
      .addCase(rescheduleInterview.fulfilled, (state, action) => { state.rescheduling = false; setSelected(state, action.payload); })
      .addCase(rescheduleInterview.rejected, (state, action) => { state.rescheduling = false; state.error = action.payload; })
      .addCase(cancelInterview.pending, (state) => { state.cancelling = true; state.error = null; })
      .addCase(cancelInterview.fulfilled, (state, action) => { state.cancelling = false; setSelected(state, action.payload); })
      .addCase(cancelInterview.rejected, (state, action) => { state.cancelling = false; state.error = action.payload; })
      .addCase(changeInterviewStatus.pending, (state) => { state.updating = true; state.error = null; })
      .addCase(changeInterviewStatus.fulfilled, (state, action) => { state.updating = false; setSelected(state, action.payload); })
      .addCase(changeInterviewStatus.rejected, (state, action) => { state.updating = false; state.error = action.payload; })
      .addCase(completeInterview.pending, (state) => { state.completing = true; state.error = null; })
      .addCase(completeInterview.fulfilled, (state, action) => { state.completing = false; setSelected(state, action.payload); })
      .addCase(completeInterview.rejected, (state, action) => { state.completing = false; state.error = action.payload; })
      .addCase(fetchCandidateInterviews.fulfilled, (state, action) => { state.candidateInterviews = action.payload.interviews; })
      .addCase(fetchInterviewSummary.fulfilled, (state, action) => { state.summary = action.payload; })
      .addCase(fetchUpcomingInterviews.fulfilled, (state, action) => { state.upcomingInterviews = action.payload.interviews; })
      .addCase(fetchTodayInterviews.fulfilled, (state, action) => { state.todayInterviews = action.payload.interviews; })
      .addCase(submitInterviewFeedback.pending, (state) => { state.feedbackSubmitting = true; state.error = null; })
      .addCase(submitInterviewFeedback.fulfilled, (state, action) => { state.feedbackSubmitting = false; setSelected(state, action.payload); })
      .addCase(submitInterviewFeedback.rejected, (state, action) => { state.feedbackSubmitting = false; state.error = action.payload; })
      .addCase(editInterviewFeedback.pending, (state) => { state.feedbackSubmitting = true; state.error = null; })
      .addCase(editInterviewFeedback.fulfilled, (state, action) => { state.feedbackSubmitting = false; setSelected(state, action.payload); })
      .addCase(editInterviewFeedback.rejected, (state, action) => { state.feedbackSubmitting = false; state.error = action.payload; })
      .addCase(generateQuestions.pending, (state) => { state.generatingQuestions = true; state.error = null; })
      .addCase(generateQuestions.fulfilled, (state, action) => { state.generatingQuestions = false; setSelected(state, action.payload.interview); })
      .addCase(generateQuestions.rejected, (state, action) => { state.generatingQuestions = false; state.error = action.payload; });
  }
});

export const { clearSelectedInterview, resetInterviewFilters, setInterviewFilters } = interviewSlice.actions;
export default interviewSlice.reducer;
