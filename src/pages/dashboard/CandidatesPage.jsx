import { Download, Scale, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { openCandidateResume } from "../../api/candidateApi.js";
import { getJobsRequest } from "../../api/jobApi.js";
import CandidateFilters from "../../components/candidates/CandidateFilters.jsx";
import CandidateMobileCard from "../../components/candidates/CandidateMobileCard.jsx";
import CandidatePagination from "../../components/candidates/CandidatePagination.jsx";
import CandidateTable from "../../components/candidates/CandidateTable.jsx";
import UpdateCandidateStatusModal from "../../components/candidates/UpdateCandidateStatusModal.jsx";
import Button from "../../components/common/Button.jsx";
import ConfirmationDialog from "../../components/common/ConfirmationDialog.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import {
  addRecruiterNote,
  clearSelectedCandidateIds,
  exportCandidates,
  fetchCandidates,
  performBulkCandidateAction,
  resetCandidateFilters,
  setCandidateFilters,
  setSelectedCandidateIds,
  softDeleteCandidate,
  updateCandidateStatus
} from "../../features/candidates/candidateSlice.js";
import useDebounce from "../../hooks/useDebounce.js";
import { DEFAULT_CANDIDATE_FILTERS } from "../../utils/constants.js";

const filterKeys = Object.keys(DEFAULT_CANDIDATE_FILTERS);

const paramsToFilters = (searchParams, presetStatus) => {
  const next = { ...DEFAULT_CANDIDATE_FILTERS };
  filterKeys.forEach((key) => {
    const value = searchParams.get(key);
    if (value !== null) next[key] = value;
  });
  if (presetStatus) next.status = presetStatus;
  return next;
};

const filtersToParams = (filters, presetStatus) => {
  const params = {};
  filterKeys.forEach((key) => {
    if (presetStatus && key === "status") return;
    const value = filters[key];
    if (value !== "" && value !== undefined && value !== null && !(key === "page" && Number(value) === 1)) {
      params[key] = String(value);
    }
  });
  return params;
};

const SummaryCard = ({ label, value }) => (
  <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
    <p className="mt-2 text-2xl font-black text-slate-950">{value ?? 0}</p>
  </article>
);

const CandidatesPage = ({ presetStatus = "", title = "Candidates" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    candidates,
    filters,
    summary,
    selectedCandidateIds,
    pagination,
    loading,
    saving,
    deleting,
    exporting,
    bulkActionLoading,
    error
  } = useSelector((state) => state.candidates);
  const [jobs, setJobs] = useState([]);
  const [statusCandidate, setStatusCandidate] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const initialized = useRef(false);
  const debouncedSearch = useDebounce(filters.search, 400);
  const effectiveFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch, status: presetStatus || filters.status }),
    [filters, debouncedSearch, presetStatus]
  );

  useEffect(() => {
    dispatch(setCandidateFilters(paramsToFilters(searchParams, presetStatus)));
    initialized.current = true;
  }, [dispatch, presetStatus]);

  useEffect(() => {
    if (!initialized.current) return;
    setSearchParams(filtersToParams(filters, presetStatus), { replace: true });
  }, [filters, presetStatus, setSearchParams]);

  useEffect(() => {
    getJobsRequest({ page: 1, limit: 100, sort: "newest" })
      .then((data) => setJobs(data.jobs))
      .catch(() => setJobs([]));
  }, []);

  useEffect(() => {
    if (initialized.current) dispatch(fetchCandidates(effectiveFilters));
  }, [dispatch, effectiveFilters]);

  const refresh = () => dispatch(fetchCandidates(effectiveFilters));

  const updateFilters = (updates) => dispatch(setCandidateFilters({ ...updates, ...(presetStatus ? { status: presetStatus } : {}) }));
  const resetFilters = () => {
    dispatch(resetCandidateFilters());
    if (presetStatus) dispatch(setCandidateFilters({ status: presetStatus }));
    setSearchParams({});
  };

  const toggleCandidate = (id, checked) => {
    dispatch(setSelectedCandidateIds(checked ? [...new Set([...selectedCandidateIds, id])] : selectedCandidateIds.filter((item) => item !== id)));
  };

  const togglePage = (checked) => {
    dispatch(setSelectedCandidateIds(checked ? candidates.map((candidate) => candidate.id) : []));
  };

  const submitStatus = async (payload) => {
    try {
      await dispatch(updateCandidateStatus({ id: statusCandidate.id, payload })).unwrap();
      toast.success("Candidate status updated");
      setStatusCandidate(null);
      refresh();
    } catch (apiError) {
      toast.error(apiError || "Unable to update status");
    }
  };

  const confirmDelete = async () => {
    const reason = window.prompt("Deletion reason");
    if (reason === null) return;
    try {
      await dispatch(softDeleteCandidate({ id: deleteTarget.id, deletionReason: reason })).unwrap();
      toast.success("Candidate soft-deleted");
      setDeleteTarget(null);
      refresh();
    } catch (apiError) {
      toast.error(apiError || "Unable to delete candidate");
    }
  };

  const openResume = async (candidate) => {
    try {
      await openCandidateResume(candidate.id);
    } catch (apiError) {
      toast.error(apiError.response?.data?.message || "Unable to open resume");
    }
  };

  const addNote = async (candidate) => {
    const text = window.prompt(`Add recruiter note for ${candidate.fullName}`);
    if (!text?.trim()) return;
    try {
      await dispatch(addRecruiterNote({ id: candidate.id, text })).unwrap();
      toast.success("Note added");
    } catch (apiError) {
      toast.error(apiError || "Unable to add note");
    }
  };

  const selectedCandidates = candidates.filter((candidate) => selectedCandidateIds.includes(candidate.id));
  const canCompare = selectedCandidates.length >= 2 && selectedCandidates.length <= 4 && new Set(selectedCandidates.map((candidate) => candidate.job?.id)).size === 1;

  const runBulkStatus = async (status) => {
    const note = window.prompt(`Add a note for bulk ${status}`);
    if ((status === "Rejected" || status === "Under Review") && !note?.trim()) {
      toast.error("A note is required for this status change");
      return;
    }
    if (!window.confirm(`Change ${selectedCandidateIds.length} candidate status to ${status}?`)) return;
    try {
      const result = await dispatch(performBulkCandidateAction({ candidateIds: selectedCandidateIds, action: "change-status", status, note: note || "" })).unwrap();
      toast.success(`Bulk action completed: ${result.successful} succeeded, ${result.failed} failed`);
      refresh();
    } catch (apiError) {
      toast.error(apiError || "Bulk action failed");
    }
  };

  const runBulkDelete = async () => {
    const deletionReason = window.prompt("Deletion reason for selected candidates");
    if (deletionReason === null) return;
    if (!window.confirm(`Soft-delete ${selectedCandidateIds.length} selected candidates?`)) return;
    try {
      const result = await dispatch(performBulkCandidateAction({ candidateIds: selectedCandidateIds, action: "soft-delete", deletionReason })).unwrap();
      toast.success(`Bulk delete completed: ${result.successful} succeeded, ${result.failed} failed`);
      refresh();
    } catch (apiError) {
      toast.error(apiError || "Bulk delete failed");
    }
  };

  const exportFiltered = async () => {
    try {
      await dispatch(exportCandidates({ params: effectiveFilters, filename: "hiresmart-candidates.csv" })).unwrap();
      toast.success("CSV export started");
    } catch (apiError) {
      toast.error(apiError || "Unable to export candidates");
    }
  };

  const exportSelected = async () => {
    try {
      await dispatch(exportCandidates({ params: { candidateIds: selectedCandidateIds.join(",") }, filename: "hiresmart-selected-candidates.csv" })).unwrap();
      toast.success("Selected CSV export started");
    } catch (apiError) {
      toast.error(apiError || "Unable to export selected candidates");
    }
  };

  return (
    <div>
      <PageHeader
        title={title}
        description="Search, filter, compare, export and manage candidate workflows with company-scoped data."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" icon={Download} loading={exporting} onClick={exportFiltered}>Export filtered</Button>
            <Link to="/dashboard/candidates/upload">
              <Button icon={Upload}>Upload candidate</Button>
            </Link>
          </div>
        }
      />

      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <SummaryCard label="Total" value={summary?.total} />
        <SummaryCard label="Under review" value={summary?.underReview} />
        <SummaryCard label="Shortlisted" value={summary?.shortlisted} />
        <SummaryCard label="Rejected" value={summary?.rejected} />
        <SummaryCard label="On hold" value={summary?.onHold} />
        <SummaryCard label="Avg AI score" value={summary?.averageAiScore} />
      </section>

      <CandidateFilters filters={filters} jobs={jobs} onChange={updateFilters} onReset={resetFilters} />

      {selectedCandidateIds.length ? (
        <section className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-blue-900">{selectedCandidateIds.length} selected</span>
            <Button size="sm" variant="outline" loading={bulkActionLoading} onClick={() => runBulkStatus("Under Review")}>Under review</Button>
            <Button size="sm" variant="outline" loading={bulkActionLoading} onClick={() => runBulkStatus("Shortlisted")}>Shortlist</Button>
            <Button size="sm" variant="outline" loading={bulkActionLoading} onClick={() => runBulkStatus("On Hold")}>On hold</Button>
            <Button size="sm" variant="danger" loading={bulkActionLoading} onClick={() => runBulkStatus("Rejected")}>Reject</Button>
            <Button size="sm" variant="outline" icon={Scale} disabled={!canCompare} onClick={() => navigate(`/dashboard/candidates/compare?ids=${selectedCandidateIds.join(",")}`)}>Compare</Button>
            <Button size="sm" variant="outline" icon={Download} loading={exporting} onClick={exportSelected}>Export selected</Button>
            <Button size="sm" variant="danger" loading={bulkActionLoading} onClick={runBulkDelete}>Delete</Button>
            <Button size="sm" variant="outline" icon={X} onClick={() => dispatch(clearSelectedCandidateIds())}>Clear</Button>
          </div>
        </section>
      ) : null}

      {error ? <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div> : null}

      <div className="mt-5">
        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-500 shadow-sm">Loading candidates...</div>
        ) : candidates.length ? (
          <>
            <p className="mb-3 text-sm font-semibold text-slate-500">{pagination.total} candidates found</p>
            <CandidateTable
              candidates={candidates}
              selectedIds={selectedCandidateIds}
              onSelect={toggleCandidate}
              onSelectPage={togglePage}
              onStatus={setStatusCandidate}
              onDelete={setDeleteTarget}
              onResume={openResume}
              onAddNote={addNote}
              onCompare={(candidate) => navigate(`/dashboard/candidates/compare?ids=${candidate.id}`)}
            />
            <div className="space-y-4 lg:hidden">
              {candidates.map((candidate) => (
                <CandidateMobileCard
                  key={candidate.id}
                  candidate={candidate}
                  selected={selectedCandidateIds.includes(candidate.id)}
                  onSelect={toggleCandidate}
                  onStatus={setStatusCandidate}
                  onDelete={setDeleteTarget}
                  onResume={openResume}
                  onAddNote={addNote}
                  onCompare={(item) => navigate(`/dashboard/candidates/compare?ids=${item.id}`)}
                />
              ))}
            </div>
            <CandidatePagination pagination={pagination} onPageChange={(page) => dispatch(setCandidateFilters({ page }))} />
          </>
        ) : (
          <EmptyState title="No candidates found" description="Adjust filters or upload a candidate to continue." icon={Upload} />
        )}
      </div>

      <UpdateCandidateStatusModal
        open={Boolean(statusCandidate)}
        candidate={statusCandidate}
        loading={saving}
        onCancel={() => setStatusCandidate(null)}
        onSubmit={submitStatus}
      />
      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        title="Soft-delete candidate"
        description={`${deleteTarget?.fullName || "This candidate"} will be removed from normal lists. No email will be sent and the resume remains stored for audit until cleanup policy is implemented.`}
        confirmLabel="Soft delete"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default CandidatesPage;
