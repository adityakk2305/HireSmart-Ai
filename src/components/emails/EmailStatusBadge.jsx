import { statusClasses } from "../../utils/emailConstants.js";

const EmailStatusBadge = ({ status }) => (
  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusClasses[status] || "border-slate-200 bg-slate-100 text-slate-700"}`}>
    {status || "Unknown"}
  </span>
);

export default EmailStatusBadge;
