const AchievementsSection = ({ achievements = [], languages = [] }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-bold text-slate-950">Achievements and languages</h2>
    <div className="mt-4 grid gap-5 md:grid-cols-2">
      <div>
        <h3 className="text-sm font-bold text-slate-800">Achievements</h3>
        {achievements.length ? (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
            {achievements.map((item, index) => <li key={`${item.title}-${index}`}>{[item.title, item.description, item.date].filter(Boolean).join(" - ")}</li>)}
          </ul>
        ) : <p className="mt-2 text-sm text-slate-500">No achievements found.</p>}
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-800">Languages</h3>
        {languages.length ? <p className="mt-3 text-sm text-slate-600">{languages.join(", ")}</p> : <p className="mt-2 text-sm text-slate-500">No languages found.</p>}
      </div>
    </div>
  </section>
);

export default AchievementsSection;
