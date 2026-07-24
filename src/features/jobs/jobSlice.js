import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  changeJobStatusRequest,
  createJobRequest,
  deleteJobRequest,
  getJobByIdRequest,
  getJobsRequest,
  updateJobRequest
} from "../../api/jobApi.js";
import { DEFAULT_JOB_FILTERS } from "../../utils/constants.js";

const initialState = {
  jobs: [],
  selectedJob: null,
  pagination: { page: 1, limit: 10, total: 0, pages: 0, hasNextPage: false, hasPreviousPage: false },
  filters: DEFAULT_JOB_FILTERS,
  loading: false,
  detailsLoading: false,
  saving: false,
  deleting: false,
  error: null
};

const getErrorMessage = (error) => error.response?.data?.message || error.message || "Job request failed";

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async (filters, { rejectWithValue }) => {
  try {
    return await getJobsRequest(filters);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchJobById = createAsyncThunk("jobs/fetchJobById", async (id, { rejectWithValue }) => {
  try {
    return await getJobByIdRequest(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const createJob = createAsyncThunk("jobs/createJob", async (payload, { rejectWithValue }) => {
  try {
    return await createJobRequest(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateJob = createAsyncThunk("jobs/updateJob", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await updateJobRequest(id, payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateJobStatus = createAsyncThunk("jobs/updateJobStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    return await changeJobStatusRequest(id, status);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const deleteJob = createAsyncThunk("jobs/deleteJob", async (id, { rejectWithValue }) => {
  try {
    return await deleteJobRequest(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetJobFilters: (state) => {
      state.filters = DEFAULT_JOB_FILTERS;
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchJobById.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteJob.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteJob.fulfilled, (state) => {
        state.deleting = false;
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })
      .addMatcher(
        (action) => [createJob.pending.type, updateJob.pending.type, updateJobStatus.pending.type].includes(action.type),
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => [createJob.fulfilled.type, updateJob.fulfilled.type, updateJobStatus.fulfilled.type].includes(action.type),
        (state, action) => {
          state.saving = false;
          state.selectedJob = action.payload;
        }
      )
      .addMatcher(
        (action) => [createJob.rejected.type, updateJob.rejected.type, updateJobStatus.rejected.type].includes(action.type),
        (state, action) => {
          state.saving = false;
          state.error = action.payload;
        }
      );
  }
});

export const { clearSelectedJob, resetJobFilters, setJobFilters } = jobSlice.actions;
export default jobSlice.reducer;
