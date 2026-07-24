import { Construction } from "lucide-react";
import { Navigate, Route, Routes } from "react-router-dom";
import EmptyState from "../components/common/EmptyState.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage.jsx";
import UnauthorizedPage from "../pages/auth/UnauthorizedPage.jsx";
import AdminOverviewPage from "../pages/admin/AdminOverviewPage.jsx";
import AdminAuditLogsPage from "../pages/admin/AdminAuditLogsPage.jsx";
import AdminCompaniesPage from "../pages/admin/AdminCompaniesPage.jsx";
import AdminCompanyDetailsPage from "../pages/admin/AdminCompanyDetailsPage.jsx";
import AdminSystemHealthPage from "../pages/admin/AdminSystemHealthPage.jsx";
import AdminUserDetailsPage from "../pages/admin/AdminUserDetailsPage.jsx";
import AdminUsersPage from "../pages/admin/AdminUsersPage.jsx";
import AnalyticsOverviewPage from "../pages/dashboard/AnalyticsOverviewPage.jsx";
import AiRankingPage from "../pages/dashboard/AiRankingPage.jsx";
import ChangePasswordPage from "../pages/dashboard/ChangePasswordPage.jsx";
import CandidateAnalyticsPage from "../pages/dashboard/CandidateAnalyticsPage.jsx";
import CandidateDetailsPage from "../pages/dashboard/CandidateDetailsPage.jsx";
import CandidateComparisonPage from "../pages/dashboard/CandidateComparisonPage.jsx";
import CandidatesPage from "../pages/dashboard/CandidatesPage.jsx";
import CompanyOnboardingPage from "../pages/dashboard/CompanyOnboardingPage.jsx";
import CompanySettingsPage from "../pages/dashboard/CompanySettingsPage.jsx";
import CreateJobPage from "../pages/dashboard/CreateJobPage.jsx";
import DashboardOverviewPage from "../pages/dashboard/DashboardOverviewPage.jsx";
import EditCandidatePage from "../pages/dashboard/EditCandidatePage.jsx";
import EditJobPage from "../pages/dashboard/EditJobPage.jsx";
import EmailLogDetailsPage from "../pages/dashboard/EmailLogDetailsPage.jsx";
import EmailLogsPage from "../pages/dashboard/EmailLogsPage.jsx";
import EmailsPage from "../pages/dashboard/EmailsPage.jsx";
import EmailSettingsPage from "../pages/dashboard/EmailSettingsPage.jsx";
import EmailTemplateEditorPage from "../pages/dashboard/EmailTemplateEditorPage.jsx";
import EmailTemplatesPage from "../pages/dashboard/EmailTemplatesPage.jsx";
import EmailAnalyticsPage from "../pages/dashboard/EmailAnalyticsPage.jsx";
import InterviewCalendarPage from "../pages/dashboard/InterviewCalendarPage.jsx";
import InterviewAnalyticsPage from "../pages/dashboard/InterviewAnalyticsPage.jsx";
import InterviewDetailsPage from "../pages/dashboard/InterviewDetailsPage.jsx";
import InterviewFeedbackPage from "../pages/dashboard/InterviewFeedbackPage.jsx";
import InterviewsPage from "../pages/dashboard/InterviewsPage.jsx";
import JobDetailsPage from "../pages/dashboard/JobDetailsPage.jsx";
import JobAnalyticsDetailsPage from "../pages/dashboard/JobAnalyticsDetailsPage.jsx";
import JobAnalyticsPage from "../pages/dashboard/JobAnalyticsPage.jsx";
import JobsPage from "../pages/dashboard/JobsPage.jsx";
import OnHoldCandidatesPage from "../pages/dashboard/OnHoldCandidatesPage.jsx";
import ProfilePage from "../pages/dashboard/ProfilePage.jsx";
import RejectedCandidatesPage from "../pages/dashboard/RejectedCandidatesPage.jsx";
import ShortlistedCandidatesPage from "../pages/dashboard/ShortlistedCandidatesPage.jsx";
import ScheduleInterviewPage from "../pages/dashboard/ScheduleInterviewPage.jsx";
import SkillAnalyticsPage from "../pages/dashboard/SkillAnalyticsPage.jsx";
import UnderReviewCandidatesPage from "../pages/dashboard/UnderReviewCandidatesPage.jsx";
import UploadCandidatePage from "../pages/dashboard/UploadCandidatePage.jsx";
import RecruiterAnalyticsPage from "../pages/dashboard/RecruiterAnalyticsPage.jsx";
import ApplicationStatusPage from "../pages/public/ApplicationStatusPage.jsx";
import FeaturesPage from "../pages/public/FeaturesPage.jsx";
import ApplicationSuccessPage from "../pages/public/ApplicationSuccessPage.jsx";
import HomePage from "../pages/public/HomePage.jsx";
import JobApplicationPage from "../pages/public/JobApplicationPage.jsx";
import NotFoundPage from "../pages/public/NotFoundPage.jsx";
import PricingPage from "../pages/public/PricingPage.jsx";
import PublicJobPage from "../pages/public/PublicJobPage.jsx";
import GuestRoute from "./GuestRoute.jsx";
import CompanyRequiredRoute from "./CompanyRequiredRoute.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleRoute from "./RoleRoute.jsx";

const ComingSoonPage = ({ title }) => (
  <EmptyState
    title={`${title} workspace is being prepared`}
    description="This area is not available yet. You can continue managing jobs, candidates and AI ranking from the active dashboard sections."
    icon={Construction}
    className="min-h-[420px]"
  />
);

const AppRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<HomePage />} />
      <Route path="features" element={<FeaturesPage />} />
      <Route path="pricing" element={<PricingPage />} />
      <Route element={<GuestRoute />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="unauthorized" element={<UnauthorizedPage />} />
      <Route path="jobs/:slug" element={<PublicJobPage />} />
      <Route path="jobs/:slug/apply" element={<JobApplicationPage />} />
      <Route path="application-success" element={<ApplicationSuccessPage />} />
      <Route path="application-status" element={<ApplicationStatusPage />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<RoleRoute allowedRoles={["hr"]} />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="company-onboarding" element={<CompanyOnboardingPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
          <Route element={<CompanyRequiredRoute />}>
            <Route index element={<DashboardOverviewPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/create" element={<CreateJobPage />} />
            <Route path="jobs/:id" element={<JobDetailsPage />} />
            <Route path="jobs/:id/edit" element={<EditJobPage />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="candidates/shortlisted" element={<ShortlistedCandidatesPage />} />
            <Route path="candidates/rejected" element={<RejectedCandidatesPage />} />
            <Route path="candidates/on-hold" element={<OnHoldCandidatesPage />} />
            <Route path="candidates/under-review" element={<UnderReviewCandidatesPage />} />
            <Route path="candidates/compare" element={<CandidateComparisonPage />} />
            <Route path="candidates/upload" element={<UploadCandidatePage />} />
            <Route path="candidates/:candidateId/schedule-interview" element={<ScheduleInterviewPage />} />
            <Route path="candidates/:id" element={<CandidateDetailsPage />} />
            <Route path="candidates/:id/edit" element={<EditCandidatePage />} />
            <Route path="ai-ranking" element={<AiRankingPage />} />
            <Route path="interviews" element={<InterviewsPage />} />
            <Route path="interviews/calendar" element={<InterviewCalendarPage />} />
            <Route path="interviews/schedule" element={<ScheduleInterviewPage />} />
            <Route path="interviews/:id" element={<InterviewDetailsPage />} />
            <Route path="interviews/:id/edit" element={<ScheduleInterviewPage />} />
            <Route path="interviews/:id/feedback" element={<InterviewFeedbackPage />} />
            <Route path="emails" element={<EmailsPage />} />
            <Route path="emails/logs" element={<EmailLogsPage />} />
            <Route path="emails/logs/:id" element={<EmailLogDetailsPage />} />
            <Route path="email-templates" element={<EmailTemplatesPage />} />
            <Route path="email-templates/new" element={<EmailTemplateEditorPage />} />
            <Route path="email-templates/:id/edit" element={<EmailTemplateEditorPage />} />
            <Route path="email-settings" element={<EmailSettingsPage />} />
            <Route path="analytics" element={<AnalyticsOverviewPage />} />
            <Route path="analytics/candidates" element={<CandidateAnalyticsPage />} />
            <Route path="analytics/jobs" element={<JobAnalyticsPage />} />
            <Route path="analytics/jobs/:jobId" element={<JobAnalyticsDetailsPage />} />
            <Route path="analytics/interviews" element={<InterviewAnalyticsPage />} />
            <Route path="analytics/emails" element={<EmailAnalyticsPage />} />
            <Route path="analytics/skills" element={<SkillAnalyticsPage />} />
            <Route path="analytics/recruiters" element={<RecruiterAnalyticsPage />} />
            <Route path="company-settings" element={<CompanySettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<RoleRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="companies" element={<AdminCompaniesPage />} />
          <Route path="companies/:id" element={<AdminCompanyDetailsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="users/:id" element={<AdminUserDetailsPage />} />
          <Route path="audit-logs" element={<AdminAuditLogsPage />} />
          <Route path="system-health" element={<AdminSystemHealthPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
        </Route>
      </Route>
    </Route>

    <Route path="/home" element={<Navigate to="/" replace />} />
    <Route element={<PublicLayout />}>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export default AppRoutes;
