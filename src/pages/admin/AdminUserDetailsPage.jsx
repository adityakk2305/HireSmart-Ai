import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AccountStatusModal from "../../components/admin/AccountStatusModal.jsx";
import Button from "../../components/common/Button.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { fetchAdminUserDetails, updateAdminUserStatus } from "../../features/admin/adminSlice.js";

const AdminUserDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedUser, saving } = useSelector((state) => state.admin);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => { dispatch(fetchAdminUserDetails(id)); }, [dispatch, id]);
  const user = selectedUser?.user;
  const submit = async (payload) => {
    await dispatch(updateAdminUserStatus({ id, payload })).unwrap();
    toast.success("User status updated");
    setModalOpen(false);
    dispatch(fetchAdminUserDetails(id));
  };
  return (
    <div>
      <PageHeader title={user?.name || "User details"} description="Authentication secrets and tokens are never shown." action={<Button variant="outline" onClick={() => setModalOpen(true)}>Change status</Button>} />
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <dl className="grid gap-4 md:grid-cols-2">
          {["email", "role", "accountStatus", "emailVerified"].map((key) => <div key={key}><dt className="text-xs font-bold uppercase text-slate-400">{key}</dt><dd className="mt-1 font-semibold text-slate-900">{String(user?.[key] ?? "Not available")}</dd></div>)}
          <div><dt className="text-xs font-bold uppercase text-slate-400">Company</dt><dd className="mt-1 font-semibold">{user?.company?.name || "Platform"}</dd></div>
          <div><dt className="text-xs font-bold uppercase text-slate-400">Last activity</dt><dd className="mt-1 font-semibold">{user?.lastActivity ? new Date(user.lastActivity).toLocaleString() : "Not available"}</dd></div>
        </dl>
      </section>
      <AccountStatusModal open={modalOpen} onClose={() => setModalOpen(false)} currentStatus={user?.accountStatus} label={user?.email} loading={saving} onSubmit={submit} />
    </div>
  );
};

export default AdminUserDetailsPage;
