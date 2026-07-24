import { Mail, Send, Settings, TestTube2, FileText } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import EmailLogTable from "../../components/emails/EmailLogTable.jsx";
import { cancelEmailLog, fetchEmailSummary, retryEmailLog, sendTestEmail } from "../../features/emails/emailSlice.js";

const Stat = ({ label, value, note }) => (
  <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-semibold text-slate-500">{label}</p>
    <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
    <p className="mt-3 text-xs font-bold uppercase text-slate-400">{note}</p>
  </article>
);

const EmailsPage = () => {
  const dispatch = useDispatch();
  const { summary, loading, sending } = useSelector((state) => state.emails);

  useEffect(() => {
    dispatch(fetchEmailSummary());
  }, [dispatch]);

  const retry = async (log) => {
    try {
      await dispatch(retryEmailLog(log.id)).unwrap();
      toast.success("Email retry processed");
      dispatch(fetchEmailSummary());
    } catch (error) {
      toast.error(error || "Unable to retry email");
    }
  };

  const cancel = async (log) => {
    try {
      await dispatch(cancelEmailLog(log.id)).unwrap();
      toast.success("Queued email cancelled");
      dispatch(fetchEmailSummary());
    } catch (error) {
      toast.error(error || "Unable to cancel email");
    }
  };

  const test = async () => {
    try {
      await dispatch(sendTestEmail({ to: "hr@hiresmart.com" })).unwrap();
      toast.success("Test email processed");
      dispatch(fetchEmailSummary());
    } catch (error) {
      toast.error(error || "Unable to send test email");
    }
  };

  return (
    <div>
      <PageHeader
        title="Emails"
        description="Manage candidate communication, delivery logs, templates and mail provider status."
        action={<div className="flex flex-wrap gap-2"><Link to="/dashboard/email-templates"><Button variant="outline" icon={FileText}>Templates</Button></Link><Link to="/dashboard/email-settings"><Button variant="outline" icon={Settings}>Settings</Button></Link><Button icon={TestTube2} loading={sending} onClick={test}>Test Configuration</Button></div>}
      />

      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-slate-400">Configuration status</p>
            <p className="mt-1 text-lg font-bold text-slate-950">{summary?.providerStatus?.mockMode ? "Mock provider active" : "SMTP provider active"}</p>
            <p className="mt-1 text-sm text-slate-500">{summary?.providerStatus?.warning || "Credentials are backend-only and never shown in the browser."}</p>
          </div>
          <Mail className="h-7 w-7 text-blue-600" />
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <Stat label="Sent today" value={summary?.sentToday || 0} note="Delivered" />
        <Stat label="Pending" value={summary?.pending || 0} note="Queue" />
        <Stat label="Failed" value={summary?.failed || 0} note="Needs retry" />
        <Stat label="Delivery rate" value={`${summary?.deliveryRate || 0}%`} note="Sent vs failed" />
        <Stat label="Invitations" value={summary?.interviewInvitations || 0} note="Interview" />
        <Stat label="Status emails" value={summary?.candidateStatusEmails || 0} note="Candidates" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950">Recent failed emails</h2>
            <Link to="/dashboard/emails/logs"><Button size="sm" variant="outline">All logs</Button></Link>
          </div>
          {summary?.recentFailed?.length ? <EmailLogTable logs={summary.recentFailed} onRetry={retry} onCancel={cancel} /> : <EmptyState title="No failed emails" description={loading ? "Loading email status." : "Failed deliveries will appear here with retry actions."} icon={Send} />}
        </section>
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950">Upcoming scheduled messages</h2>
            <Link to="/dashboard/emails/logs?status=Pending"><Button size="sm" variant="outline">Open queue</Button></Link>
          </div>
          {summary?.upcoming?.length ? <EmailLogTable logs={summary.upcoming} onRetry={retry} onCancel={cancel} /> : <EmptyState title="No scheduled emails" description="Interview reminders and queued manual emails will appear here." icon={Mail} />}
        </section>
      </div>
    </div>
  );
};

export default EmailsPage;
