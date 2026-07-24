import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAdminCompaniesRequest,
  getAdminCompanyDetailsRequest,
  getAdminOverviewRequest,
  getAdminUserDetailsRequest,
  getAdminUsersRequest,
  getAuditLogsRequest,
  getSystemHealthRequest,
  updateAdminCompanyStatusRequest,
  updateAdminUserStatusRequest
} from "../../api/adminApi.js";

const errorMessage = (error) => error.response?.data?.message || error.message || "Admin request failed";

const initialState = {
  overview: null,
  companies: [],
  selectedCompany: null,
  users: [],
  selectedUser: null,
  auditLogs: [],
  systemHealth: null,
  pagination: { page: 1, limit: 10, total: 0, pages: 1 },
  loading: false,
  saving: false,
  error: null
};

export const fetchAdminOverview = createAsyncThunk("admin/overview", async (_, { rejectWithValue }) => {
  try { return await getAdminOverviewRequest(); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const fetchAdminCompanies = createAsyncThunk("admin/companies", async (query, { rejectWithValue }) => {
  try { return await getAdminCompaniesRequest(query); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const fetchAdminCompanyDetails = createAsyncThunk("admin/companyDetails", async (id, { rejectWithValue }) => {
  try { return await getAdminCompanyDetailsRequest(id); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const updateAdminCompanyStatus = createAsyncThunk("admin/companyStatus", async ({ id, payload }, { rejectWithValue }) => {
  try { return await updateAdminCompanyStatusRequest(id, payload); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const fetchAdminUsers = createAsyncThunk("admin/users", async (query, { rejectWithValue }) => {
  try { return await getAdminUsersRequest(query); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const fetchAdminUserDetails = createAsyncThunk("admin/userDetails", async (id, { rejectWithValue }) => {
  try { return await getAdminUserDetailsRequest(id); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const updateAdminUserStatus = createAsyncThunk("admin/userStatus", async ({ id, payload }, { rejectWithValue }) => {
  try { return await updateAdminUserStatusRequest(id, payload); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const fetchAuditLogs = createAsyncThunk("admin/auditLogs", async (query, { rejectWithValue }) => {
  try { return await getAuditLogsRequest(query); } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const fetchSystemHealth = createAsyncThunk("admin/systemHealth", async (_, { rejectWithValue }) => {
  try { return await getSystemHealthRequest(); } catch (error) { return rejectWithValue(errorMessage(error)); }
});

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOverview.fulfilled, (state, action) => { state.overview = action.payload; })
      .addCase(fetchAdminCompanies.fulfilled, (state, action) => { state.companies = action.payload.companies; state.pagination = action.payload.pagination; })
      .addCase(fetchAdminCompanyDetails.fulfilled, (state, action) => { state.selectedCompany = action.payload; })
      .addCase(updateAdminCompanyStatus.pending, (state) => { state.saving = true; })
      .addCase(updateAdminCompanyStatus.fulfilled, (state, action) => {
        state.saving = false;
        state.companies = state.companies.map((company) => company.id === action.payload.company.id ? action.payload.company : company);
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => { state.users = action.payload.users; state.pagination = action.payload.pagination; })
      .addCase(fetchAdminUserDetails.fulfilled, (state, action) => { state.selectedUser = action.payload; })
      .addCase(updateAdminUserStatus.pending, (state) => { state.saving = true; })
      .addCase(updateAdminUserStatus.fulfilled, (state, action) => {
        state.saving = false;
        state.users = state.users.map((user) => user.id === action.payload.user.id ? action.payload.user : user);
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => { state.auditLogs = action.payload.logs; state.pagination = action.payload.pagination; })
      .addCase(fetchSystemHealth.fulfilled, (state, action) => { state.systemHealth = action.payload; })
      .addMatcher((action) => action.type.startsWith("admin/") && action.type.endsWith("/pending"), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith("admin/") && action.type.endsWith("/fulfilled"), (state) => {
        state.loading = false;
      })
      .addMatcher((action) => action.type.startsWith("admin/") && action.type.endsWith("/rejected"), (state, action) => {
        state.loading = false;
        state.saving = false;
        state.error = action.payload;
      });
  }
});

export default adminSlice.reducer;
