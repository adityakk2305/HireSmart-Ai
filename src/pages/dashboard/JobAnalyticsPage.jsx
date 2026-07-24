import { BriefcaseBusiness } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AnalyticsFilters from "../../components/analytics/AnalyticsFilters.jsx";
import ExportAnalyticsModal from "../../components/analytics/ExportAnalyticsModal.jsx";
import MetricCard from "../../components/analytics/MetricCard.jsx";
import Button from "../../components/common/Button.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { fetchJobAnalytics } from "../../features/analytics/analyticsSlice.js";

const JobAnalyticsPage = () => {
  const dispatch = useDispatch();
  const { jobs } = useSelector((state) => state.analytics);
  const [filters, setFilters] = useState({});
  const [exportOpen, setExportOpen] = useState(false);
  const load = (next) => { setFilters(next); dispatch(fetchJobAnalytics({ ...next, sort: "most-applications" })); };
  return (
    <div>
      <PageHeader title="Job analytics" description="Job performance, conversion, interview, and email delivery metrics." />
      <AnalyticsFilters onChange={load} onExport={() => setExportOpen(true)} />
      <MetricCard label="Jobs in report" value={jobs?.pagination?.total || 0} icon={BriefcaseBusiness} />
      <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead><tr className="text-left text-slate-500"><th className="p-4">Job</th><th>Department</th><th>Applications</th><th>Selected</th><th>Avg AI</th><th>Email delivery</th><th></th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {(jobs?.jobs || []).map((job) => (
                <tr key={job.jobId}>
                  <td className="p-4 font-semibold text-slate-950">{job.title}</td>
                  <td>{job.department}</td>
                  <td>{job.totalApplications}</td>
                  <td>{job.selected}</td>
                  <td>{job.averageAiScore}</td>
                  <td>{job.emailDeliveryRate}%</td>
                  <td><Link to={`/dashboard/analytics/jobs/${job.jobId}`}><Button variant="outline" size="sm">Details</Button></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <ExportAnalyticsModal open={exportOpen} onClose={() => setExportOpen(false)} filters={{ ...filters, reportType: "jobs" }} />
    </div>
  );
};

export default JobAnalyticsPage;
