import { useEffect, useState } from "react";
import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";
import Modal from "../common/Modal.jsx";

const SendCandidateEmailModal = ({ open, candidate, templates = [], loading, onCancel, onSubmit }) => {
  const [values, setValues] = useState({ templateId: "", subject: "", message: "" });

  useEffect(() => {
    setValues({ templateId: templates[0]?.id || "", subject: "", message: "" });
  }, [open, templates]);

  const setField = (field, value) => setValues((current) => ({ ...current, [field]: value }));

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Send candidate email"
      footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={onCancel}>Cancel</Button><Button loading={loading} disabled={!candidate?.email} onClick={() => onSubmit(values)}>Send email</Button></div>}
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
          <p className="font-bold text-slate-950">{candidate?.fullName}</p>
          <p className="text-slate-600">{candidate?.email || "No recipient email available"}</p>
        </div>
        {!candidate?.email ? <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">Candidate has no email address. Save without email or update the candidate first.</p> : null}
        <label className="space-y-2 text-sm font-semibold text-slate-700">
          <span>Template</span>
          <select className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm" value={values.templateId} onChange={(event) => setField("templateId", event.target.value)}>
            <option value="">Custom message</option>
            {templates.map((template) => <option key={template.id} value={template.id}>{template.name} - {template.category}</option>)}
          </select>
        </label>
        {!values.templateId ? (
          <>
            <Input label="Subject" value={values.subject} onChange={(event) => setField("subject", event.target.value)} />
            <label className="space-y-2 text-sm font-semibold text-slate-700">
              <span>Message</span>
              <textarea className="min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={values.message} onChange={(event) => setField("message", event.target.value)} />
            </label>
          </>
        ) : null}
        <p className="text-sm text-slate-500">Mock mode creates a delivery log without sending real email. Each bulk recipient is sent as a separate message.</p>
      </div>
    </Modal>
  );
};

export default SendCandidateEmailModal;
