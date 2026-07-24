import { RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getJobsRequest } from "../../api/jobApi.js";
import CandidateFilters from "../../components/candidates/CandidateFilters.jsx";
import CandidatePagination from "../../components/candidates/CandidatePagination.jsx";
import CandidateRankingTable from "../../components/candidates/ai-ranking/CandidateRankingTable.jsx";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import {
  fetchCandidates,
  resetCandidateFilters,
  runBulkCandidateScreening,
  setCandidateFilters
} from "../../features/candidates/candidateSlice.js";
import useDebounce from "../../hooks/useDebounce.js";

const AiRankingPage = () => {
  const dispatch = useDispatch();
  const { candidates, filters, pagination, loading, bulkScreening, bulkScreeningResult, aiScreeningError } = useSelector((state) => state.candidates);
  const [jobs, setJobs] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const debouncedSearch = useDebounce(filters.search, 400);
  const effectiveFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch, sort: filters.sort || "score-desc" }),
    [filters, debouncedSearch]
  );

  useEffect(() => {
    getJobsRequest({ page: 1, limit: 100, sort: "newest" })
      .then((data) => setJobs(data.jobs))
      .catch(() => setJobs([]));
  }, []);

  useEffect(() => {
    dispatch(fetchCandidates(effectiveFilters));
  }, [dispatch, effectiveFilters]);

  useEffect(() => {
    setSelectedIds((ids) => ids.filter((id) => candidates.some((candidate) => candidate.id === id)));
  }, [candidates]);

  const toggleCandidate = (id, checked) => {
    setSelectedIds((ids) => checked ? [...new Set([...ids, id])].slice(0, 20) : ids.filter((item) => item !== id));
  };

  const togglePage = (checked) => {
    if (!checked) {
      setSelectedIds([]);
      return;
    }

    const eligible = candidates
      .filter((candidate) => candidate.resumeParseStatus === "Parsed" && candidate.aiScreeningStatus !== "Processing")
      .map((candidate) => candidate.id);
    setSelectedIds([...new Set([...selectedIds, ...eligible])].slice(0, 20));
  };

  const runBulk = async (force = false) => {
    if (!selectedIds.length) {
      toast.info("Select parsed candidates before running bulk screening");
      return;
    }

    if (!window.confirm(`Run AI screening for ${selectedIds.length} selected candidate${selectedIds.length === 1 ? "" : "s"}?`)) {
      return;
    }

    try {
      const result = await dispatch(runBulkCandidateScreening({ candidateIds: selectedIds, force })).unwrap();
      toast.success(`Bulk screening completed: ${result.successful} succeeded, ${result.failed} failed`);
      dispatch(fetchCandidates(effectiveFilters));
    } catch (apiError) {
      toast.error(apiError || "Bulk screening failed");
    }
  };

  return (
    <div>
      <PageHeader
        title="AI Ranking"
        description="Rank candidates with recruiter-reviewed AI screening. Scores support decisions; they do not make decisions."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" icon={RefreshCw} onClick={() => dispatch(fetchCandidates(effectiveFilters))}>Refresh</Button>
            <Button icon={Sparkles} loading={bulkScreening} disabled={!selectedIds.length || selectedIds.length > 20} onClick={() => runBulk(false)}>
              Run bulk screening ({selectedIds.length})
            </Button>
          </div>
        }
      />
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-800">
        AI screening is decision-support only. Final hiring decisions must be reviewed by a recruiter.
      </div>
      <CandidateFilters
        filters={{ ...filters, sort: filters.sort || "score-desc" }}
        jobs={jobs}
        onChange={(updates) => dispatch(setCandidateFilters(updates))}
        onReset={() => dispatch(resetCandidateFilters())}
      />
      {aiScreeningError ? <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{aiScreeningError}</div> : null}
      {bulkScreeningResult ? (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm">
          <p className="font-bold text-slate-900">Bulk screening: {bulkScreeningResult.successful} succeeded, {bulkScreeningResult.failed} failed</p>
          {bulkScreeningResult.results.filter((item) => !item.success).length ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-red-700">
              {bulkScreeningResult.results.filter((item) => !item.success).map((item) => (
                <li key={item.candidateId}>{item.candidateId}: {item.error}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      <div className="mt-5">
        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-500 shadow-sm">Loading rankings...</div>
        ) : candidates.length ? (
          <>
            <p className="mb-3 text-sm font-semibold text-slate-500">{pagination.total} candidates found. Selection is capped at 20.</p>
            <CandidateRankingTable candidates={candidates} selectedIds={selectedIds} onToggle={toggleCandidate} onTogglePage={togglePage} />
            <CandidatePagination pagination={pagination} onPageChange={(page) => dispatch(setCandidateFilters({ page }))} />
          </>
        ) : (
          <EmptyState title="No candidates found" description="Choose a job or adjust filters to rank screened and unscreened candidates." icon={Sparkles} />
        )}
      </div>
    </div>
  );
};

export default AiRankingPage;
