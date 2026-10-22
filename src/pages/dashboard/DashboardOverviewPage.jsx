import {
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  MapPin,
  Pencil,
  UsersRound
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAnalyticsSummaryRequest } from "../../api/analyticsApi.js";
import { getJobSummaryRequest } from "../../api/jobApi.js";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import useCompany from "../../hooks/useCompany.js";
import { calculateCompanyProfileCompletion } from "../../utils/profileCompletion.js";

const DashboardOverviewPage = () => {
  const { company } = useCompany();
  const [jobSummary, setJobSummary] = useState({
    total: 0,
    statusCounts: { Draft: 0, Active: 0, Closed: 0, Archived: 0 }
  });
  const [candidateSummary, setCandidateSummary] = useState({
    total: 0,
    applicationsToday: 0,
    statusCounts: { "Under Review": 0, Shortlisted: 0, Rejected: 0 }
  });
  const [aiSummary, setAiSummary] = useState({
    screenedCandidates: 0,
    averageScore: 0,
    excellentMatches: 0,
    goodMatches: 0,
    lowMatches: 0
  });
  const [analyticsSummary, setAnalyticsSummary] = useState({
    applicationsToday: 0,
    activeJobs: 0,
    candidatesNeedingReview: 0,
    interviewsToday: 0,
    interviewsNeedingFeedback: 0,
    emailsFailed: 0,
    pendingEmails: 0,
    averageAiScore: 0,
    totalCandidates: 0,
    aiScreenedCandidates: 0,
    selectedThisMonth: 0,
    topInsight: null
  });
  const completion = calculateCompanyProfileCompletion(company);
  const stats = [
    { label: "Total jobs", value: jobSummary.total, icon: BriefcaseBusiness, note: "Live job module" },
    { label: "Active jobs", value: analyticsSummary.activeJobs || jobSummary.statusCounts.Active, icon: BriefcaseBusiness, note: "Analytics summary" },
    { label: "Total candidates", value: analyticsSummary.totalCandidates, icon: UsersRound, note: "Analytics summary" },
    { label: "Applications today", value: analyticsSummary.applicationsToday, icon: CalendarClock, note: "Analytics summary" },
    { label: "Needs review", value: analyticsSummary.candidatesNeedingReview, icon: UsersRound, note: "Analytics summary" },
    { label: "Interviews today", value: analyticsSummary.interviewsToday, icon: CalendarClock, note: "Analytics summary" },
    { label: "Needs feedback", value: analyticsSummary.interviewsNeedingFeedback, icon: CalendarClock, note: "Analytics summary" },
    { label: "AI screened", value: analyticsSummary.aiScreenedCandidates, icon: BrainCircuit, note: "Analytics summary" },
    { label: "Average AI score", value: analyticsSummary.averageAiScore || aiSummary.averageScore, icon: BrainCircuit, note: "Analytics summary" },
    { label: "Selected this month", value: analyticsSummary.selectedThisMonth, icon: BrainCircuit, note: "Analytics summary" },
    { label: "Email failed", value: analyticsSummary.emailsFailed, icon: CalendarClock, note: "Analytics summary" },
    { label: "Email pending", value: analyticsSummary.pendingEmails, icon: CalendarClock, note: "Analytics summary" }
  ];

  useEffect(() => {
    document.title = "Recruiter Overview | HireSmart AI";
  }, []);

  useEffect(() => {
    getJobSummaryRequest()
      .then(setJobSummary)
      .catch(() => {
        setJobSummary({
          total: 0,
          statusCounts: { Draft: 0, Active: 0, Closed: 0, Archived: 0 }
        });
      });
    getAnalyticsSummaryRequest()
      .then((summary) => {
        setAnalyticsSummary(summary);
        setCandidateSummary((current) => ({ ...current, applicationsToday: summary.applicationsToday }));
        setAiSummary((current) => ({ ...current, averageScore: summary.averageAiScore }));
      })
      .catch(() => setAnalyticsSummary((current) => current));
  }, []);

  return (
    <div>
      <PageHeader
        title="Recruiter overview"
        description="Track company setup, job activity, candidate intake and AI screening performance from one workspace."
        action={
          <Link to="/dashboard/company-settings">
            <Button variant="outline" icon={Pencil}>
              Edit company
            </Button>
          </Link>
        }
      />

      {company ? (
        <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="max-h-14 max-w-14 object-contain" />
                ) : (
                  <Building2 className="h-8 w-8 text-blue-600" aria-hidden="true" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-950">{company.name}</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {company.industry} - {company.size} employees
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {[company.city, company.state, company.country].filter(Boolean).join(", ")}
                </p>
              </div>
            </div>
            <div className="min-w-56">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Profile completion</span>
                <span>{completion.percentage}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: `${completion.percentage}%` }}
                />
              </div>
              {completion.missingFields.length > 0 ? (
                <p className="mt-2 text-xs text-slate-500">
                  Missing: {completion.missingFields.slice(0, 3).join(", ")}
                  {completion.missingFields.length > 3 ? "..." : ""}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                  <p className="mt-3 text-3xl font-bold text-slate-950">{stat.value}</p>
                </div>
                <span className="rounded-lg bg-blue-50 p-3 text-blue-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {stat.note}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <EmptyState
          title="Recent applications will appear here"
          description="Detailed application activity is available from the candidates module."
          icon={UsersRound}
        />
        <EmptyState
          title="Upcoming interviews"
          description={`${analyticsSummary.upcomingInterviews} upcoming interviews are currently scheduled.`}
          icon={CalendarClock}
        />
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Top insight</h2>
            <p className="mt-1 text-sm text-slate-500">{analyticsSummary.topInsight?.message || "Analytics insights will appear as recruitment activity grows."}</p>
          </div>
          <BarChart3 className="h-6 w-6 text-blue-600" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
