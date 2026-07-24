const SkillGroup = ({ title, skills = [] }) => (
  <div>
    <h3 className="text-sm font-bold text-slate-800">{title}</h3>
    {skills.length ? (
      <div className="mt-3 flex flex-wrap gap-2">
        {Array.from(new Set(skills.map((skill) => skill.trim()).filter(Boolean))).map((skill) => (
          <span key={skill} className="max-w-full rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{skill}</span>
        ))}
      </div>
    ) : (
      <p className="mt-2 text-sm text-slate-500">No skills found in resume.</p>
    )}
  </div>
);

const SkillsSection = ({ parsedResume = {} }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-bold text-slate-950">Skills</h2>
    <div className="mt-4 space-y-5">
      <SkillGroup title="All skills" skills={parsedResume.skills} />
      <SkillGroup title="Technical skills" skills={parsedResume.technicalSkills} />
      <SkillGroup title="Soft skills" skills={parsedResume.softSkills} />
    </div>
  </section>
);

export default SkillsSection;
