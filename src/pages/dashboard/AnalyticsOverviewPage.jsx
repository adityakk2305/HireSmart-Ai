import { BarChart3, BriefcaseBusiness, CalendarClock, Mail, UsersRound } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AnalyticsFilters from "../../components/analytics/AnalyticsFilters.jsx";
import ExportAnalyticsModal from "../../components/analytics/ExportAnalyticsModal.jsx";
import InsightList from "../../components/analytics/InsightList.jsx";
import MetricCard from "../../components/analytics/MetricCard.jsx";
import SimpleBarList from "../../components/analytics/SimpleBarList.jsx";
import Button from "../../components/common/Button.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import useCompany from "../../hooks/useCompany.js";
import { fetchAnalyticsOverview } from "../../features/analytics/analyticsSlice.js";

const AnalyticsOverviewPage = () => {
  const dispatch = useDispatch();
  const { company } = useCompany();
  const { overview, loading } = useSelector((state) => state.analytics);
  const [filters, setFilters] = useState({});
  const [exportOpen, setExportOpen] = useState(false);

  const load = (next) => {
    setFilters(next);
    dispatch(fetchAnalyticsOverview(next));
  };

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Company-scoped hiring analytics, reporting, and deterministic operational insights."
        action={<Button variant="outline" onClick={() => setExportOpen(true)}>Export</Button>}
      />
      <div className="hidden print:block">
        <h1 className="text-2xl font-bold">{company?.name} analytics report</h1>
        <p className="text-sm text-slate-600">Generated {new Date().toLocaleString()}</p>
      </div>
      <AnalyticsFilters onChange={load} onExport={() => setExportOpen(true)} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="New applications" metric={overview?.newApplications} icon={UsersRound} />
        <MetricCard label="Active jobs" metric={overview?.activeJobs} icon={BriefcaseBusiness} />
        <MetricCard label="Interviews scheduled" metric={overview?.interviewsScheduled} icon={CalendarClock} />
        <MetricCard label="Email delivery rate" metric={overview?.emailDeliveryRate} icon={Mail} />
        <MetricCard label="Average AI score" metric={overview?.averageAiScore} icon={BarChart3} />
        <MetricCard label="Selected" metric={overview?.selectedCandidates} icon={UsersRound} />
        <MetricCard label="Rejected" metric={overview?.rejectedCandidates} icon={UsersRound} />
        <MetricCard label="Time to hire hours" value={overview?.timeToHire?.averageHours ?? "Not available"} icon={CalendarClock} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <SimpleBarList title="Current status distribution" items={overview?.candidateStatusDistribution || []} />
        <SimpleBarList title="Candidate sources" items={overview?.candidateSourceDistribution || []} labelKey="source" valueKey="applications" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-950">Top-performing jobs</h2>
            <Link to="/dashboard/analytics/jobs"><Button variant="outline" size="sm">View jobs</Button></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead><tr className="text-left text-slate-500"><th className="py-2">Job</th><th>Applications</th><th>Selected</th><th>Avg score</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {(overview?.topPerformingJobs || []).map((job) => (
                  <tr key={job.jobId}><td className="py-3 font-semibold">{job.title}</td><td>{job.totalApplications}</td><td>{job.selected}</td><td>{job.averageAiScore}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <InsightList insights={overview?.insights || []} />
      </div>
      {loading ? <p className="mt-4 text-sm font-semibold text-slate-500">Refreshing analytics...</p> : null}
      <ExportAnalyticsModal open={exportOpen} onClose={() => setExportOpen(false)} filters={filters} />
    </div>
  );
};

export default AnalyticsOverviewPage;
