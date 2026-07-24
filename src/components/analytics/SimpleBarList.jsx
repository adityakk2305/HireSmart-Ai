const SimpleBarList = ({ title, items = [], labelKey = "label", valueKey = "count", empty = "No data available" }) => {
  const max = Math.max(...items.map((item) => Number(item[valueKey] || 0)), 0);
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-slate-950">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.length ? items.map((item) => {
          const value = Number(item[valueKey] || 0);
          const width = max ? `${Math.max((value / max) * 100, 4)}%` : "4%";
          return (
            <div key={`${item[labelKey]}-${value}`}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-semibold text-slate-700">{item[labelKey] || "Not available"}</span>
                <span className="font-bold text-slate-950">{value.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100" aria-label={`${item[labelKey]} ${value}`}>
                <div className="h-2 rounded-full bg-blue-600" style={{ width }} />
              </div>
            </div>
          );
        }) : <p className="text-sm text-slate-500">{empty}</p>}
      </div>
    </section>
  );
};

export default SimpleBarList;
