import { isDeadlineExpired } from "../../utils/isDeadlineExpired.js";

const classes = {
  Draft: "border-slate-200 bg-slate-50 text-slate-700",
  Active: "border-green-200 bg-green-50 text-green-700",
  Closed: "border-amber-200 bg-amber-50 text-amber-700",
  Archived: "border-red-200 bg-red-50 text-red-700",
  Expired: "border-orange-200 bg-orange-50 text-orange-700"
};

const JobStatusBadge = ({ status, deadline }) => {
  const label = status === "Active" && isDeadlineExpired(deadline) ? "Expired" : status;

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${classes[label] || classes.Draft}`}>
      {label}
    </span>
  );
};

export default JobStatusBadge;
