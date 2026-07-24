const EducationSection = ({ items = [] }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-bold text-slate-950">Education</h2>
    {items.length ? (
      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <article key={`${item.institution}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-bold text-slate-950">{item.degree || "Degree not found"}</h3>
            <p className="mt-1 text-sm text-slate-600">{item.institution || "Institution not found"}</p>
            <p className="mt-1 text-sm text-slate-500">{[item.fieldOfStudy, item.grade, item.location].filter(Boolean).join(" - ")}</p>
            <p className="mt-1 text-xs font-semibold uppercase text-slate-500">{[item.startDate, item.endDate].filter(Boolean).join(" - ") || "Dates not found"}</p>
            {item.description ? <p className="mt-2 text-sm text-slate-600">{item.description}</p> : null}
          </article>
        ))}
      </div>
    ) : <p className="mt-3 text-sm text-slate-500">No education found in resume.</p>}
  </section>
);

export default EducationSection;
