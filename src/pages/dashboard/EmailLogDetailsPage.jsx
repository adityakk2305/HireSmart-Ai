import { ArrowLeft, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";
import EmailStatusBadge from "../../components/emails/EmailStatusBadge.jsx";
import { fetchEmailLogById, retryEmailLog } from "../../features/emails/emailSlice.js";
import { formatDate } from "../../utils/formatDate.js";

const Detail = ({ label, value }) => <div><p className="text-xs font-bold uppercase text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800 break-words">{value || "-"}</p></div>;

const EmailLogDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedLog: log, detailsLoading, error } = useSelector((state) => state.emails);

  useEffect(() => {
    dispatch(fetchEmailLogById(id));
  }, [dispatch, id]);

  const retry = async () => {
    try {
      await dispatch(retryEmailLog(id)).unwrap();
      toast.success("Email retry processed");
      dispatch(fetchEmailLogById(id));
    } catch (apiError) {
      toast.error(apiError || "Unable to retry email");
    }
  };

  if (detailsLoading) return <PageLoader message="Loading email log" />;
  if (!log) return <EmptyState title="Email log not found" description={error || "This email log may not exist or may belong to another company."} action={<Link to="/dashboard/emails/logs"><Button variant="outline" icon={ArrowLeft}>Back</Button></Link>} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Email log details" description={log.subject} action={<div className="flex gap-2"><Link to="/dashboard/emails/logs"><Button variant="outline" icon={ArrowLeft}>Back</Button></Link>{log.status === "Failed" ? <Button icon={RefreshCw} onClick={retry}>Retry</Button> : null}</div>} />
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3"><EmailStatusBadge status={log.status} /><span className="text-sm font-semibold text-slate-500">{log.emailType} via {log.provider}</span></div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Detail label="Recipient" value={log.to?.map((item) => item.email).join(", ")} />
          <Detail label="From" value={`${log.from?.name || ""} <${log.from?.email || ""}>`} />
          <Detail label="Subject" value={log.subject} />
          <Detail label="Provider message ID" value={log.providerMessageId} />
          <Detail label="Candidate" value={log.candidate?.fullName} />
          <Detail label="Job" value={log.job?.title} />
          <Detail label="Interview" value={log.interview?.title} />
          <Detail label="Attempts" value={`${log.attempts}/${log.maxAttempts}`} />
          <Detail label="Scheduled" value={formatDate(log.scheduledFor, { hour: "2-digit", minute: "2-digit" })} />
          <Detail label="Sent" value={log.sentAt ? formatDate(log.sentAt, { hour: "2-digit", minute: "2-digit" }) : ""} />
          <Detail label="Failed" value={log.failedAt ? formatDate(log.failedAt, { hour: "2-digit", minute: "2-digit" }) : ""} />
          <Detail label="Safe error" value={log.errorMessage} />
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Rendered HTML preview</h2>
          <iframe title="Rendered email" sandbox="" className="mt-4 h-96 w-full rounded border border-slate-200" srcDoc={log.htmlBody || "<p>No HTML body.</p>"} />
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Plain text and metadata</h2>
          <pre className="mt-4 max-h-60 overflow-auto whitespace-pre-wrap rounded bg-slate-50 p-3 text-sm">{log.textBody || "No text body."}</pre>
          <pre className="mt-4 max-h-60 overflow-auto rounded bg-slate-50 p-3 text-xs">{JSON.stringify(log.metadata || {}, null, 2)}</pre>
          <div className="mt-4 space-y-2">
            {log.retryHistory?.map((item, index) => <p key={`${item.createdAt}-${index}`} className="text-sm text-slate-600">Attempt {item.attempt}: {item.status} {item.errorMessage ? `- ${item.errorMessage}` : ""}</p>)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmailLogDetailsPage;
