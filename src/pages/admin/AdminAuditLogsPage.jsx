import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/common/Button.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { fetchAuditLogs } from "../../features/admin/adminSlice.js";

const AdminAuditLogsPage = () => {
  const dispatch = useDispatch();
  const { auditLogs } = useSelector((state) => state.admin);
  const [filters, setFilters] = useState({ action: "", entityType: "" });
  const load = () => dispatch(fetchAuditLogs(filters));
  useEffect(() => { load(); }, []);
  return (
    <div>
      <PageHeader title="Audit logs" description="Administrative audit visibility with safe metadata only." />
      <section className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <input className="rounded-md border border-slate-300 px-3 py-2" placeholder="Action" value={filters.action} onChange={(event) => setFilters({ ...filters, action: event.target.value })} />
          <input className="rounded-md border border-slate-300 px-3 py-2" placeholder="Entity type" value={filters.entityType} onChange={(event) => setFilters({ ...filters, entityType: event.target.value })} />
          <Button variant="outline" onClick={load}>Apply</Button>
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead><tr className="text-left text-slate-500"><th className="p-4">Timestamp</th><th>Actor</th><th>Action</th><th>Entity</th><th>Description</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => <tr key={log.id}><td className="p-4">{new Date(log.timestamp).toLocaleString()}</td><td>{log.actor} ({log.actorRole})</td><td>{log.action}</td><td>{log.entityType}: {log.entity}</td><td>{log.description}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminAuditLogsPage;
