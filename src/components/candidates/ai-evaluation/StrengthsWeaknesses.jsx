const ListPanel = ({ title, items, tone }) => (
  <div>
    <p className={`text-sm font-bold ${tone === "positive" ? "text-emerald-700" : "text-amber-700"}`}>{title}</p>
    <ul className="mt-2 space-y-2">
      {items?.length ? items.map((item) => (
        <li key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{item}</li>
      )) : <li className="text-sm text-slate-500">No items generated.</li>}
    </ul>
  </div>
);

const StrengthsWeaknesses = ({ evaluation }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="text-base font-bold text-slate-950">Strengths and weaknesses</h3>
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <ListPanel title="Strengths" items={evaluation?.strengths || []} tone="positive" />
      <ListPanel title="Weaknesses" items={evaluation?.weaknesses || []} tone="warning" />
    </div>
  </section>
);

export default StrengthsWeaknesses;
