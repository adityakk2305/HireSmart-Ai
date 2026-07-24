import { ArrowLeft, BriefcaseBusiness } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { applyToJobRequest } from "../../api/candidateApi.js";
import { getPublicJobBySlugRequest } from "../../api/jobApi.js";
import CandidateApplicationForm from "../../components/candidates/CandidateApplicationForm.jsx";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";

const JobApplicationPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    getPublicJobBySlugRequest(slug)
      .then((response) => {
        if (mounted) setData(response);
      })
      .catch((apiError) => {
        if (mounted) setError(apiError.response?.data?.message || "This job is unavailable");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  const submitApplication = async (formData) => {
    setSubmitting(true);
    try {
      const result = await applyToJobRequest(slug, formData);
      sessionStorage.setItem("hiresmart:lastApplication", JSON.stringify(result));
      navigate("/application-success", { state: result });
    } catch (apiError) {
      toast.error(apiError.response?.data?.message || "Unable to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader message="Loading application" />;

  if (error || !data?.job) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="Application unavailable"
          description={error || "This job may have closed or expired."}
          icon={BriefcaseBusiness}
          action={
            <Link to={`/jobs/${slug}`}>
              <Button variant="outline" icon={ArrowLeft}>Back to job</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link to={`/jobs/${slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to job
          </Link>
          <h1 className="mt-5 text-3xl font-bold text-slate-950">Apply for {data.job.title}</h1>
          <p className="mt-2 text-sm text-slate-600">{data.company.name} - {data.job.department}</p>
        </div>
      </section>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <CandidateApplicationForm job={data.job} submitting={submitting} onSubmit={submitApplication} />
      </main>
    </div>
  );
};

export default JobApplicationPage;
