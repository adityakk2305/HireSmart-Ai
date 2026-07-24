import { useState } from "react";
import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";
import Modal from "../common/Modal.jsx";
import { INTERVIEW_DURATIONS, TIMEZONES, formatInterviewDateTime } from "../../utils/interviewConstants.js";

const RescheduleInterviewModal = ({ open, interview, loading, onCancel, onSubmit }) => {
  const [form, setForm] = useState({ date: "", time: "", durationMinutes: 60, timezone: "Asia/Kolkata", reason: "", notifyCandidate: false });
  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = () => onSubmit({
    startTime: new Date(`${form.date}T${form.time}:00`).toISOString(),
    durationMinutes: Number(form.durationMinutes),
    timezone: form.timezone,
    reason: form.reason,
    notifyCandidate: form.notifyCandidate
  });

  return (
    <Modal open={open} onClose={onCancel} title="Reschedule interview" footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={onCancel}>Cancel</Button><Button loading={loading} onClick={submit}>Save</Button></div>}>
      <div className="space-y-4">
        <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">Current: {formatInterviewDateTime(interview?.startTime, interview?.timezone)}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="New date" name="date" type="date" value={form.date} onChange={handleChange} required />
          <Input label="New time" name="time" type="time" value={form.time} onChange={handleChange} required />
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Duration</label>
            <select name="durationMinutes" value={form.durationMinutes} onChange={handleChange} className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm">
              {INTERVIEW_DURATIONS.map((item) => <option key={item} value={item}>{item} minutes</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Timezone</label>
            <select name="timezone" value={form.timezone} onChange={handleChange} className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm">
              {TIMEZONES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>
        <Input label="Reason" name="reason" value={form.reason} onChange={handleChange} required />
        <label className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700">
          <input type="checkbox" name="notifyCandidate" checked={form.notifyCandidate} onChange={(event) => setForm((current) => ({ ...current, notifyCandidate: event.target.checked }))} />
          <span>Notify candidate by reschedule email after saving. Reschedule succeeds even if email fails.</span>
        </label>
      </div>
    </Modal>
  );
};

export default RescheduleInterviewModal;
