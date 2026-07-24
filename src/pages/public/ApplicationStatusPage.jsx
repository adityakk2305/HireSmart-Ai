import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { lookupApplicationStatusRequest } from "../../api/candidateApi.js";
import CandidateStatusBadge from "../../components/candidates/CandidateStatusBadge.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { formatDate } from "../../utils/formatDate.js";

const ApplicationStatusPage = () => {
  const [applicationId, setApplicationId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setNotFound(false);
    setResult(null);

    if (!applicationId.trim() || !email.trim()) {
      toast.error("Application ID and email are required");
      return;
    }

    setLoading(true);
    try {
      const data = await lookupApplicationStatusRequest({ applicationId, email });
      setResult(data);
    } catch (apiError) {
      if (apiError.response?.status === 404) setNotFound(true);
      toast.error(apiError.response?.data?.message || "Unable to look up application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-950">Check application status</h1>
      <p className="mt-2 text-sm text-slate-600">Enter your application ID and email. Only limited status information is shown.</p>

      <form className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm" onSubmit={submit}>
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Application ID" value={applicationId} onChange={(event) => setApplicationId(event.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="mt-5 flex justify-end">
          <Button type="submit" loading={loading} icon={Search}>Look up status</Button>
        </div>
      </form>

      {notFound ? (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
          No matching application was found. Check both values and try again.
        </div>
      ) : null}

      {result ? (
        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-500">{result.applicationId}</p>
              <h2 className="mt-1 text-xl font-bold text-slate-950">{result.jobTitle}</h2>
              <p className="mt-1 text-sm text-slate-600">{result.companyName}</p>
            </div>
            <CandidateStatusBadge status={result.status} />
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div><dt className="text-xs font-bold uppercase text-slate-400">Applied</dt><dd className="mt-1 text-sm font-semibold">{formatDate(result.appliedAt)}</dd></div>
            <div><dt className="text-xs font-bold uppercase text-slate-400">Last updated</dt><dd className="mt-1 text-sm font-semibold">{formatDate(result.lastStatusUpdateAt)}</dd></div>
          </dl>
        </section>
      ) : null}
    </div>
  );
};

export default ApplicationStatusPage;
