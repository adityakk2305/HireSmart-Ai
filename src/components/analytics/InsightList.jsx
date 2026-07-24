const InsightList = ({ insights = [] }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="text-base font-bold text-slate-950">Insights</h2>
    <div className="mt-4 space-y-2">
      {insights.length ? insights.map((insight, index) => (
        <p key={`${insight.message}-${index}`} className="rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-700">
          <span className="mr-2 uppercase text-slate-400">{insight.severity}</span>
          {insight.message}
        </p>
      )) : <p className="text-sm text-slate-500">No insights available for this range.</p>}
    </div>
  </section>
);

export default InsightList;
