const RequiredSkillsAnalysis = ({ evaluation }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="text-base font-bold text-slate-950">Required skills analysis</h3>
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <div>
        <p className="text-sm font-bold text-emerald-700">Found</p>
        <div className="mt-2 space-y-2">
          {(evaluation?.requiredSkillsFound || []).length ? evaluation.requiredSkillsFound.map((item) => (
            <div key={`${item.skill}-${item.source}`} className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm">
              <p className="font-bold text-emerald-900">{item.skill}</p>
              <p className="mt-1 text-emerald-800">{item.evidence || "Matched in parsed resume"} {item.source ? `(${item.source})` : ""}</p>
            </div>
          )) : <p className="text-sm text-slate-500">No required skills were matched.</p>}
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-amber-700">Missing or unclear</p>
        <div className="mt-2 space-y-2">
          {(evaluation?.requiredSkillsMissing || []).length ? evaluation.requiredSkillsMissing.map((item) => (
            <div key={item.skill} className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
              <p className="font-bold text-amber-900">{item.skill}</p>
              <p className="mt-1 text-amber-800">No matching parsed resume evidence found.</p>
            </div>
          )) : <p className="text-sm text-slate-500">No missing required skills detected.</p>}
        </div>
      </div>
    </div>
  </section>
);

export default RequiredSkillsAnalysis;
