import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MetricCard from "../../components/analytics/MetricCard.jsx";
import SimpleBarList from "../../components/analytics/SimpleBarList.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { fetchJobAnalyticsDetails } from "../../features/analytics/analyticsSlice.js";

const JobAnalyticsDetailsPage = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const { jobDetails } = useSelector((state) => state.analytics);
  useEffect(() => { dispatch(fetchJobAnalyticsDetails({ jobId, query: {} })); }, [dispatch, jobId]);
  const job = jobDetails?.job;
  return (
    <div>
      <PageHeader title={job?.title || "Job analytics details"} description="Safe job-level analytics without candidate private data." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Selection rate" value={`${jobDetails?.conversionMetrics?.applicationToSelectionRate || 0}%`} />
        <MetricCard label="Time to screen" value={jobDetails?.timeBasedMetrics?.timeToScreen?.averageHours ?? "Not available"} />
        <MetricCard label="Time to interview" value={jobDetails?.timeBasedMetrics?.timeToInterview?.averageHours ?? "Not available"} />
        <MetricCard label="Time to hire" value={jobDetails?.timeBasedMetrics?.timeToHire?.averageHours ?? "Not available"} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <SimpleBarList title="Source distribution" items={jobDetails?.candidateSourceDistribution || []} labelKey="label" valueKey="count" />
        <SimpleBarList title="AI score distribution" items={jobDetails?.aiScoreDistribution || []} />
        <SimpleBarList title="Required skills found" items={jobDetails?.requiredSkillsFound || []} labelKey="skill" />
        <SimpleBarList title="Missing skills" items={jobDetails?.missingSkills || []} labelKey="skill" />
      </div>
    </div>
  );
};

export default JobAnalyticsDetailsPage;
