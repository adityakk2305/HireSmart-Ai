const statusClasses = {
  "Not Screened": "bg-slate-100 text-slate-700 ring-slate-200",
  Processing: "bg-blue-50 text-blue-700 ring-blue-200",
  Screened: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Failed: "bg-red-50 text-red-700 ring-red-200"
};

const AiScreeningStatusBadge = ({ status = "Not Screened" }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusClasses[status] || statusClasses["Not Screened"]}`}>
    {status}
  </span>
);

export default AiScreeningStatusBadge;
