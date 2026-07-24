const formatValue = (value) => {
  if (value === null || value === undefined) return "Not available";
  if (typeof value === "number") return Number.isInteger(value) ? value.toLocaleString() : value.toFixed(2);
  return value;
};

const MetricCard = ({ label, value, metric, icon: Icon, note }) => {
  const display = metric ? metric.value : value;
  const direction = metric?.direction;
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{formatValue(display)}</p>
        </div>
        {Icon ? (
          <span className="rounded-lg bg-blue-50 p-3 text-blue-600">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      {metric?.direction && direction !== "unavailable" ? (
        <p className={`mt-4 text-xs font-semibold ${direction === "up" ? "text-emerald-700" : direction === "down" ? "text-rose-700" : "text-slate-500"}`}>
          {direction === "unchanged" ? "No change" : `${metric.changePercent}% ${direction}`} vs previous period
        </p>
      ) : (
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">{note || "Live metric"}</p>
      )}
    </article>
  );
};

export default MetricCard;
