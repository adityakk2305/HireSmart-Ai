const statusClasses = {
  Applied: "bg-blue-50 text-blue-700",
  "Under Review": "bg-amber-50 text-amber-700",
  Shortlisted: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-700",
  "On Hold": "bg-slate-100 text-slate-700",
  Selected: "bg-green-50 text-green-700",
  "Interview Scheduled": "bg-indigo-50 text-indigo-700",
  "Interview Completed": "bg-violet-50 text-violet-700",
  "Resume Parsed": "bg-cyan-50 text-cyan-700",
  "AI Screening Completed": "bg-purple-50 text-purple-700"
};

const CandidateStatusBadge = ({ status }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusClasses[status] || "bg-slate-100 text-slate-700"}`}>
    {status}
  </span>
);

export default CandidateStatusBadge;
