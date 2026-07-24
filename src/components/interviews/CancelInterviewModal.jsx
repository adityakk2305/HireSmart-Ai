import { useState } from "react";
import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";
import Modal from "../common/Modal.jsx";

const CancelInterviewModal = ({ open, interview, loading, onCancel, onSubmit }) => {
  const [reason, setReason] = useState("");
  const [notifyCandidate, setNotifyCandidate] = useState(false);
  return (
    <Modal open={open} onClose={onCancel} title="Cancel interview" footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={onCancel}>Back</Button><Button variant="danger" loading={loading} onClick={() => onSubmit({ reason, notifyCandidate })}>Cancel interview</Button></div>}>
      <div className="space-y-4">
        <p className="text-sm text-slate-600">This cancels {interview?.title}. Candidate email is optional and logged separately.</p>
        <Input label="Cancellation reason" name="reason" value={reason} onChange={(event) => setReason(event.target.value)} required />
        <label className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700">
          <input type="checkbox" checked={notifyCandidate} onChange={(event) => setNotifyCandidate(event.target.checked)} />
          <span>Notify candidate by cancellation email after saving. Cancellation succeeds even if email fails.</span>
        </label>
      </div>
    </Modal>
  );
};

export default CancelInterviewModal;
