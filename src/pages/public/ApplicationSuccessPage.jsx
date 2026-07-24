import { CheckCircle2, Copy, Search } from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { formatDate } from "../../utils/formatDate.js";

const ApplicationSuccessPage = () => {
  const location = useLocation();
  const data = useMemo(() => {
    if (location.state) return location.state;
    try {
      return JSON.parse(sessionStorage.getItem("hiresmart:lastApplication") || "null");
    } catch {
      return null;
    }
  }, [location.state]);

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="No recent application found"
          description="Submit an application to see confirmation details here."
          icon={CheckCircle2}
          action={<Link to="/application-status"><Button icon={Search}>Check status</Button></Link>}
        />
      </div>
    );
  }

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(data.applicationId);
      toast.success("Application ID copied");
    } catch {
      toast.error("Unable to copy application ID");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-950">Application submitted</h1>
        <p className="mt-2 text-sm text-slate-600">Keep your application ID handy for status checks.</p>
        <dl className="mt-8 grid gap-4 text-left sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4"><dt className="text-xs font-bold uppercase text-slate-500">Candidate</dt><dd className="mt-1 font-semibold">{data.candidateName}</dd></div>
          <div className="rounded-lg bg-slate-50 p-4"><dt className="text-xs font-bold uppercase text-slate-500">Job</dt><dd className="mt-1 font-semibold">{data.jobTitle}</dd></div>
          <div className="rounded-lg bg-slate-50 p-4"><dt className="text-xs font-bold uppercase text-slate-500">Company</dt><dd className="mt-1 font-semibold">{data.companyName}</dd></div>
          <div className="rounded-lg bg-slate-50 p-4"><dt className="text-xs font-bold uppercase text-slate-500">Status</dt><dd className="mt-1 font-semibold">{data.status}</dd></div>
          <div className="rounded-lg bg-slate-50 p-4"><dt className="text-xs font-bold uppercase text-slate-500">Applied</dt><dd className="mt-1 font-semibold">{formatDate(data.appliedAt)}</dd></div>
          <div className="rounded-lg bg-blue-50 p-4"><dt className="text-xs font-bold uppercase text-blue-700">Application ID</dt><dd className="mt-1 text-lg font-bold text-blue-800">{data.applicationId}</dd></div>
        </dl>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="outline" icon={Copy} onClick={copyId}>Copy application ID</Button>
          <Link to="/application-status"><Button icon={Search}>Check application status</Button></Link>
          {data.jobSlug ? <Link to={`/jobs/${data.jobSlug}`}><Button variant="outline">Back to job</Button></Link> : null}
        </div>
      </div>
    </div>
  );
};

export default ApplicationSuccessPage;
