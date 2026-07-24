import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AccountStatusModal from "../../components/admin/AccountStatusModal.jsx";
import MetricCard from "../../components/analytics/MetricCard.jsx";
import Button from "../../components/common/Button.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { fetchAdminCompanyDetails, updateAdminCompanyStatus } from "../../features/admin/adminSlice.js";

const AdminCompanyDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedCompany, saving } = useSelector((state) => state.admin);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => { dispatch(fetchAdminCompanyDetails(id)); }, [dispatch, id]);
  const company = selectedCompany?.company;
  const submit = async (payload) => {
    await dispatch(updateAdminCompanyStatus({ id, payload })).unwrap();
    toast.success("Company status updated");
    setModalOpen(false);
    dispatch(fetchAdminCompanyDetails(id));
  };
  return (
    <div>
      <PageHeader title={company?.name || "Company details"} description="Safe company details. Resume data, notes, SMTP credentials, and email bodies are excluded." action={<Button variant="outline" onClick={() => setModalOpen(true)}>Change status</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Users" value={company?.userCount || 0} />
        <MetricCard label="Jobs" value={company?.jobCount || 0} />
        <MetricCard label="Candidates" value={company?.candidateCount || 0} />
        <MetricCard label="Interviews" value={company?.interviewCount || 0} />
        <MetricCard label="Emails" value={company?.emailCount || 0} />
      </div>
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold">Status history</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          {(company?.statusHistory || []).length ? company.statusHistory.map((item, index) => <p key={index}>{item.previousStatus || "New"} to {item.newStatus}: {item.reason}</p>) : <p>No status changes recorded.</p>}
        </div>
      </section>
      <AccountStatusModal open={modalOpen} onClose={() => setModalOpen(false)} currentStatus={company?.accountStatus} label={company?.name} loading={saving} onSubmit={submit} />
    </div>
  );
};

export default AdminCompanyDetailsPage;
