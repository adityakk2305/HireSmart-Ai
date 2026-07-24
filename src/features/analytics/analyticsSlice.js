import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAiScreeningAnalyticsRequest,
  getAnalyticsOverviewRequest,
  getAnalyticsSummaryRequest,
  getCandidateAnalyticsRequest,
  getEmailAnalyticsRequest,
  getHiringFunnelRequest,
  getInterviewAnalyticsRequest,
  getInterviewerAnalyticsRequest,
  getJobAnalyticsDetailsRequest,
  getJobAnalyticsRequest,
  getRecruiterAnalyticsRequest,
  getSkillAnalyticsRequest
} from "../../api/analyticsApi.js";

const errorMessage = (error) => error.response?.data?.message || error.message || "Analytics request failed";

const initialState = {
  summary: null,
  overview: null,
  funnel: null,
  candidates: null,
  aiScreening: null,
  skills: null,
  jobs: null,
  jobDetails: null,
  interviews: null,
  interviewers: null,
  emails: null,
  recruiters: null,
  filters: { preset: "last-30-days", comparePrevious: false, grouping: "day" },
  loading: false,
  error: null
};

export const fetchAnalyticsSummary = createAsyncThunk("analytics/summary", async (query, { rejectWithValue }) => {
  try { return await getAnalyticsSummaryRequest(query); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const fetchAnalyticsOverview = createAsyncThunk("analytics/overview", async (query, { rejectWithValue }) => {
  try { return await getAnalyticsOverviewRequest(query); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const fetchHiringFunnel = createAsyncThunk("analytics/funnel", async (query, { rejectWithValue }) => {
  try { return await getHiringFunnelRequest(query); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const fetchCandidateAnalytics = createAsyncThunk("analytics/candidates", async (query, { rejectWithValue }) => {
  try { return await getCandidateAnalyticsRequest(query); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const fetchAiScreeningAnalytics = createAsyncThunk("analytics/ai", async (query, { rejectWithValue }) => {
  try { return await getAiScreeningAnalyticsRequest(query); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const fetchSkillAnalytics = createAsyncThunk("analytics/skills", async (query, { rejectWithValue }) => {
  try { return await getSkillAnalyticsRequest(query); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const fetchJobAnalytics = createAsyncThunk("analytics/jobs", async (query, { rejectWithValue }) => {
  try { return await getJobAnalyticsRequest(query); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const fetchJobAnalyticsDetails = createAsyncThunk("analytics/jobDetails", async ({ jobId, query }, { rejectWithValue }) => {
  try { return await getJobAnalyticsDetailsRequest(jobId, query); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const fetchInterviewAnalytics = createAsyncThunk("analytics/interviews", async (query, { rejectWithValue }) => {
  try { return await getInterviewAnalyticsRequest(query); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const fetchInterviewerAnalytics = createAsyncThunk("analytics/interviewers", async (query, { rejectWithValue }) => {
  try { return await getInterviewerAnalyticsRequest(query); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const fetchEmailAnalytics = createAsyncThunk("analytics/emails", async (query, { rejectWithValue }) => {
  try { return await getEmailAnalyticsRequest(query); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const fetchRecruiterAnalytics = createAsyncThunk("analytics/recruiters", async (query, { rejectWithValue }) => {
  try { return await getRecruiterAnalyticsRequest(query); } catch (error) { return rejectWithValue(errorMessage(error)); }
});

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setAnalyticsFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsSummary.fulfilled, (state, action) => { state.summary = action.payload; })
      .addCase(fetchAnalyticsOverview.fulfilled, (state, action) => { state.overview = action.payload; })
      .addCase(fetchHiringFunnel.fulfilled, (state, action) => { state.funnel = action.payload; })
      .addCase(fetchCandidateAnalytics.fulfilled, (state, action) => { state.candidates = action.payload; })
      .addCase(fetchAiScreeningAnalytics.fulfilled, (state, action) => { state.aiScreening = action.payload; })
      .addCase(fetchSkillAnalytics.fulfilled, (state, action) => { state.skills = action.payload; })
      .addCase(fetchJobAnalytics.fulfilled, (state, action) => { state.jobs = action.payload; })
      .addCase(fetchJobAnalyticsDetails.fulfilled, (state, action) => { state.jobDetails = action.payload; })
      .addCase(fetchInterviewAnalytics.fulfilled, (state, action) => { state.interviews = action.payload; })
      .addCase(fetchInterviewerAnalytics.fulfilled, (state, action) => { state.interviewers = action.payload; })
      .addCase(fetchEmailAnalytics.fulfilled, (state, action) => { state.emails = action.payload; })
      .addCase(fetchRecruiterAnalytics.fulfilled, (state, action) => { state.recruiters = action.payload; })
      .addMatcher((action) => action.type.startsWith("analytics/") && action.type.endsWith("/pending"), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith("analytics/") && action.type.endsWith("/fulfilled"), (state) => {
        state.loading = false;
      })
      .addMatcher((action) => action.type.startsWith("analytics/") && action.type.endsWith("/rejected"), (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setAnalyticsFilters } = analyticsSlice.actions;
export default analyticsSlice.reducer;
