import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createCompanyRequest,
  getCompanyOnboardingStatusRequest,
  getMyCompanyRequest,
  updateCompanyRequest,
  uploadCompanyLogoRequest
} from "../../api/companyApi.js";
import { updateUserCompanyId } from "../auth/authSlice.js";

const initialState = {
  company: null,
  hasCompany: false,
  requiresOnboarding: false,
  loading: false,
  initializing: false,
  saving: false,
  error: null
};

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Company request failed";

export const fetchCompanyOnboardingStatus = createAsyncThunk(
  "company/fetchOnboardingStatus",
  async (_, { rejectWithValue }) => {
    try {
      return await getCompanyOnboardingStatusRequest();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchMyCompany = createAsyncThunk("company/fetchMyCompany", async (_, { rejectWithValue }) => {
  try {
    return await getMyCompanyRequest();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const createCompany = createAsyncThunk(
  "company/createCompany",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const data = await createCompanyRequest(payload);
      dispatch(updateUserCompanyId(data.user.companyId));
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateCompany = createAsyncThunk("company/updateCompany", async (payload, { rejectWithValue }) => {
  try {
    return await updateCompanyRequest(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const uploadCompanyLogo = createAsyncThunk(
  "company/uploadCompanyLogo",
  async (file, { rejectWithValue }) => {
    try {
      return await uploadCompanyLogoRequest(file);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const initializeCompany = createAsyncThunk(
  "company/initializeCompany",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const { auth } = getState();

      if (!auth.isAuthenticated || auth.user?.role !== "hr") {
        return { skip: true };
      }

      const status = await getCompanyOnboardingStatusRequest();

      if (status.hasCompany) {
        const data = await dispatch(fetchMyCompany()).unwrap();
        return { ...status, company: data.company };
      }

      return status;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const applyStatus = (state, payload) => {
  state.hasCompany = Boolean(payload.hasCompany);
  state.requiresOnboarding = Boolean(payload.requiresCompanyOnboarding);
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCompanyState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyOnboardingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyOnboardingStatus.fulfilled, (state, action) => {
        state.loading = false;
        applyStatus(state, action.payload);
      })
      .addCase(fetchCompanyOnboardingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.company;
        state.hasCompany = true;
        state.requiresOnboarding = false;
      })
      .addCase(fetchMyCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCompany.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.saving = false;
        state.company = action.payload.company;
        state.hasCompany = true;
        state.requiresOnboarding = false;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateCompany.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.saving = false;
        state.company = action.payload.company;
        state.hasCompany = true;
        state.requiresOnboarding = false;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(uploadCompanyLogo.fulfilled, (state, action) => {
        state.company = action.payload.company;
      })
      .addCase(initializeCompany.pending, (state) => {
        state.initializing = true;
        state.error = null;
      })
      .addCase(initializeCompany.fulfilled, (state, action) => {
        state.initializing = false;
        state.loading = false;
        if (!action.payload?.skip) {
          applyStatus(state, action.payload);
          if (action.payload.company) {
            state.company = action.payload.company;
          }
        }
      })
      .addCase(initializeCompany.rejected, (state, action) => {
        state.initializing = false;
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCompanyState } = companySlice.actions;
export default companySlice.reducer;
