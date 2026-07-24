const importanceOrder = { High: 0, Medium: 1, Low: 2 };

const SkillGapAnalysis = ({ evaluation }) => {
  const gaps = [...(evaluation?.skillGaps || [])].sort((a, b) => (importanceOrder[a.importance] ?? 9) - (importanceOrder[b.importance] ?? 9));

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-bold text-slate-950">Skill-gap analysis</h3>
      {gaps.length ? (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["Skill", "Importance", "Evidence", "Recommendation"].map((heading) => (
                  <th key={heading} className="px-3 py-2 text-left text-xs font-bold uppercase text-slate-500">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gaps.map((gap) => (
                <tr key={`${gap.skill}-${gap.importance}`}>
                  <td className="px-3 py-3 font-bold text-slate-900">{gap.skill}</td>
                  <td className="px-3 py-3 text-slate-700">{gap.importance}</td>
                  <td className="px-3 py-3 text-slate-600">{gap.evidence}</td>
                  <td className="px-3 py-3 text-slate-600">{gap.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="mt-3 text-sm text-slate-500">No required skill gaps were generated.</p>}
    </section>
  );
};

export default SkillGapAnalysis;
