import {
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CalendarDays,
  FileText,
  KeyRound,
  LayoutDashboard,
  Mail,
  Settings,
  ShieldCheck,
  Activity,
  Upload,
  UserCircle,
  UsersRound
} from "lucide-react";

export const APP_NAME = "HireSmart AI";

export const PHASE_ONE_PREVIEW_DATA = {
  dashboard: {
    activeJobs: 0,
    totalCandidates: 0,
    shortlistedCandidates: 0,
    upcomingInterviews: 0
  },
  admin: {
    hrUsers: 0,
    companies: 0,
    jobs: 0,
    candidates: 0
  }
};

export const DASHBOARD_LINKS = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { label: "Jobs", path: "/dashboard/jobs", icon: BriefcaseBusiness },
  { label: "Candidates", path: "/dashboard/candidates", icon: UsersRound },
  { label: "AI Ranking", path: "/dashboard/ai-ranking", icon: BrainCircuit },
  { label: "Shortlisted", path: "/dashboard/candidates/shortlisted", icon: ShieldCheck },
  { label: "Upload Candidate", path: "/dashboard/candidates/upload", icon: Upload },
  { label: "Interviews", path: "/dashboard/interviews", icon: CalendarClock },
  { label: "Interview Calendar", path: "/dashboard/interviews/calendar", icon: CalendarDays },
  { label: "Emails", path: "/dashboard/emails", icon: Mail },
  { label: "Email Templates", path: "/dashboard/email-templates", icon: FileText },
  { label: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
  { label: "Company Settings", path: "/dashboard/company-settings", icon: Settings },
  { label: "Profile", path: "/dashboard/profile", icon: UserCircle },
  { label: "Change Password", path: "/dashboard/change-password", icon: KeyRound }
];

export const ADMIN_LINKS = [
  { label: "Overview", path: "/admin", icon: ShieldCheck },
  { label: "Companies", path: "/admin/companies", icon: Building2 },
  { label: "Users", path: "/admin/users", icon: UsersRound },
  { label: "Audit Logs", path: "/admin/audit-logs", icon: FileText },
  { label: "System Health", path: "/admin/system-health", icon: Activity }
];

export const JOB_STATUSES = ["Draft", "Active", "Closed", "Archived"];
export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"];
export const WORK_MODES = ["On-site", "Remote", "Hybrid"];
export const SALARY_CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED", "Other"];
export const SALARY_PERIODS = ["Yearly", "Monthly", "Hourly", "Project-based"];
export const SCREENING_QUESTION_TYPES = ["text", "textarea", "number", "select", "yes-no"];
export const CANDIDATE_STATUSES = [
  "Applied",
  "Resume Parsed",
  "AI Screening Completed",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Interview Completed",
  "Selected",
  "Rejected",
  "On Hold"
];
export const PHASE_FIVE_HR_STATUSES = ["Applied", "Under Review", "Shortlisted", "Rejected", "On Hold"];
export const CANDIDATE_SOURCES = ["Public Application", "HR Upload", "Referral", "Other"];
export const RESUME_PARSE_STATUSES = ["Not Parsed", "Processing", "Parsed", "Failed", "Needs OCR"];
export const AI_SCREENING_STATUSES = ["Not Screened", "Processing", "Screened", "Failed"];
export const AI_CANDIDATE_CATEGORIES = ["Excellent Match", "Good Match", "Average Match", "Low Match", "Not Suitable"];
export const NOTICE_PERIOD_OPTIONS = [
  "Immediate",
  "15 days",
  "30 days",
  "45 days",
  "60 days",
  "90 days",
  "More than 90 days",
  "Negotiable"
];
export const JOB_SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Deadline: soonest", value: "deadline-asc" },
  { label: "Deadline: latest", value: "deadline-desc" },
  { label: "Title: A-Z", value: "title-asc" },
  { label: "Title: Z-A", value: "title-desc" },
  { label: "Openings: high to low", value: "openings-desc" }
];
export const DEFAULT_JOB_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  status: "",
  department: "",
  employmentType: "",
  workMode: "",
  location: "",
  sort: "newest"
};
export const CANDIDATE_SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Name: A-Z", value: "name-asc" },
  { label: "Name: Z-A", value: "name-desc" },
  { label: "Experience: low to high", value: "experience-asc" },
  { label: "Experience: high to low", value: "experience-desc" },
  { label: "Status", value: "status" },
  { label: "Application ID", value: "application-id" },
  { label: "Highest AI score", value: "score-desc" },
  { label: "Lowest AI score", value: "score-asc" },
  { label: "Category", value: "category" },
  { label: "Recently screened", value: "recently-screened" },
  { label: "Oldest screening", value: "oldest-screening" },
  { label: "Job title", value: "job-title" },
  { label: "Last updated", value: "last-updated" }
];
export const DEFAULT_CANDIDATE_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  jobId: "",
  status: "",
  source: "",
  resumeParseStatus: "",
  aiScreeningStatus: "",
  category: "",
  scoreMin: "",
  scoreMax: "",
  requiredSkill: "",
  missingSkill: "",
  noticePeriod: "",
  appliedFrom: "",
  appliedTo: "",
  hasResume: "",
  hasParsedResume: "",
  hasAiEvaluation: "",
  experienceMin: "",
  experienceMax: "",
  sort: "newest"
};
