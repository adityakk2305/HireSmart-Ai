const ExperienceSection = ({ items = [] }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-bold text-slate-950">Work experience</h2>
    {items.length ? (
      <div className="mt-4 space-y-4">
        {items.map((item, index) => (
          <article key={`${item.company}-${item.jobTitle}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-bold text-slate-950">{item.jobTitle || "Role not found"}</h3>
            <p className="mt-1 text-sm text-slate-600">{item.company || "Company not found"}{item.location ? ` - ${item.location}` : ""}</p>
            <p className="mt-1 text-xs font-semibold uppercase text-slate-500">{[item.startDate, item.endDate || (item.isCurrent ? "Present" : null), item.duration].filter(Boolean).join(" - ") || "Dates not found"}</p>
            {item.responsibilities?.length ? <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">{item.responsibilities.map((entry) => <li key={entry}>{entry}</li>)}</ul> : null}
            {item.achievements?.length ? <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">{item.achievements.map((entry) => <li key={entry}>{entry}</li>)}</ul> : null}
            {item.technologies?.length ? <p className="mt-3 text-sm text-slate-500">Technologies: {item.technologies.join(", ")}</p> : null}
          </article>
        ))}
      </div>
    ) : <p className="mt-3 text-sm text-slate-500">No work experience found in resume.</p>}
  </section>
);

export default ExperienceSection;
