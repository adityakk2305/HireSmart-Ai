const items = [
  ["Required skills", "skillsScore", "40%"],
  ["Experience", "experienceScore", "25%"],
  ["Education", "educationScore", "10%"],
  ["Projects", "projectScore", "15%"],
  ["Preferred skills", "preferredSkillsScore", "10%"]
];

const ScoreBreakdown = ({ evaluation }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="text-base font-bold text-slate-950">Score breakdown</h3>
    <div className="mt-4 space-y-4">
      {items.map(([label, key, weight]) => (
        <div key={key}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-slate-700">{label}</span>
            <span className="font-bold text-slate-900">{evaluation?.[key] ?? 0}/100 - {weight}</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-blue-600" style={{ width: `${Math.min(100, evaluation?.[key] || 0)}%` }} />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ScoreBreakdown;
