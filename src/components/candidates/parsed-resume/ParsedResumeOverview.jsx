const value = (item) => item || "Not found in resume";

const ParsedResumeOverview = ({ parsedResume = {} }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-bold text-slate-950">Parsed resume overview</h2>
    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        ["Name", parsedResume.fullName],
        ["Email", parsedResume.email],
        ["Phone", parsedResume.phone],
        ["Location", parsedResume.location],
        ["Total experience", parsedResume.totalExperience],
        ["LinkedIn", parsedResume.linkedin],
        ["GitHub", parsedResume.github],
        ["Portfolio", parsedResume.portfolio]
      ].map(([label, item]) => (
        <div key={label}>
          <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
          <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value(item)}</p>
        </div>
      ))}
    </div>
    {parsedResume.professionalSummary ? <p className="mt-5 text-sm leading-6 text-slate-600">{parsedResume.professionalSummary}</p> : null}
  </section>
);

export default ParsedResumeOverview;
