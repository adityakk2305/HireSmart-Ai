import { useEffect, useMemo, useState } from "react";
import Button from "../common/Button.jsx";
import Modal from "../common/Modal.jsx";

const transitions = {
  Applied: ["Under Review", "Rejected", "On Hold"],
  "Resume Parsed": ["AI Screening Completed", "Under Review", "Rejected", "On Hold"],
  "AI Screening Completed": ["Under Review", "Shortlisted", "Rejected", "On Hold"],
  "Under Review": ["Shortlisted", "Rejected", "On Hold"],
  "On Hold": ["Under Review", "Shortlisted", "Rejected"],
  Shortlisted: ["Under Review", "Rejected", "On Hold", "Interview Scheduled"],
  "Interview Scheduled": ["Interview Completed", "Rejected", "On Hold"],
  "Interview Completed": ["Selected", "Rejected", "On Hold"],
  Selected: ["On Hold"],
  Rejected: ["Under Review"]
};

const noteRequired = (from, to) =>
  to === "Rejected" || (from === "Rejected" && to === "Under Review") || (from === "Selected" && to === "On Hold");

const UpdateCandidateStatusModal = ({ open, candidate, loading, onCancel, onSubmit }) => {
  const allowedStatuses = useMemo(() => transitions[candidate?.status] || [], [candidate?.status]);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setStatus(allowedStatuses[0] || "");
    setNote("");
    setSendEmail(false);
    setError("");
  }, [allowedStatuses, open]);

  const submit = () => {
    if (!status) {
      setError("Select a status");
      return;
    }

    if (noteRequired(candidate?.status, status) && !note.trim()) {
      setError("A note is required for this status change");
      return;
    }

    onSubmit({ status, note, sendEmail });
  };

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Update candidate status"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button onClick={submit} loading={loading}>Update status</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Candidate: <span className="font-bold text-slate-900">{candidate?.fullName}</span>
        </p>
        <p className="text-sm text-slate-600">
          Current status: <span className="font-bold text-slate-900">{candidate?.status}</span>
        </p>
        <p className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-800">
          This is a manual recruiter decision. AI screening does not automatically change candidate status.
        </p>
        {candidate?.overallScore !== null && candidate?.overallScore !== undefined ? (
          <p className="text-sm text-slate-600">AI context: {candidate.overallScore}/100 - {candidate.category || "Uncategorized"}</p>
        ) : null}
        {allowedStatuses.length ? (
          <select className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}>
            {allowedStatuses.map((item) => <option key={item}>{item}</option>)}
          </select>
        ) : (
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
            No next statuses are available for this candidate.
          </p>
        )}
        <textarea
          className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder={noteRequired(candidate?.status, status) ? "Status note required" : "Status note optional"}
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        {status === "Rejected" ? (
          <p className="text-sm font-semibold text-red-600">This action changes the candidate workflow status. A rejection email is sent only if you choose it below.</p>
        ) : null}
        {status === "Shortlisted" ? (
          <p className="text-sm font-semibold text-blue-700">The candidate will be moved to Shortlisted for recruiter follow-up.</p>
        ) : null}
        {["Shortlisted", "Rejected", "Selected", "On Hold"].includes(status) ? (
          <label className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={sendEmail} onChange={(event) => setSendEmail(event.target.checked)} />
            <span>Update status and send the matching candidate email. Status update and email delivery are reported separately.</span>
          </label>
        ) : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </Modal>
  );
};

export default UpdateCandidateStatusModal;
