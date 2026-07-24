import { CalendarClock } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AnalyticsFilters from "../../components/analytics/AnalyticsFilters.jsx";
import MetricCard from "../../components/analytics/MetricCard.jsx";
import SimpleBarList from "../../components/analytics/SimpleBarList.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { fetchInterviewAnalytics, fetchInterviewerAnalytics } from "../../features/analytics/analyticsSlice.js";

const InterviewAnalyticsPage = () => {
  const dispatch = useDispatch();
  const { interviews, interviewers } = useSelector((state) => state.analytics);
  const [filters, setFilters] = useState({});
  const load = (next) => { setFilters(next); dispatch(fetchInterviewAnalytics(next)); dispatch(fetchInterviewerAnalytics(next)); };
  return (
    <div>
      <PageHeader title="Interview analytics" description="Interview scheduling, completion, feedback, recommendations, and interviewer activity." />
      <AnalyticsFilters onChange={load} onExport={() => {}} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total interviews" value={interviews?.totalScheduled || 0} icon={CalendarClock} />
        <MetricCard label="Completion rate" value={`${interviews?.completionRate || 0}%`} />
        <MetricCard label="Cancellation rate" value={`${interviews?.cancellationRate || 0}%`} />
        <MetricCard label="No-show rate" value={`${interviews?.noShowRate || 0}%`} />
        <MetricCard label="Average rating" value={interviews?.averageRating || 0} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <SimpleBarList title="Interview type" items={interviews?.interviewsByType || []} />
        <SimpleBarList title="Interview mode" items={interviews?.interviewsByMode || []} />
        <SimpleBarList title="Interview round" items={interviews?.interviewsByRound || []} />
        <SimpleBarList title="Recommendations" items={interviews?.recommendationsDistribution || []} />
      </div>
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-950">Interviewer table</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead><tr className="text-left text-slate-500"><th className="py-2">Interviewer</th><th>Assigned</th><th>Completed</th><th>Feedback</th><th>Avg rating</th><th>Upcoming</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {(interviewers?.interviewers || []).map((item) => (
                <tr key={item.interviewerId || item.name}><td className="py-3 font-semibold">{item.name}</td><td>{item.totalAssignedInterviews}</td><td>{item.completedInterviews}</td><td>{item.feedbackSubmitted}</td><td>{item.averageCandidateRating}</td><td>{item.upcomingInterviewCount}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default InterviewAnalyticsPage;
