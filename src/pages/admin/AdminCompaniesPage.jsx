import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AccountStatusModal from "../../components/admin/AccountStatusModal.jsx";
import Button from "../../components/common/Button.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { fetchAdminCompanies, updateAdminCompanyStatus } from "../../features/admin/adminSlice.js";

const AdminCompaniesPage = () => {
  const dispatch = useDispatch();
  const { companies, saving } = useSelector((state) => state.admin);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [target, setTarget] = useState(null);
  const load = () => dispatch(fetchAdminCompanies(filters));
  useEffect(() => { load(); }, []);
  const submit = async (payload) => {
    await dispatch(updateAdminCompanyStatus({ id: target.id, payload })).unwrap();
    toast.success("Company status updated");
    setTarget(null);
    load();
  };
  return (
    <div>
      <PageHeader title="Admin companies" description="Safe company management without hard deletion." />
      <section className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <input className="rounded-md border border-slate-300 px-3 py-2" placeholder="Search companies" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
          <select className="rounded-md border border-slate-300 px-3 py-2" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
            <option value="">All statuses</option><option value="Active">Active</option><option value="Suspended">Suspended</option><option value="Disabled">Disabled</option>
          </select>
          <Button variant="outline" onClick={load}>Apply</Button>
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead><tr className="text-left text-slate-500"><th className="p-4">Company</th><th>Industry</th><th>Status</th><th>Users</th><th>Jobs</th><th>Candidates</th><th></th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {companies.map((company) => (
                <tr key={company.id}>
                  <td className="p-4 font-semibold text-slate-950">{company.name}</td><td>{company.industry}</td><td>{company.accountStatus}</td><td>{company.userCount}</td><td>{company.jobCount}</td><td>{company.candidateCount}</td>
                  <td className="space-x-2"><Link to={`/admin/companies/${company.id}`}><Button variant="outline" size="sm">View</Button></Link><Button variant="outline" size="sm" onClick={() => setTarget(company)}>Status</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <AccountStatusModal open={Boolean(target)} onClose={() => setTarget(null)} currentStatus={target?.accountStatus} label={target?.name} loading={saving} onSubmit={submit} />
    </div>
  );
};

export default AdminCompaniesPage;
