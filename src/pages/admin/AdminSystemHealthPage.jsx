import { RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetricCard from "../../components/analytics/MetricCard.jsx";
import Button from "../../components/common/Button.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { fetchSystemHealth } from "../../features/admin/adminSlice.js";

const AdminSystemHealthPage = () => {
  const dispatch = useDispatch();
  const { systemHealth } = useSelector((state) => state.admin);
  useEffect(() => { dispatch(fetchSystemHealth()); }, [dispatch]);
  return (
    <div>
      <PageHeader title="System health" description="Basic safe health signals without credentials." action={<Button variant="outline" icon={RefreshCw} onClick={() => dispatch(fetchSystemHealth())}>Refresh</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="API status" value={systemHealth?.apiStatus || "Unknown"} />
        <MetricCard label="Database" value={systemHealth?.databaseStatus || "Unknown"} />
        <MetricCard label="Uptime seconds" value={systemHealth?.applicationUptimeSeconds || 0} />
        <MetricCard label="Environment" value={systemHealth?.nodeEnvironment || "Unknown"} />
        <MetricCard label="Mail provider" value={systemHealth?.mailProviderStatus?.provider || "Unknown"} />
        <MetricCard label="AI provider" value={systemHealth?.aiProviderConfiguration?.provider || "Unknown"} />
        <MetricCard label="Pending emails" value={systemHealth?.pendingEmails || 0} />
        <MetricCard label="Failed emails" value={systemHealth?.failedEmails || 0} />
      </div>
      <p className="mt-4 text-sm text-slate-500">Server time: {systemHealth?.serverTime || "Not available"} | Last refreshed: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default AdminSystemHealthPage;
