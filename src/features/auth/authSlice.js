import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser
} from "../../api/authApi.js";
import { clearStoredAuth, getStoredAuth, setStoredAuth, updateStoredUser } from "./authStorage.js";

const storedAuth = typeof window !== "undefined" ? getStoredAuth() : null;

const initialState = {
  user: storedAuth?.user || null,
  accessToken: storedAuth?.accessToken || "",
  isAuthenticated: Boolean(storedAuth?.accessToken && storedAuth?.user),
  loading: false,
  initializing: true,
  error: null
};

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Authentication request failed";

export const register = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const data = await registerUser(payload);
    setStoredAuth(data);
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const login = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const data = await loginUser(payload);
    setStoredAuth(data);
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await logoutUser();
    clearStoredAuth();
    return true;
  } catch (error) {
    clearStoredAuth();
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const data = await getCurrentUser();
    const stored = getStoredAuth();
    const authData = {
      user: data.user,
      accessToken: stored?.accessToken || ""
    };
    setStoredAuth(authData);
    return authData;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const initializeAuth = createAsyncThunk("auth/initialize", async (_, { rejectWithValue }) => {
  try {
    const stored = getStoredAuth();

    if (stored?.accessToken) {
      const data = await getCurrentUser();
      const latestStored = getStoredAuth();
      const authData = {
        user: data.user,
        accessToken: latestStored?.accessToken || stored.accessToken
      };
      setStoredAuth(authData);
      return authData;
    }

    return null;
  } catch (error) {
    clearStoredAuth();
    return rejectWithValue(getErrorMessage(error));
  }
});

const applyAuth = (state, payload) => {
  state.user = payload.user;
  state.accessToken = payload.accessToken;
  state.isAuthenticated = true;
  state.error = null;
};

const clearAuth = (state) => {
  state.user = null;
  state.accessToken = "";
  state.isAuthenticated = false;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuthenticatedUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload
      };
      updateStoredUser(action.payload);
    },
    updateUserCompanyId: (state, action) => {
      if (state.user) {
        state.user.companyId = action.payload;
        updateStoredUser({ companyId: action.payload });
      }
    },
    clearAuthenticationAfterPasswordChange: (state) => {
      clearStoredAuth();
      clearAuth(state);
      state.loading = false;
      state.initializing = false;
      state.error = null;
    },
    clearAuthState: (state) => {
      clearStoredAuth();
      clearAuth(state);
      state.loading = false;
      state.initializing = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        applyAuth(state, action.payload);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        applyAuth(state, action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        clearAuth(state);
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        clearAuth(state);
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        applyAuth(state, action.payload);
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        clearAuth(state);
      })
      .addCase(initializeAuth.pending, (state) => {
        state.initializing = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.initializing = false;
        if (action.payload) {
          applyAuth(state, action.payload);
        } else {
          clearAuth(state);
          state.error = null;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.initializing = false;
        clearAuth(state);
      });
  }
});

export const {
  clearAuthenticationAfterPasswordChange,
  clearAuthState,
  updateAuthenticatedUser,
  updateUserCompanyId
} = authSlice.actions;
export default authSlice.reducer;
