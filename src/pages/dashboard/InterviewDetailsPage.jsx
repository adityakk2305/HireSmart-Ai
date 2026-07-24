import { ArrowLeft, CheckCircle2, ExternalLink, Mail, MessageSquareText, Pencil, PlayCircle, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";
import InterviewQuestionsPanel from "../../components/interviews/InterviewQuestionsPanel.jsx";
import InterviewStatusBadge from "../../components/interviews/InterviewStatusBadge.jsx";
import { fetchEmailLogs, sendInterviewCancelled, sendInterviewInvitation, sendInterviewReminder, sendInterviewRescheduled } from "../../features/emails/emailSlice.js";
import { changeInterviewStatus, completeInterview, fetchInterviewById, generateQuestions } from "../../features/interviews/interviewSlice.js";
import { formatInterviewDateTime } from "../../utils/interviewConstants.js";

const Detail = ({ label, value }) => <div><p className="text-xs font-bold uppercase text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value || "-"}</p></div>;

const InterviewDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedInterview: interview, detailsLoading, updating, completing, generatingQuestions, error } = useSelector((state) => state.interviews);
  const { logs: emailLogs, sending: emailSending } = useSelector((state) => state.emails);

  useEffect(() => {
    dispatch(fetchInterviewById(id));
    dispatch(fetchEmailLogs({ interviewId: id, limit: 10 }));
  }, [dispatch, id]);

  const action = async (promise, message) => {
    try {
      await promise.unwrap();
      toast.success(message);
      dispatch(fetchInterviewById(id));
    } catch (apiError) {
      toast.error(apiError || "Interview action failed");
    }
  };

  const emailAction = async (promise, message) => {
    try {
      const result = await promise.unwrap();
      toast.success(result.duplicate ? "Duplicate email skipped" : message);
      dispatch(fetchEmailLogs({ interviewId: id, limit: 10 }));
    } catch (apiError) {
      toast.error(apiError || "Email action failed");
    }
  };

  if (detailsLoading) return <PageLoader message="Loading interview" />;
  if (!interview) return <EmptyState title="Interview not found" description={error || "You may not have access to this interview."} action={<Link to="/dashboard/interviews"><Button variant="outline">Back</Button></Link>} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={interview.title}
        description={`${interview.candidate?.fullName} - ${interview.job?.title}`}
        action={<div className="flex flex-wrap gap-2"><Link to="/dashboard/interviews"><Button variant="outline" icon={ArrowLeft}>Back</Button></Link><Link to={`/dashboard/interviews/${id}/edit`}><Button variant="outline" icon={Pencil}>Edit</Button></Link><Link to={`/dashboard/interviews/${id}/feedback`}><Button variant="outline" icon={MessageSquareText}>Feedback</Button></Link></div>}
      />

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3"><InterviewStatusBadge status={interview.status} /><span className="text-sm font-semibold text-slate-500">{formatInterviewDateTime(interview.startTime, interview.timezone)}</span></div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Detail label="Round" value={interview.roundLabel} />
          <Detail label="Type" value={interview.interviewType} />
          <Detail label="Mode" value={interview.interviewMode} />
          <Detail label="Duration" value={`${interview.durationMinutes} minutes`} />
          <Detail label="Start" value={formatInterviewDateTime(interview.startTime, interview.timezone)} />
          <Detail label="End" value={formatInterviewDateTime(interview.endTime, interview.timezone)} />
          <Detail label="Timezone" value={interview.timezone} />
          <Detail label="Interviewers" value={interview.interviewers?.map((item) => item.name).join(", ")} />
          <Detail label="Location" value={interview.location} />
          <Detail label="Rating" value={interview.overallRating ? `${interview.overallRating}/5` : "-"} />
          <Detail label="Recommendation" value={interview.recommendation} />
        </div>
        {interview.meetingLink ? <a href={interview.meetingLink} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700"><ExternalLink className="h-4 w-4" /> Open meeting link</a> : null}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600"><span className="font-bold">Agenda:</span> {interview.agenda || "No agenda"}</p>
          <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600"><span className="font-bold">Instructions:</span> {interview.instructions || "No instructions"}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="outline" icon={PlayCircle} loading={updating} onClick={() => action(dispatch(changeInterviewStatus({ id, status: "In Progress" })), "Interview marked in progress")}>Mark In Progress</Button>
          <Button icon={CheckCircle2} loading={completing} onClick={() => action(dispatch(completeInterview(id)), "Interview completed")}>Complete</Button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Candidate summary</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Detail label="Status" value={interview.candidate?.status} />
          <Detail label="Experience" value={`${interview.candidate?.totalExperience || 0} years`} />
          <Detail label="AI score" value={interview.candidate?.overallScore} />
          <Detail label="AI category" value={interview.candidate?.category} />
        </div>
      </section>

      <InterviewQuestionsPanel interview={interview} loading={generatingQuestions} onGenerate={() => action(dispatch(generateQuestions({ id, payload: { count: 8, difficulty: "Medium" } })), "Questions generated")} />

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Candidate emails</h2>
            <p className="mt-1 text-sm text-slate-500">Invitation, reminder, reschedule and cancellation notices are logged separately from interview status.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" icon={Mail} loading={emailSending} onClick={() => emailAction(dispatch(sendInterviewInvitation({ interviewId: id })), "Invitation email processed")}>Send Invitation</Button>
            <Button variant="outline" icon={RefreshCw} loading={emailSending} onClick={() => emailAction(dispatch(sendInterviewReminder({ interviewId: id })), "Reminder email processed")}>Send Reminder</Button>
            <Button variant="outline" loading={emailSending} onClick={() => emailAction(dispatch(sendInterviewRescheduled({ interviewId: id })), "Reschedule email processed")}>Notify Reschedule</Button>
            <Button variant="outline" loading={emailSending} onClick={() => emailAction(dispatch(sendInterviewCancelled({ interviewId: id })), "Cancellation email processed")}>Notify Cancellation</Button>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          {emailLogs.map((log) => (
            <div key={log.id} className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm md:flex-row md:items-center md:justify-between">
              <span className="font-semibold text-slate-900">{log.emailType}: {log.subject}</span>
              <span className="text-slate-500">{log.status} - {log.to?.[0]?.email}</span>
            </div>
          ))}
          {!emailLogs.length ? <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-500">No interview emails sent yet.</p> : null}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Feedback</h2>
        <div className="mt-4 grid gap-4">
          {interview.feedback?.map((item) => (
            <article key={item._id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="font-bold text-slate-950">{item.interviewerName} - {item.overallRating}/5</p>
              <p className="mt-1 text-sm text-slate-600">{item.notes || "No notes"}</p>
              <p className="mt-1 text-sm font-semibold text-blue-700">{item.recommendation}</p>
            </article>
          ))}
          {!interview.feedback?.length ? <p className="text-sm text-slate-500">No feedback submitted yet.</p> : null}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Activity</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <p>Created {formatInterviewDateTime(interview.createdAt, interview.timezone)}</p>
          {interview.rescheduleHistory?.map((item) => <p key={`${item.changedAt}-${item.newStartTime}`}>Rescheduled to {formatInterviewDateTime(item.newStartTime, interview.timezone)} - {item.reason}</p>)}
          {interview.cancelledAt ? <p>Cancelled {formatInterviewDateTime(interview.cancelledAt, interview.timezone)} - {interview.cancellationReason}</p> : null}
          {interview.completedAt ? <p>Completed {formatInterviewDateTime(interview.completedAt, interview.timezone)}</p> : null}
        </div>
      </section>
    </div>
  );
};

export default InterviewDetailsPage;
