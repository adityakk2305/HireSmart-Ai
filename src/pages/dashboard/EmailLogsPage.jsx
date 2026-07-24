import { Filter, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import EmailLogTable from "../../components/emails/EmailLogTable.jsx";
import { cancelEmailLog, fetchEmailLogs, resetEmailLogFilters, retryEmailLog, setEmailLogFilters } from "../../features/emails/emailSlice.js";
import { EMAIL_LOG_STATUSES, EMAIL_PROVIDERS, EMAIL_TYPES } from "../../utils/emailConstants.js";

const EmailLogsPage = () => {
  const dispatch = useDispatch();
  const { logs, filters, pagination, loading } = useSelector((state) => state.emails);

  useEffect(() => {
    dispatch(fetchEmailLogs(filters));
  }, [dispatch, filters]);

  const change = (patch) => dispatch(setEmailLogFilters({ ...patch, page: patch.page || 1 }));

  const retry = async (log) => {
    try {
      await dispatch(retryEmailLog(log.id)).unwrap();
      toast.success("Email retry processed");
      dispatch(fetchEmailLogs(filters));
    } catch (error) {
      toast.error(error || "Unable to retry email");
    }
  };

  const cancel = async (log) => {
    try {
      await dispatch(cancelEmailLog(log.id)).unwrap();
      toast.success("Queued email cancelled");
      dispatch(fetchEmailLogs(filters));
    } catch (error) {
      toast.error(error || "Unable to cancel email");
    }
  };

  return (
    <div>
      <PageHeader title="Email Logs" description="Audit candidate communication by status, provider, type and delivery result." />
      <section className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Input label="Search" value={filters.search} onChange={(event) => change({ search: event.target.value })} />
          <label className="space-y-2 text-sm font-semibold text-slate-700"><span>Status</span><select className="h-11 w-full rounded-lg border border-slate-300 px-3" value={filters.status} onChange={(event) => change({ status: event.target.value })}><option value="">All</option>{EMAIL_LOG_STATUSES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="space-y-2 text-sm font-semibold text-slate-700"><span>Type</span><select className="h-11 w-full rounded-lg border border-slate-300 px-3" value={filters.emailType} onChange={(event) => change({ emailType: event.target.value })}><option value="">All</option>{EMAIL_TYPES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="space-y-2 text-sm font-semibold text-slate-700"><span>Provider</span><select className="h-11 w-full rounded-lg border border-slate-300 px-3" value={filters.provider} onChange={(event) => change({ provider: event.target.value })}><option value="">All</option>{EMAIL_PROVIDERS.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <Input label="From" type="date" value={filters.dateFrom} onChange={(event) => change({ dateFrom: event.target.value })} />
          <Input label="To" type="date" value={filters.dateTo} onChange={(event) => change({ dateTo: event.target.value })} />
        </div>
        <div className="mt-4 flex justify-between">
          <Button variant="outline" icon={RotateCcw} onClick={() => dispatch(resetEmailLogFilters())}>Reset</Button>
          <Button variant="outline" icon={Filter} onClick={() => dispatch(fetchEmailLogs(filters))} loading={loading}>Apply</Button>
        </div>
      </section>

      <EmailLogTable logs={logs} onRetry={retry} onCancel={cancel} />

      <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-sm font-semibold">
        <span>Page {pagination.page} of {pagination.pages} - {pagination.total} logs</span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={!pagination.hasPreviousPage} onClick={() => change({ page: pagination.page - 1 })}>Previous</Button>
          <Button size="sm" variant="outline" disabled={!pagination.hasNextPage} onClick={() => change({ page: pagination.page + 1 })}>Next</Button>
        </div>
      </div>
    </div>
  );
};

export default EmailLogsPage;
