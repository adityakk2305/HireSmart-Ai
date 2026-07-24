import { BrainCircuit, UsersRound } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AnalyticsFilters from "../../components/analytics/AnalyticsFilters.jsx";
import ExportAnalyticsModal from "../../components/analytics/ExportAnalyticsModal.jsx";
import MetricCard from "../../components/analytics/MetricCard.jsx";
import SimpleBarList from "../../components/analytics/SimpleBarList.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { fetchAiScreeningAnalytics, fetchCandidateAnalytics, fetchHiringFunnel } from "../../features/analytics/analyticsSlice.js";

const CandidateAnalyticsPage = () => {
  const dispatch = useDispatch();
  const { candidates, aiScreening, funnel } = useSelector((state) => state.analytics);
  const [filters, setFilters] = useState({});
  const [exportOpen, setExportOpen] = useState(false);
  const load = (next) => {
    setFilters(next);
    dispatch(fetchCandidateAnalytics(next));
    dispatch(fetchAiScreeningAnalytics(next));
    dispatch(fetchHiringFunnel(next));
  };
  return (
    <div>
      <PageHeader title="Candidate analytics" description="Aggregate candidate, funnel, resume parsing, and AI screening analytics." />
      <AnalyticsFilters onChange={load} onExport={() => setExportOpen(true)} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Applications" value={candidates?.totalApplications || 0} icon={UsersRound} />
        <MetricCard label="Avg AI score" value={candidates?.averageAiScore || 0} icon={BrainCircuit} />
        <MetricCard label="Screening completion" value={`${aiScreening?.screeningCompletionRate || 0}%`} icon={BrainCircuit} />
        <MetricCard label="Funnel conversion" value={`${funnel?.overallConversionRate || 0}%`} icon={UsersRound} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <SimpleBarList title="Historical funnel progression" items={funnel?.historicalProgression || []} labelKey="stage" valueKey="count" />
        <SimpleBarList title="AI score distribution" items={candidates?.scoreDistribution || []} />
        <SimpleBarList title="Resume parse status" items={candidates?.resumeParsingStatusDistribution || []} />
        <SimpleBarList title="AI categories" items={candidates?.aiCategoryDistribution || []} />
        <SimpleBarList title="Required skills found" items={candidates?.topRequiredSkillsFound || []} labelKey="skill" />
        <SimpleBarList title="Missing required skills" items={candidates?.topMissingRequiredSkills || []} labelKey="skill" />
      </div>
      <ExportAnalyticsModal open={exportOpen} onClose={() => setExportOpen(false)} filters={{ ...filters, reportType: "candidates" }} />
    </div>
  );
};

export default CandidateAnalyticsPage;
