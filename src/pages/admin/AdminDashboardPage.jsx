import { BriefcaseBusiness, Building2, Mail, UsersRound } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetricCard from "../../components/analytics/MetricCard.jsx";
import SimpleBarList from "../../components/analytics/SimpleBarList.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { fetchAdminOverview } from "../../features/admin/adminSlice.js";

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { overview } = useSelector((state) => state.admin);
  useEffect(() => { dispatch(fetchAdminOverview()); }, [dispatch]);
  return (
    <div>
      <PageHeader title="Admin overview" description="Platform monitoring with minimized sensitive data." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Companies" value={overview?.totalCompanies || 0} icon={Building2} />
        <MetricCard label="Active companies" value={overview?.activeCompanies || 0} />
        <MetricCard label="Suspended companies" value={overview?.suspendedCompanies || 0} />
        <MetricCard label="Users" value={overview?.totalUsers || 0} icon={UsersRound} />
        <MetricCard label="Active jobs" value={overview?.activeJobs || 0} icon={BriefcaseBusiness} />
        <MetricCard label="Candidates" value={overview?.totalCandidates || 0} />
        <MetricCard label="Interviews" value={overview?.totalInterviews || 0} />
        <MetricCard label="Emails" value={overview?.totalEmails || 0} icon={Mail} />
        <MetricCard label="AI screened" value={overview?.aiScreenedCandidates || 0} />
        <MetricCard label="Failed emails" value={overview?.failedEmails || 0} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <SimpleBarList title="Company growth" items={overview?.companiesCreatedTrend || []} />
        <SimpleBarList title="Candidate growth" items={overview?.candidateGrowthTrend || []} />
      </div>
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-950">Recent companies</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(overview?.recentCompanies || []).map((company) => (
            <div key={company.id} className="rounded-md border border-slate-200 p-3">
              <p className="font-semibold text-slate-950">{company.name}</p>
              <p className="text-sm text-slate-500">{company.industry} - {company.accountStatus}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
