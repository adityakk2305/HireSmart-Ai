import { useState } from "react";
import Button from "../common/Button.jsx";
import Modal from "../common/Modal.jsx";

const AccountStatusModal = ({ open, onClose, currentStatus = "Active", label = "account", onSubmit, loading }) => {
  const [status, setStatus] = useState(currentStatus === "Active" ? "Suspended" : "Active");
  const [reason, setReason] = useState("");

  const submit = (event) => {
    event.preventDefault();
    onSubmit?.({ status, reason });
  };

  return (
    <Modal open={open} onClose={onClose} title="Change account status">
      <form className="space-y-4" onSubmit={submit}>
        <p className="rounded-md bg-amber-50 p-3 text-sm font-semibold text-amber-800">
          Current status is {currentStatus}. Suspending may block access. Disabling does not delete data. Reactivation restores access without modifying records.
        </p>
        <label className="block text-sm font-semibold text-slate-700">
          New status
          <select className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Disabled">Disabled</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Reason
          <textarea className="mt-1 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2" value={reason} onChange={(event) => setReason(event.target.value)} placeholder={`Reason for changing ${label}`} required />
        </label>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Confirm</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AccountStatusModal;
