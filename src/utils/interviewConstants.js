export const INTERVIEW_ROUNDS = ["Screening Round", "Technical Round 1", "Technical Round 2", "Managerial Round", "HR Round", "Final Round", "Custom"];
export const INTERVIEW_TYPES = ["Screening", "Technical", "Coding", "System Design", "Managerial", "HR", "Culture Fit", "Final", "Other"];
export const INTERVIEW_MODES = ["Video", "Phone", "In Person"];
export const INTERVIEW_STATUSES = ["Scheduled", "Rescheduled", "In Progress", "Completed", "Cancelled", "No Show"];
export const INTERVIEW_DURATIONS = [15, 30, 45, 60, 90, 120];
export const INTERVIEW_RECOMMENDATIONS = ["Strong Hire", "Hire", "Further Review", "No Hire", "Strong No Hire"];
export const QUESTION_CATEGORIES = ["Technical", "Behavioral", "Experience", "Project", "Problem Solving", "System Design", "HR", "Culture Fit", "Other"];
export const QUESTION_DIFFICULTIES = ["Easy", "Medium", "Hard"];
export const TIMEZONES = ["Asia/Kolkata", "UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Singapore", "Asia/Dubai", "Australia/Sydney"];

export const DEFAULT_INTERVIEW_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  jobId: "",
  candidateId: "",
  status: "",
  interviewType: "",
  interviewMode: "",
  interviewerId: "",
  dateFrom: "",
  dateTo: "",
  upcomingOnly: false,
  todayOnly: false,
  overdueOnly: false,
  sort: "soonest"
};

export const formatInterviewDateTime = (startTime, timezone = "Asia/Kolkata") => {
  if (!startTime) return "Not scheduled";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone
  }).format(new Date(startTime));
};
