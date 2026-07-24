const normalize = (value = "") => String(value || "").toLowerCase().replace(/\s+/g, "").trim();

const rows = [
  ["Name", "fullName", "fullName"],
  ["Email", "email", "email"],
  ["Phone", "phone", "phone"],
  ["Location", "location", "location"],
  ["Total experience", "totalExperience", "totalExperience"],
  ["LinkedIn", "linkedinUrl", "linkedin"],
  ["GitHub", "githubUrl", "github"],
  ["Portfolio", "portfolioUrl", "portfolio"]
];

const SubmittedVsParsedComparison = ({ candidate = {}, parsedResume = {} }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-bold text-slate-950">Submitted information vs Resume information</h2>
    <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {["Field", "Submitted", "Resume", "Review"].map((heading) => <th key={heading} className="px-3 py-2 text-left text-xs font-bold uppercase text-slate-500">{heading}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map(([label, candidateKey, parsedKey]) => {
            const submitted = candidate[candidateKey] || "";
            const parsed = parsedResume[parsedKey] || "";
            const mismatch = submitted && parsed && normalize(submitted) !== normalize(parsed);
            return (
              <tr key={label}>
                <td className="px-3 py-3 font-semibold text-slate-800">{label}</td>
                <td className="px-3 py-3 text-slate-600">{submitted || "Not provided"}</td>
                <td className="px-3 py-3 text-slate-600">{parsed || "Not found in resume"}</td>
                <td className="px-3 py-3 text-sm font-semibold">{mismatch ? <span className="text-amber-700">Review suggested</span> : <span className="text-slate-400">No issue</span>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </section>
);

export default SubmittedVsParsedComparison;
