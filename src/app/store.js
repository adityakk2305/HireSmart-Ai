import { configureStore, createSlice } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import adminReducer from "../features/admin/adminSlice.js";
import analyticsReducer from "../features/analytics/analyticsSlice.js";
import candidatesReducer from "../features/candidates/candidateSlice.js";
import companyReducer from "../features/company/companySlice.js";
import emailsReducer from "../features/emails/emailSlice.js";
import interviewsReducer from "../features/interviews/interviewSlice.js";
import jobsReducer from "../features/jobs/jobSlice.js";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebarOpen: true,
    mobileSidebarOpen: false
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openMobileSidebar: (state) => {
      state.mobileSidebarOpen = true;
    },
    closeMobileSidebar: (state) => {
      state.mobileSidebarOpen = false;
    }
  }
});

export const { toggleSidebar, openMobileSidebar, closeMobileSidebar } = uiSlice.actions;

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    analytics: analyticsReducer,
    auth: authReducer,
    candidates: candidatesReducer,
    company: companyReducer,
    emails: emailsReducer,
    interviews: interviewsReducer,
    jobs: jobsReducer,
    ui: uiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      serializableCheck: { warnAfter: 128 }
    })
});
