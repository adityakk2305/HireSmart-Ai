import { Mail } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AnalyticsFilters from "../../components/analytics/AnalyticsFilters.jsx";
import MetricCard from "../../components/analytics/MetricCard.jsx";
import SimpleBarList from "../../components/analytics/SimpleBarList.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { fetchEmailAnalytics } from "../../features/analytics/analyticsSlice.js";

const EmailAnalyticsPage = () => {
  const dispatch = useDispatch();
  const { emails } = useSelector((state) => state.analytics);
  const load = (next) => dispatch(fetchEmailAnalytics(next));
  return (
    <div>
      <PageHeader title="Email analytics" description="Aggregate delivery, retry, provider, type, and failure analytics without recipient-level exposure." />
      <AnalyticsFilters onChange={load} onExport={() => {}} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Sent" value={emails?.sent || 0} icon={Mail} />
        <MetricCard label="Failed" value={emails?.failed || 0} />
        <MetricCard label="Pending" value={emails?.pending || 0} />
        <MetricCard label="Delivery rate" value={`${emails?.deliveryRate || 0}%`} />
        <MetricCard label="Retry success" value={`${emails?.retrySuccessRate || 0}%`} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <SimpleBarList title="Emails by type" items={emails?.emailsByType || []} />
        <SimpleBarList title="Emails by provider" items={emails?.emailsByProvider || []} />
        <SimpleBarList title="Top failure reasons" items={emails?.topFailureReasons || []} labelKey="reason" />
        <SimpleBarList title="Email trend" items={emails?.emailsTrend || []} />
      </div>
    </div>
  );
};

export default EmailAnalyticsPage;
