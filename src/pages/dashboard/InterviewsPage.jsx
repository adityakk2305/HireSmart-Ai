import { CalendarDays, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import CancelInterviewModal from "../../components/interviews/CancelInterviewModal.jsx";
import InterviewFilters from "../../components/interviews/InterviewFilters.jsx";
import InterviewMobileCard from "../../components/interviews/InterviewMobileCard.jsx";
import InterviewTable from "../../components/interviews/InterviewTable.jsx";
import RescheduleInterviewModal from "../../components/interviews/RescheduleInterviewModal.jsx";
import { sendInterviewCancelled, sendInterviewRescheduled } from "../../features/emails/emailSlice.js";
import {
  cancelInterview,
  changeInterviewStatus,
  completeInterview,
  fetchInterviewSummary,
  fetchInterviews,
  generateQuestions,
  resetInterviewFilters,
  rescheduleInterview,
  setInterviewFilters
} from "../../features/interviews/interviewSlice.js";

const SummaryCard = ({ label, value }) => (
  <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-sm font-semibold text-slate-500">{label}</p>
    <p className="mt-2 text-2xl font-bold text-slate-950">{value ?? 0}</p>
  </article>
);

const InterviewsPage = () => {
  const dispatch = useDispatch();
  const { interviews, summary, pagination, filters, loading, rescheduling, cancelling, completing, generatingQuestions, error } = useSelector((state) => state.interviews);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchInterviews(filters));
    dispatch(fetchInterviewSummary());
  }, [dispatch, filters]);

  const reload = () => {
    dispatch(fetchInterviews(filters));
    dispatch(fetchInterviewSummary());
  };

  const handleReschedule = async (payload) => {
    try {
      const notifyCandidate = payload.notifyCandidate;
      const { notifyCandidate: _notify, ...reschedulePayload } = payload;
      await dispatch(rescheduleInterview({ id: rescheduleTarget.id, payload: reschedulePayload })).unwrap();
      toast.success("Interview rescheduled");
      if (notifyCandidate) {
        try {
          await dispatch(sendInterviewRescheduled({ interviewId: rescheduleTarget.id })).unwrap();
          toast.success("Reschedule email processed");
        } catch (emailError) {
          toast.error(emailError || "Interview rescheduled, but email failed");
        }
      }
      setRescheduleTarget(null);
      reload();
    } catch (apiError) {
      toast.error(apiError || "Unable to reschedule interview");
    }
  };

  const handleCancel = async (payload) => {
    try {
      const reason = typeof payload === "string" ? payload : payload.reason;
      const notifyCandidate = typeof payload === "object" && payload.notifyCandidate;
      await dispatch(cancelInterview({ id: cancelTarget.id, reason })).unwrap();
      toast.success("Interview cancelled");
      if (notifyCandidate) {
        try {
          await dispatch(sendInterviewCancelled({ interviewId: cancelTarget.id })).unwrap();
          toast.success("Cancellation email processed");
        } catch (emailError) {
          toast.error(emailError || "Interview cancelled, but email failed");
        }
      }
      setCancelTarget(null);
      reload();
    } catch (apiError) {
      toast.error(apiError || "Unable to cancel interview");
    }
  };

  const action = async (promise, message) => {
    try {
      await promise.unwrap();
      toast.success(message);
      reload();
    } catch (apiError) {
      toast.error(apiError || "Interview action failed");
    }
  };

  return (
    <div>
      <PageHeader
        title="Interviews"
        description="Schedule, manage, evaluate and complete company-scoped candidate interviews."
        action={<div className="flex gap-2"><Link to="/dashboard/interviews/calendar"><Button variant="outline" icon={CalendarDays}>Calendar</Button></Link><Link to="/dashboard/interviews/schedule"><Button icon={Plus}>Schedule Interview</Button></Link></div>}
      />
      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <SummaryCard label="Today" value={summary?.today} />
        <SummaryCard label="Upcoming" value={summary?.upcoming} />
        <SummaryCard label="Scheduled" value={summary?.scheduled} />
        <SummaryCard label="Completed" value={summary?.completed} />
        <SummaryCard label="Cancelled" value={summary?.cancelled} />
        <SummaryCard label="Avg rating" value={summary?.averageRating || "-"} />
      </div>
      <InterviewFilters filters={filters} onChange={(next) => dispatch(setInterviewFilters(next))} onReset={() => dispatch(resetInterviewFilters())} />
      {error ? <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div> : null}
      {interviews.length ? (
        <>
          <InterviewTable
            interviews={interviews}
            onReschedule={setRescheduleTarget}
            onCancel={setCancelTarget}
            onProgress={(interview) => action(dispatch(changeInterviewStatus({ id: interview.id, status: "In Progress" })), "Interview marked in progress")}
            onComplete={(interview) => action(dispatch(completeInterview(interview.id)), "Interview completed")}
            onGenerate={(interview) => action(dispatch(generateQuestions({ id: interview.id, payload: { count: 8, difficulty: "Medium" } })), "Questions generated")}
          />
          <div className="grid gap-4 lg:hidden">
            {interviews.map((interview) => <InterviewMobileCard key={interview.id} interview={interview} />)}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <span>Page {pagination.page} of {pagination.pages}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={!pagination.hasPreviousPage || loading} onClick={() => dispatch(setInterviewFilters({ page: pagination.page - 1 }))}>Previous</Button>
              <Button size="sm" variant="outline" disabled={!pagination.hasNextPage || loading} onClick={() => dispatch(setInterviewFilters({ page: pagination.page + 1 }))}>Next</Button>
            </div>
          </div>
        </>
      ) : <EmptyState title="No interviews found" description="Schedule an interview for a shortlisted candidate to start the interview workflow." action={<Link to="/dashboard/interviews/schedule"><Button>Schedule Interview</Button></Link>} />}
      <RescheduleInterviewModal open={Boolean(rescheduleTarget)} interview={rescheduleTarget} loading={rescheduling} onCancel={() => setRescheduleTarget(null)} onSubmit={handleReschedule} />
      <CancelInterviewModal open={Boolean(cancelTarget)} interview={cancelTarget} loading={cancelling || completing || generatingQuestions} onCancel={() => setCancelTarget(null)} onSubmit={handleCancel} />
    </div>
  );
};

export default InterviewsPage;
