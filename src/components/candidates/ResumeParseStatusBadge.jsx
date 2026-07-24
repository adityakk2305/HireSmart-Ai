const statusClasses = {
  "Not Parsed": "bg-slate-100 text-slate-700",
  Processing: "bg-amber-50 text-amber-700",
  Parsed: "bg-emerald-50 text-emerald-700",
  Failed: "bg-red-50 text-red-700",
  "Needs OCR": "bg-orange-50 text-orange-700"
};

const ResumeParseStatusBadge = ({ status = "Not Parsed" }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusClasses[status] || statusClasses["Not Parsed"]}`}>
    {status}
  </span>
);

export default ResumeParseStatusBadge;
