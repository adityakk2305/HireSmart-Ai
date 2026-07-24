const ProjectsSection = ({ items = [] }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-bold text-slate-950">Projects</h2>
    {items.length ? (
      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <article key={`${item.name}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-bold text-slate-950">{item.name || "Project name not found"}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.description || "No description found."}</p>
            {item.role ? <p className="mt-2 text-sm text-slate-500">Role: {item.role}</p> : null}
            {item.technologies?.length ? <p className="mt-2 text-sm text-slate-500">Technologies: {item.technologies.join(", ")}</p> : null}
            {item.url ? <p className="mt-2 break-all text-sm text-blue-700">{item.url}</p> : null}
          </article>
        ))}
      </div>
    ) : <p className="mt-3 text-sm text-slate-500">No projects found in resume.</p>}
  </section>
);

export default ProjectsSection;
