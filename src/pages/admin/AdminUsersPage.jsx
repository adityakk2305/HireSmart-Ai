import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AccountStatusModal from "../../components/admin/AccountStatusModal.jsx";
import Button from "../../components/common/Button.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { fetchAdminUsers, updateAdminUserStatus } from "../../features/admin/adminSlice.js";

const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const { users, saving } = useSelector((state) => state.admin);
  const [filters, setFilters] = useState({ search: "", role: "", status: "" });
  const [target, setTarget] = useState(null);
  const load = () => dispatch(fetchAdminUsers(filters));
  useEffect(() => { load(); }, []);
  const submit = async (payload) => {
    await dispatch(updateAdminUserStatus({ id: target.id, payload })).unwrap();
    toast.success("User status updated");
    setTarget(null);
    load();
  };
  return (
    <div>
      <PageHeader title="Admin users" description="Safe user management without exposing authentication secrets." />
      <section className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <input className="rounded-md border border-slate-300 px-3 py-2" placeholder="Search users" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
          <select className="rounded-md border border-slate-300 px-3 py-2" value={filters.role} onChange={(event) => setFilters({ ...filters, role: event.target.value })}><option value="">All roles</option><option value="hr">HR</option><option value="admin">Admin</option></select>
          <select className="rounded-md border border-slate-300 px-3 py-2" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">All statuses</option><option value="Active">Active</option><option value="Suspended">Suspended</option><option value="Disabled">Disabled</option></select>
          <Button variant="outline" onClick={load}>Apply</Button>
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead><tr className="text-left text-slate-500"><th className="p-4">User</th><th>Role</th><th>Company</th><th>Status</th><th>Last login</th><th></th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => <tr key={user.id}><td className="p-4 font-semibold">{user.name}<p className="text-xs text-slate-500">{user.email}</p></td><td>{user.role}</td><td>{user.company?.name || "Platform"}</td><td>{user.accountStatus}</td><td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}</td><td className="space-x-2"><Link to={`/admin/users/${user.id}`}><Button variant="outline" size="sm">View</Button></Link><Button variant="outline" size="sm" onClick={() => setTarget(user)}>Status</Button></td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
      <AccountStatusModal open={Boolean(target)} onClose={() => setTarget(null)} currentStatus={target?.accountStatus} label={target?.email} loading={saving} onSubmit={submit} />
    </div>
  );
};

export default AdminUsersPage;
