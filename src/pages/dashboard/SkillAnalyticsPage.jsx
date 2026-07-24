import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AnalyticsFilters from "../../components/analytics/AnalyticsFilters.jsx";
import SimpleBarList from "../../components/analytics/SimpleBarList.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { fetchSkillAnalytics } from "../../features/analytics/analyticsSlice.js";

const SkillAnalyticsPage = () => {
  const dispatch = useDispatch();
  const { skills } = useSelector((state) => state.analytics);
  const [filters, setFilters] = useState({});
  const load = (next) => { setFilters(next); dispatch(fetchSkillAnalytics(next)); };
  return (
    <div>
      <PageHeader title="Skill analytics" description="Normalized skill demand, candidate availability, and skill-gap analytics." />
      <AnalyticsFilters onChange={load} onExport={() => {}} />
      <div className="grid gap-6 xl:grid-cols-2">
        <SimpleBarList title="Most requested skills" items={skills?.mostRequestedSkills || []} labelKey="skill" />
        <SimpleBarList title="Most available candidate skills" items={skills?.mostCommonlyFoundCandidateSkills || []} labelKey="skill" />
        <SimpleBarList title="Most missing required skills" items={skills?.mostCommonlyMissingRequiredSkills || []} labelKey="skill" />
        <SimpleBarList title="Preferred skills found" items={skills?.preferredSkillsFound || []} labelKey="skill" />
      </div>
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-950">Demand versus availability</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead><tr className="text-left text-slate-500"><th className="py-2">Skill</th><th>Requested</th><th>Available</th><th>Gap</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {(skills?.demandVersusAvailability || []).map((item) => (
                <tr key={item.skill}><td className="py-3 font-semibold">{item.skill}</td><td>{item.requested}</td><td>{item.available}</td><td>{item.skillGapPercentage}%</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <p className="mt-3 text-xs text-slate-500">Filters active: {filters.department || "all departments"}</p>
    </div>
  );
};

export default SkillAnalyticsPage;
