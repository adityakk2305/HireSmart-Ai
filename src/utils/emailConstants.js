export const EMAIL_TEMPLATE_CATEGORIES = [
  "Interview Invitation",
  "Interview Reminder",
  "Interview Rescheduled",
  "Interview Cancelled",
  "Shortlisted",
  "Rejected",
  "Selected",
  "On Hold",
  "Follow Up",
  "Custom"
];

export const EMAIL_TYPES = [
  "Manual",
  "Interview Invitation",
  "Interview Reminder",
  "Interview Rescheduled",
  "Interview Cancelled",
  "Shortlisted",
  "Rejected",
  "Selected",
  "On Hold",
  "Follow Up",
  "Test Email",
  "Custom"
];

export const EMAIL_LOG_STATUSES = ["Pending", "Processing", "Sent", "Failed", "Cancelled", "Skipped"];
export const EMAIL_PROVIDERS = ["mock", "smtp"];

export const EMAIL_VARIABLE_GROUPS = {
  Candidate: ["candidateName", "candidateFirstName", "candidateEmail", "applicationId", "candidateStatus"],
  Job: ["jobTitle", "department", "jobLocation", "employmentType", "workMode"],
  Company: ["companyName", "companyWebsite", "companyAddress", "senderName", "replyToEmail"],
  Interview: [
    "interviewTitle",
    "interviewRound",
    "interviewType",
    "interviewMode",
    "interviewDate",
    "interviewStartTime",
    "interviewEndTime",
    "interviewDuration",
    "interviewTimezone",
    "meetingLink",
    "interviewLocation",
    "interviewerNames",
    "interviewInstructions",
    "interviewAgenda"
  ],
  Links: ["frontendUrl", "applicationStatusUrl"]
};

export const DEFAULT_EMAIL_LOG_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  status: "",
  emailType: "",
  provider: "",
  candidateId: "",
  interviewId: "",
  dateFrom: "",
  dateTo: "",
  sort: "newest"
};

export const statusClasses = {
  Pending: "bg-amber-50 text-amber-800 border-amber-200",
  Processing: "bg-blue-50 text-blue-800 border-blue-200",
  Sent: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Failed: "bg-red-50 text-red-800 border-red-200",
  Cancelled: "bg-slate-100 text-slate-700 border-slate-200",
  Skipped: "bg-purple-50 text-purple-800 border-purple-200"
};
