import { ArrowLeft, BriefcaseBusiness, Building2, CalendarDays, MapPin, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";
import { getPublicJobBySlugRequest } from "../../api/jobApi.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatDate } from "../../utils/formatDate.js";
import { formatExperience } from "../../utils/formatExperience.js";

const PublicJobPage = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <PageLoader message="Loading job posting" />;
  }

  if (error || !data?.job) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="Job unavailable"
          description={error || "This job may have closed or expired."}
          icon={BriefcaseBusiness}
          action={
            <Link to="/">
              <Button variant="outline" icon={ArrowLeft}>Back home</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const { job, company } = data;
  const companyLocation = [company.city, company.state, company.country].filter(Boolean).join(", ");

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to HireSmart AI
          </Link>
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="max-h-12 max-w-12 object-contain" />
                  ) : (
                    <Building2 className="h-7 w-7 text-blue-600" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-700">{company.name}</p>
                  {companyLocation ? <p className="mt-1 text-sm text-slate-500">{companyLocation}</p> : null}
                </div>
              </div>
              <h1 className="mt-6 text-3xl font-bold text-slate-950 sm:text-4xl">{job.title}</h1>
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4" />{job.employmentType}</span>
                <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{job.location || "Remote"}</span>
                <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" />Apply by {formatDate(job.deadline)}</span>
              </div>
            </div>
            <Link to={`/jobs/${job.publicApplicationSlug}/apply`}>
              <Button size="lg" icon={Send}>Apply now</Button>
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">About the role</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{job.description}</p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Responsibilities</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              {job.responsibilities.map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Screening questions</h2>
            {job.screeningQuestions.length ? (
              <div className="mt-4 space-y-3">
                {job.screeningQuestions.map((question, index) => (
                  <div key={question.key || question.question} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-bold text-slate-900">{index + 1}. {question.question}</p>
                    <p className="mt-1 text-xs font-semibold uppercase text-slate-500">{question.required ? "Required" : "Optional"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">No screening questions are required for this posting.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Job summary</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div><dt className="font-bold text-slate-500">Department</dt><dd className="mt-1 text-slate-800">{job.department}</dd></div>
              <div><dt className="font-bold text-slate-500">Work mode</dt><dd className="mt-1 text-slate-800">{job.workMode}</dd></div>
              <div><dt className="font-bold text-slate-500">Experience</dt><dd className="mt-1 text-slate-800">{formatExperience(job.minimumExperience, job.maximumExperience)}</dd></div>
              <div><dt className="font-bold text-slate-500">Salary</dt><dd className="mt-1 text-slate-800">{formatCurrency(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}</dd></div>
              <div><dt className="font-bold text-slate-500">Openings</dt><dd className="mt-1 text-slate-800">{job.openings}</dd></div>
              <div><dt className="font-bold text-slate-500">Education</dt><dd className="mt-1 text-slate-800">{job.education}</dd></div>
            </dl>
            <Link to={`/jobs/${job.publicApplicationSlug}/apply`} className="mt-6 block">
              <Button className="w-full" icon={Send}>Apply now</Button>
            </Link>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {job.requiredSkills.map((skill) => <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{skill}</span>)}
            </div>
            {job.preferredSkills.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {job.preferredSkills.map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{skill}</span>)}
              </div>
            ) : null}
          </section>
        </aside>
      </main>
    </div>
  );
};

export default PublicJobPage;
