import { useDispatch, useSelector } from "react-redux";
import AnalyticsFilters from "../../components/analytics/AnalyticsFilters.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { fetchRecruiterAnalytics } from "../../features/analytics/analyticsSlice.js";

const RecruiterAnalyticsPage = () => {
  const dispatch = useDispatch();
  const { recruiters } = useSelector((state) => state.analytics);
  return (
    <div>
      <PageHeader title="Recruiter analytics" description="Operational activity summaries for work performed inside HireSmart AI." />
      <AnalyticsFilters onChange={(filters) => dispatch(fetchRecruiterAnalytics(filters))} onExport={() => {}} />
      <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
        These metrics summarize activity inside HireSmart AI and should not be used as the sole measure of employee performance.
      </p>
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead><tr className="text-left text-slate-500"><th className="p-4">Recruiter</th><th>Status updates</th><th>Notes</th><th>Interviews</th><th>Feedback</th><th>Emails</th><th>Jobs</th><th>Last activity</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {(recruiters?.recruiters || []).map((item) => (
                <tr key={item.recruiterId}>
                  <td className="p-4 font-semibold text-slate-950">{item.name}</td>
                  <td>{item.statusChanges}</td>
                  <td>{item.notesAdded}</td>
                  <td>{item.interviewsScheduled}</td>
                  <td>{item.feedbackSubmitted}</td>
                  <td>{item.emailsSent}</td>
                  <td>{item.jobsCreated}</td>
                  <td>{item.lastActivityDate ? new Date(item.lastActivityDate).toLocaleString() : "Not available"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default RecruiterAnalyticsPage;
