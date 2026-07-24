import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import ConfirmationDialog from "../../components/common/ConfirmationDialog.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import JobFilters from "../../components/jobs/JobFilters.jsx";
import JobMobileCard from "../../components/jobs/JobMobileCard.jsx";
import JobPagination from "../../components/jobs/JobPagination.jsx";
import JobTable from "../../components/jobs/JobTable.jsx";
import {
  deleteJob,
  fetchJobs,
  resetJobFilters,
  setJobFilters,
  updateJobStatus
} from "../../features/jobs/jobSlice.js";
import useDebounce from "../../hooks/useDebounce.js";

const publicJobUrl = (slug) => `${window.location.origin}/jobs/${slug}`;

const JobsPage = () => {
  const dispatch = useDispatch();
  const { jobs, filters, pagination, loading, saving, deleting, error } = useSelector((state) => state.jobs);
  const [pendingAction, setPendingAction] = useState(null);
  const debouncedSearch = useDebounce(filters.search, 400);
  const effectiveFilters = useMemo(() => ({ ...filters, search: debouncedSearch }), [filters, debouncedSearch]);

  useEffect(() => {
    dispatch(fetchJobs(effectiveFilters));
  }, [dispatch, effectiveFilters]);

  const handleFilterChange = (updates) => {
    dispatch(setJobFilters(updates));
  };

  const refreshJobs = () => dispatch(fetchJobs(effectiveFilters));

  const handleCopy = async (job) => {
    if (!job.publicApplicationSlug) {
      toast.error("Public URL is unavailable for this job");
      return;
    }

    try {
      await navigator.clipboard.writeText(publicJobUrl(job.publicApplicationSlug));
      toast.success("Public job URL copied");
    } catch {
      toast.error("Unable to copy URL");
    }
  };

  const confirmAction = async () => {
    if (!pendingAction) return;

    try {
      if (pendingAction.type === "status") {
        await dispatch(updateJobStatus({ id: pendingAction.job.id, status: pendingAction.status })).unwrap();
        toast.success(`Job moved to ${pendingAction.status}`);
      }

      if (pendingAction.type === "delete") {
        const result = await dispatch(deleteJob(pendingAction.job.id)).unwrap();
        toast.success(result.action === "archived" ? "Job archived" : "Job deleted");
      }

      setPendingAction(null);
      refreshJobs();
    } catch {
      setPendingAction(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Create, publish, close and archive job postings for your company."
        action={
          <Link to="/dashboard/jobs/create">
            <Button icon={Plus}>Create job</Button>
          </Link>
        }
      />

      <JobFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={() => dispatch(resetJobFilters())}
      />

      {error ? <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div> : null}

      <div className="mt-5">
        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-500 shadow-sm">
            Loading jobs...
          </div>
        ) : jobs.length ? (
          <>
            <JobTable
              jobs={jobs}
              onStatusChange={(job, status) => setPendingAction({ type: "status", job, status })}
              onDelete={(job) => setPendingAction({ type: "delete", job })}
              onCopy={handleCopy}
            />
            <div className="space-y-4 lg:hidden">
              {jobs.map((job) => (
                <JobMobileCard
                  key={job.id}
                  job={job}
                  onStatusChange={(item, status) => setPendingAction({ type: "status", job: item, status })}
                  onDelete={(item) => setPendingAction({ type: "delete", job: item })}
                  onCopy={handleCopy}
                />
              ))}
            </div>
            <JobPagination
              pagination={pagination}
              onPageChange={(page) => dispatch(setJobFilters({ page }))}
            />
          </>
        ) : (
          <EmptyState
            title="No jobs found"
            description="Create your first job or reset filters to see more postings."
            icon={Plus}
            action={
              <Link to="/dashboard/jobs/create">
                <Button icon={Plus}>Create job</Button>
              </Link>
            }
          />
        )}
      </div>

      <ConfirmationDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.type === "delete" ? "Delete or archive job" : "Change job status"}
        description={
          pendingAction?.type === "delete"
            ? `This will delete drafts with no candidates, or archive jobs that should be retained. Continue with ${pendingAction?.job?.title}?`
            : `Move ${pendingAction?.job?.title} to ${pendingAction?.status}?`
        }
        confirmLabel={pendingAction?.type === "delete" ? "Continue" : "Update status"}
        danger={pendingAction?.type === "delete"}
        loading={saving || deleting}
        onConfirm={confirmAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
};

export default JobsPage;
