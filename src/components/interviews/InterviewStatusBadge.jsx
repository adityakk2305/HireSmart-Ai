const colors = {
  Scheduled: "bg-blue-50 text-blue-700",
  Rescheduled: "bg-indigo-50 text-indigo-700",
  "In Progress": "bg-amber-50 text-amber-700",
  Completed: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
  "No Show": "bg-slate-100 text-slate-700"
};

const InterviewStatusBadge = ({ status }) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${colors[status] || "bg-slate-100 text-slate-700"}`}>
    {status || "Unknown"}
  </span>
);

export default InterviewStatusBadge;
