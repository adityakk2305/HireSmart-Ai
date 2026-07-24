import { ArrowLeft, CalendarClock, CheckCircle2, Download, Edit, Eye, FileSearch, Mail, PauseCircle, SearchCheck, Send, Trash2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { openCandidateResume } from "../../api/candidateApi.js";
import CandidateStatusBadge from "../../components/candidates/CandidateStatusBadge.jsx";
import ResumeParseStatusBadge from "../../components/candidates/ResumeParseStatusBadge.jsx";
import UpdateCandidateStatusModal from "../../components/candidates/UpdateCandidateStatusModal.jsx";
import AchievementsSection from "../../components/candidates/parsed-resume/AchievementsSection.jsx";
import CertificationsSection from "../../components/candidates/parsed-resume/CertificationsSection.jsx";
import EducationSection from "../../components/candidates/parsed-resume/EducationSection.jsx";
import ExperienceSection from "../../components/candidates/parsed-resume/ExperienceSection.jsx";
import ParsedResumeOverview from "../../components/candidates/parsed-resume/ParsedResumeOverview.jsx";
import ProjectsSection from "../../components/candidates/parsed-resume/ProjectsSection.jsx";
import SkillsSection from "../../components/candidates/parsed-resume/SkillsSection.jsx";
import SubmittedVsParsedComparison from "../../components/candidates/parsed-resume/SubmittedVsParsedComparison.jsx";
import AiEvaluationPanel from "../../components/candidates/ai-evaluation/AiEvaluationPanel.jsx";
import RecruiterNotes from "../../components/candidates/RecruiterNotes.jsx";
import Button from "../../components/common/Button.jsx";
import ConfirmationDialog from "../../components/common/ConfirmationDialog.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";
import EmailLogTable from "../../components/emails/EmailLogTable.jsx";
import SendCandidateEmailModal from "../../components/emails/SendCandidateEmailModal.jsx";
import {
  clearSelectedCandidate,
  deleteCandidate,
  fetchCandidateAiEvaluation,
  fetchCandidateById,
  fetchResumeData,
  parseResume,
  runCandidateScreening,
  updateCandidateStatus
} from "../../features/candidates/candidateSlice.js";
import { cancelEmailLog, fetchEmailLogs, fetchEmailTemplates, retryEmailLog, sendCandidateStatusEmail, sendManualCandidateEmail } from "../../features/emails/emailSlice.js";
import { fetchCandidateInterviews } from "../../features/interviews/interviewSlice.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatDate } from "../../utils/formatDate.js";
import { formatFileSize } from "../../utils/formatFileSize.js";

const DetailBlock = ({ label, value }) => (
  <div>
    <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-800">{value || "Not provided"}</p>
  </div>
);

const CandidateDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    selectedCandidate,
    detailsLoading,
    saving,
    deleting,
    parsingResume,
    screeningCandidate,
    aiEvaluationLoading,
    aiScreeningError,
    resumeDataLoading,
    resumeParseError,
    error
  } = useSelector((state) => state.candidates);
  const { candidateInterviews } = useSelector((state) => state.interviews);
  const { logs: emailLogs, templates: emailTemplates, sending: emailSending } = useSelector((state) => state.emails);
  const [statusOpen, setStatusOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    dispatch(fetchCandidateById(id));
    dispatch(fetchResumeData(id));
    dispatch(fetchCandidateAiEvaluation(id));
    dispatch(fetchCandidateInterviews(id));
    dispatch(fetchEmailTemplates({}));
    dispatch(fetchEmailLogs({ candidateId: id, limit: 10 }));
    return () => dispatch(clearSelectedCandidate());
  }, [dispatch, id]);

  const candidate = selectedCandidate?.candidate;
  const job = selectedCandidate?.job;
  const parsedResume = candidate?.parsedResume;

  const submitStatus = async (payload) => {
    try {
      await dispatch(updateCandidateStatus({ id, payload })).unwrap();
      toast.success("Candidate status updated");
      if (payload.sendEmail) {
        toast.info("Candidate email result was processed separately");
        dispatch(fetchEmailLogs({ candidateId: id, limit: 10 }));
      }
      setStatusOpen(false);
      dispatch(fetchCandidateById(id));
    } catch (apiError) {
      toast.error(apiError || "Unable to update status");
    }
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteCandidate(id)).unwrap();
      toast.success("Candidate deleted");
      navigate("/dashboard/candidates");
    } catch (apiError) {
      toast.error(apiError || "Unable to delete candidate");
    }
  };

  const openResume = async () => {
    try {
      await openCandidateResume(id);
    } catch (apiError) {
      toast.error(apiError.response?.data?.message || "Unable to open resume");
    }
  };

  const runParsing = async (force = false) => {
    if (force && !window.confirm("Re-parse this resume and replace parsed data only if parsing succeeds?")) {
      return;
    }

    try {
      await dispatch(parseResume({ id, force })).unwrap();
      await dispatch(fetchCandidateById(id));
      await dispatch(fetchResumeData(id));
      toast.success(force ? "Resume re-parsed" : "Resume parsed");
    } catch (apiError) {
      await dispatch(fetchResumeData(id));
      toast.error(apiError || "Unable to parse resume");
    }
  };

  const runScreening = async (force = false) => {
    if (force && !window.confirm("Re-run AI screening using the latest job and parsed resume data?")) {
      return;
    }

    try {
      await dispatch(runCandidateScreening({ id, force })).unwrap();
      await dispatch(fetchCandidateById(id));
      await dispatch(fetchCandidateAiEvaluation(id));
      toast.success(force ? "AI screening re-run" : "AI screening completed");
    } catch (apiError) {
      await dispatch(fetchCandidateAiEvaluation(id));
      toast.error(apiError || "Unable to run AI screening");
    }
  };

  const quickStatus = async (status) => {
    const note = `Manual recruiter decision: ${status}`;
    if (status === "Rejected" && !window.confirm("Reject this candidate? This is a manual recruiter action.")) {
      return;
    }
    await submitStatus({ status, note });
  };

  const sendCandidateEmail = async (values) => {
    try {
      await dispatch(sendManualCandidateEmail({
        candidateId: id,
        templateId: values.templateId || "",
        subject: values.subject,
        htmlBody: values.message ? `<p>${values.message}</p>` : "",
        textBody: values.message
      })).unwrap();
      toast.success("Candidate email processed");
      setEmailOpen(false);
      dispatch(fetchEmailLogs({ candidateId: id, limit: 10 }));
    } catch (apiError) {
      toast.error(apiError || "Unable to send candidate email");
    }
  };

  const sendStatusEmailNow = async (status = candidate?.status) => {
    try {
      await dispatch(sendCandidateStatusEmail({ candidateId: id, payload: { status, force: false } })).unwrap();
      toast.success("Candidate status email processed");
      dispatch(fetchEmailLogs({ candidateId: id, limit: 10 }));
    } catch (apiError) {
      toast.error(apiError || "Unable to send status email");
    }
  };

  const retryEmail = async (log) => {
    try {
      await dispatch(retryEmailLog(log.id)).unwrap();
      toast.success("Email retry processed");
      dispatch(fetchEmailLogs({ candidateId: id, limit: 10 }));
    } catch (apiError) {
      toast.error(apiError || "Unable to retry email");
    }
  };

  const cancelEmail = async (log) => {
    try {
      await dispatch(cancelEmailLog(log.id)).unwrap();
      toast.success("Queued email cancelled");
      dispatch(fetchEmailLogs({ candidateId: id, limit: 10 }));
    } catch (apiError) {
      toast.error(apiError || "Unable to cancel email");
    }
  };

  if (detailsLoading) return <PageLoader message="Loading candidate" />;

  if (!candidate) {
    return (
      <EmptyState
        title="Candidate not found"
        description={error || "The candidate may have been deleted or you may not have access."}
        action={<Link to="/dashboard/candidates"><Button variant="outline" icon={ArrowLeft}>Back to candidates</Button></Link>}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={candidate.fullName}
        description={`${candidate.applicationId} - ${job?.title || "Candidate application"}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/dashboard/candidates"><Button variant="outline" icon={ArrowLeft}>Back</Button></Link>
            <Link to={`/dashboard/candidates/${id}/edit`}><Button variant="outline" icon={Edit}>Edit</Button></Link>
            <Link to={`/dashboard/candidates/${id}/schedule-interview`}><Button variant="outline" icon={CalendarClock}>Schedule interview</Button></Link>
            <Button variant="outline" icon={Mail} onClick={() => setEmailOpen(true)}>Send Email</Button>
            <Button onClick={() => setStatusOpen(true)}>Change status</Button>
            <Button variant="outline" icon={Download} onClick={openResume}>Resume</Button>
            <Button variant="danger" icon={Trash2} onClick={() => setDeleteOpen(true)}>Delete</Button>
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          ["overview", "Overview"],
          ["resume", "Resume"],
          ["parsed", "Parsed Resume"],
          ["ai", "AI Evaluation"],
          ["activity", "Activity"],
          ["notes", "Notes"],
          ["interviews", "Interviews"],
          ["emails", "Emails"]
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`rounded-lg px-3 py-2 text-sm font-bold ${activeTab === key ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <CandidateStatusBadge status={candidate.status} />
          <span className="text-sm font-semibold text-slate-500">Applied {formatDate(candidate.appliedAt)}</span>
          {candidate.overallScore !== null && candidate.overallScore !== undefined ? <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">AI {candidate.overallScore} - {candidate.category || "Uncategorized"}</span> : null}
          <ResumeParseStatusBadge status={candidate.resumeParseStatus} />
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <DetailBlock label="Email" value={candidate.email} />
          <DetailBlock label="Phone" value={candidate.phone} />
          <DetailBlock label="Location" value={candidate.location} />
          <DetailBlock label="Experience" value={`${candidate.totalExperience} years`} />
          <DetailBlock label="Current company" value={candidate.currentCompany} />
          <DetailBlock label="Current designation" value={candidate.currentDesignation} />
          <DetailBlock label="Expected salary" value={candidate.expectedSalary ? formatCurrency(candidate.expectedSalary, null) : "Not provided"} />
          <DetailBlock label="Notice period" value={candidate.noticePeriod} />
          <DetailBlock label="LinkedIn" value={candidate.linkedinUrl} />
          <DetailBlock label="GitHub" value={candidate.githubUrl} />
          <DetailBlock label="Portfolio" value={candidate.portfolioUrl} />
          <DetailBlock label="Source" value={candidate.source} />
          <DetailBlock label="Last updated" value={formatDate(candidate.updatedAt, { hour: "2-digit", minute: "2-digit" })} />
        </div>
      </section> : null}

      {activeTab === "overview" ? <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Manual recruiter decision</h2>
            <p className="mt-1 text-sm text-slate-500">AI recommendations never change this status automatically.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" icon={SearchCheck} loading={saving} onClick={() => quickStatus("Under Review")}>Under Review</Button>
            <Button variant="outline" icon={CheckCircle2} loading={saving} onClick={() => quickStatus("Shortlisted")}>Shortlist</Button>
            <Button variant="outline" icon={PauseCircle} loading={saving} onClick={() => quickStatus("On Hold")}>On Hold</Button>
            <Button variant="danger" icon={XCircle} loading={saving} onClick={() => quickStatus("Rejected")}>Reject</Button>
          </div>
        </div>
      </section> : null}

      {activeTab === "overview" ? <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Application information</h2>
          <DetailBlock label="Job" value={job?.title} />
          <p className="mt-5 text-sm leading-6 text-slate-600">{candidate.coverLetter || "No cover letter provided."}</p>
          <div className="mt-5">
            <h3 className="text-sm font-bold text-slate-800">Screening answers</h3>
            {candidate.screeningAnswers.length ? (
              <div className="mt-3 space-y-3">
                {candidate.screeningAnswers.map((answer) => (
                  <div key={answer.questionId} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-bold text-slate-900">{answer.question}</p>
                    <p className="mt-1 text-sm text-slate-600">{String(answer.answer)}</p>
                  </div>
                ))}
              </div>
            ) : <p className="mt-2 text-sm text-slate-500">No screening answers.</p>}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Resume</h2>
          <div className="mt-4 space-y-4">
            <DetailBlock label="Original filename" value={candidate.resumeOriginalName} />
            <DetailBlock label="File type" value={candidate.resumeMimeType} />
            <DetailBlock label="File size" value={formatFileSize(candidate.resumeSize)} />
            <Button className="w-full" icon={Download} onClick={openResume}>View or download resume</Button>
          </div>
        </section>
      </div> : null}

      {activeTab === "activity" ? <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Status history</h2>
        <div className="mt-4 space-y-3">
          {candidate.statusHistory.map((item, index) => (
            <div key={`${item.newStatus}-${item.changedAt}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-900">{item.previousStatus || "New"} - {item.newStatus}</p>
              <p className="mt-1 text-sm text-slate-600">{item.note || "No note"}</p>
              <p className="mt-1 text-xs text-slate-500">{item.changedBy?.name || item.changedByRole} - {formatDate(item.changedAt, { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
          ))}
        </div>
      </section> : null}

      {activeTab === "resume" ? <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Resume parsing</h2>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <ResumeParseStatusBadge status={candidate.resumeParseStatus} />
              <span className="text-sm text-slate-500">Provider: {candidate.resumeParserProvider || "mock"}</span>
              <span className="text-sm text-slate-500">Version: {candidate.resumeParserVersion || "v1"}</span>
              <span className="text-sm text-slate-500">Text length: {candidate.resumeTextLength || 0}</span>
              <span className="text-sm text-slate-500">Attempts: {candidate.resumeParseAttempts || 0}</span>
            </div>
            {candidate.resumeParsedAt ? <p className="mt-2 text-sm text-slate-500">Last parsed {formatDate(candidate.resumeParsedAt, { hour: "2-digit", minute: "2-digit" })}</p> : null}
            {candidate.resumeTextTruncated ? <p className="mt-2 text-sm font-semibold text-amber-700">Extracted text was truncated before parsing.</p> : null}
            {candidate.resumeParserFallbackUsed ? <p className="mt-2 text-sm font-semibold text-amber-700">Fallback parser was used.</p> : null}
            {candidate.resumeParseStatus === "Needs OCR" ? (
              <p className="mt-3 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm font-semibold text-orange-800">
                This PDF appears to be scanned or image-based. OCR is not available for this file yet.
              </p>
            ) : null}
            {candidate.resumeParseError || resumeParseError ? <p className="mt-3 text-sm font-semibold text-red-600">{candidate.resumeParseError || resumeParseError}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {candidate.resumeParseStatus === "Parsed" ? (
              <Button variant="outline" icon={FileSearch} loading={parsingResume || resumeDataLoading} onClick={() => runParsing(true)}>Re-parse Resume</Button>
            ) : (
              <Button icon={FileSearch} loading={parsingResume || candidate.resumeParseStatus === "Processing"} disabled={candidate.resumeParseStatus === "Processing"} onClick={() => runParsing(false)}>
                {candidate.resumeParseStatus === "Failed" ? "Retry parsing" : "Parse Resume"}
              </Button>
            )}
          </div>
        </div>
      </section> : null}

      {activeTab === "parsed" && parsedResume ? (
        <div className="mt-6 space-y-6">
          <ParsedResumeOverview parsedResume={parsedResume} />
          <SubmittedVsParsedComparison candidate={candidate} parsedResume={parsedResume} />
          <SkillsSection parsedResume={parsedResume} />
          <ExperienceSection items={parsedResume.workExperience || []} />
          <EducationSection items={parsedResume.education || []} />
          <ProjectsSection items={parsedResume.projects || []} />
          <CertificationsSection items={parsedResume.certifications || []} />
          <AchievementsSection achievements={parsedResume.achievements || []} languages={parsedResume.languages || []} />
        </div>
      ) : null}
      {activeTab === "parsed" && !parsedResume ? <EmptyState title="No parsed resume" description="Parse the resume to view structured resume data." icon={FileSearch} /> : null}

      {activeTab === "ai" ? <AiEvaluationPanel
        candidate={candidate}
        loading={screeningCandidate || aiEvaluationLoading}
        error={aiScreeningError}
        onScreen={runScreening}
      /> : null}

      {activeTab === "notes" ? <RecruiterNotes candidate={candidate} /> : null}

      {activeTab === "interviews" ? <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Interview history</h2>
            <p className="mt-1 text-sm text-slate-500">Upcoming and past interviews for this candidate.</p>
          </div>
          <Link to={`/dashboard/candidates/${id}/schedule-interview`}><Button icon={CalendarClock}>Schedule Interview</Button></Link>
        </div>
        <div className="mt-5 grid gap-4">
          {candidateInterviews.map((interview) => (
            <article key={interview.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-bold text-slate-950">{interview.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{interview.roundLabel} - {interview.interviewMode} - {formatDate(interview.startTime, { hour: "2-digit", minute: "2-digit" })}</p>
                  <p className="mt-1 text-sm text-slate-500">Rating: {interview.overallRating ? `${interview.overallRating}/5` : "-"} | {interview.recommendation || "No recommendation"}</p>
                </div>
                <Link to={`/dashboard/interviews/${interview.id}`}><Button variant="outline" icon={Eye}>View</Button></Link>
              </div>
            </article>
          ))}
          {!candidateInterviews.length ? <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-500">No interviews scheduled for this candidate yet.</p> : null}
        </div>
      </section> : null}

      {activeTab === "emails" ? <section className="mt-6 space-y-5">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Candidate emails</h2>
              <p className="mt-1 text-sm text-slate-500">{candidate.email || "No candidate email address available."}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button icon={Send} loading={emailSending} onClick={() => setEmailOpen(true)}>Send Email</Button>
              {["Shortlisted", "Rejected", "Selected", "On Hold"].includes(candidate.status) ? <Button variant="outline" icon={Mail} loading={emailSending} onClick={() => sendStatusEmailNow(candidate.status)}>Send {candidate.status} Email</Button> : null}
            </div>
          </div>
        </div>
        {emailLogs.length ? <EmailLogTable logs={emailLogs} onRetry={retryEmail} onCancel={cancelEmail} /> : <EmptyState title="No candidate emails yet" description="Manual and status emails for this candidate will appear here." icon={Mail} />}
      </section> : null}

      <UpdateCandidateStatusModal open={statusOpen} candidate={candidate} loading={saving} onCancel={() => setStatusOpen(false)} onSubmit={submitStatus} />
      <SendCandidateEmailModal open={emailOpen} candidate={candidate} templates={emailTemplates} loading={emailSending} onCancel={() => setEmailOpen(false)} onSubmit={sendCandidateEmail} />
      <ConfirmationDialog
        open={deleteOpen}
        title="Delete candidate"
        description="This soft-deletes the candidate from normal lists and removes the local resume file."
        confirmLabel="Delete candidate"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
};

export default CandidateDetailsPage;
