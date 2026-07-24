import { Archive, ArrowLeft, Copy, Edit, ExternalLink, Power, Trash2, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import ConfirmationDialog from "../../components/common/ConfirmationDialog.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";
import JobStatusBadge from "../../components/jobs/JobStatusBadge.jsx";
import {
  clearSelectedJob,
  deleteJob,
  fetchJobById,
  updateJobStatus
} from "../../features/jobs/jobSlice.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatDate } from "../../utils/formatDate.js";
import { formatExperience } from "../../utils/formatExperience.js";
import { isDeadlineExpired } from "../../utils/isDeadlineExpired.js";

const publicJobUrl = (slug) => `${window.location.origin}/jobs/${slug}`;

const DetailBlock = ({ label, value }) => (
  <div>
    <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-800">{value || "Not available"}</p>
  </div>
);

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedJob, detailsLoading, saving, deleting, error } = useSelector((state) => state.jobs);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    dispatch(fetchJobById(id));
    return () => dispatch(clearSelectedJob());
  }, [dispatch, id]);

  const job = selectedJob?.job;
  const company = selectedJob?.company;
  const publicUrl = job?.publicApplicationSlug ? publicJobUrl(job.publicApplicationSlug) : "";

  const copyPublicUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Public job URL copied");
    } catch {
      toast.error("Unable to copy URL");
    }
  };

  const confirmAction = async () => {
    try {
      if (pendingAction?.type === "status") {
        await dispatch(updateJobStatus({ id, status: pendingAction.status })).unwrap();
        toast.success(`Job moved to ${pendingAction.status}`);
        dispatch(fetchJobById(id));
      }

      if (pendingAction?.type === "delete") {
        const result = await dispatch(deleteJob(id)).unwrap();
        toast.success(result.action === "archived" ? "Job archived" : "Job deleted");
        navigate("/dashboard/jobs");
      }
    } finally {
      setPendingAction(null);
    }
  };

  if (detailsLoading) {
    return <PageLoader message="Loading job" />;
  }

  if (!job) {
    return (
      <EmptyState
        title="Job not found"
        description={error || "The job may have been deleted or you may not have access to it."}
        action={
          <Link to="/dashboard/jobs">
            <Button variant="outline" icon={ArrowLeft}>Back to jobs</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={job.title}
        description={`${job.department} - ${company?.name || "Your company"}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/dashboard/jobs">
              <Button variant="outline" icon={ArrowLeft}>Back</Button>
            </Link>
            <Link to={`/dashboard/jobs/${id}/edit`}>
              <Button variant="outline" icon={Edit}>Edit</Button>
            </Link>
            <Button variant="outline" icon={Copy} onClick={copyPublicUrl}>Copy URL</Button>
            <Link to={`/dashboard/candidates?jobId=${id}`}>
              <Button variant="outline" icon={UsersRound}>View candidates</Button>
            </Link>
            <Link to={`/dashboard/candidates/shortlisted?jobId=${id}`}>
              <Button variant="outline">Shortlisted</Button>
            </Link>
            <Link to={`/dashboard/ai-ranking?jobId=${id}`}>
              <Button variant="outline">AI ranking</Button>
            </Link>
            <Link to={`/dashboard/candidates/upload?jobId=${id}`}>
              <Button variant="outline">Upload candidate</Button>
            </Link>
            {job.status === "Active" ? (
              <a href={publicUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" icon={ExternalLink}>Public</Button>
              </a>
            ) : null}
          </div>
        }
      />

      {job.status === "Active" && isDeadlineExpired(job.deadline) ? (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
          This job deadline has passed. Public access is unavailable until the deadline is extended.
        </div>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between">
          <div>
            <JobStatusBadge status={job.status} deadline={job.deadline} />
            <p className="mt-3 text-sm leading-6 text-slate-600">{job.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {job.status === "Draft" || job.status === "Closed" ? (
              <Button variant="outline" icon={Power} onClick={() => setPendingAction({ type: "status", status: "Active" })}>Activate</Button>
            ) : null}
            {job.status === "Active" ? (
              <Button variant="outline" onClick={() => setPendingAction({ type: "status", status: "Closed" })}>Close</Button>
            ) : null}
            {job.status !== "Archived" ? (
              <Button variant="outline" icon={Archive} onClick={() => setPendingAction({ type: "status", status: "Archived" })}>Archive</Button>
            ) : null}
            <Button variant="danger" icon={Trash2} onClick={() => setPendingAction({ type: "delete" })}>Delete</Button>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <DetailBlock label="Employment" value={job.employmentType} />
          <DetailBlock label="Work mode" value={job.workMode} />
          <DetailBlock label="Location" value={job.location || "Remote"} />
          <DetailBlock label="Openings" value={job.openings} />
          <DetailBlock label="Experience" value={formatExperience(job.minimumExperience, job.maximumExperience)} />
          <DetailBlock label="Salary" value={formatCurrency(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)} />
          <DetailBlock label="Deadline" value={formatDate(job.deadline)} />
          <DetailBlock label="Candidates" value={job.candidateCount || 0} />
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Responsibilities</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            {job.responsibilities.map((item) => <li key={item}>- {item}</li>)}
          </ul>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Skills and education</h2>
          <div className="mt-4">
            <p className="text-sm font-semibold text-slate-700">Required skills</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {job.requiredSkills.map((skill) => <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{skill}</span>)}
            </div>
          </div>
          {job.preferredSkills.length ? (
            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-700">Preferred skills</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {job.preferredSkills.map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{skill}</span>)}
              </div>
            </div>
          ) : null}
          <DetailBlock label="Education" value={job.education} />
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Screening questions</h2>
        {job.screeningQuestions.length ? (
          <div className="mt-4 space-y-3">
            {job.screeningQuestions.map((question, index) => (
              <div key={question.key || question.question} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-900">{index + 1}. {question.question}</p>
                <p className="mt-1 text-xs font-semibold uppercase text-slate-500">{question.type}{question.required ? " - Required" : ""}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No screening questions added.</p>
        )}
      </section>

      <ConfirmationDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.type === "delete" ? "Delete or archive job" : "Change job status"}
        description={
          pendingAction?.type === "delete"
            ? "Draft jobs with no candidates are deleted. Other jobs are archived to preserve history."
            : `Move this job to ${pendingAction?.status}?`
        }
        confirmLabel={pendingAction?.type === "delete" ? "Continue" : "Update status"}
        danger={pendingAction?.type === "delete"}
        loading={saving || deleting}
        onConfirm={confirmAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
};

export default JobDetailsPage;
