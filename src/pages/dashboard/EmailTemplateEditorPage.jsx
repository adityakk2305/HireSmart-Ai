import { ArrowLeft, Eye, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import EmailTemplatePreview from "../../components/emails/EmailTemplatePreview.jsx";
import EmailVariablePicker from "../../components/emails/EmailVariablePicker.jsx";
import { createEmailTemplate, fetchEmailTemplateById, previewEmailTemplate, updateEmailTemplate } from "../../features/emails/emailSlice.js";
import { EMAIL_TEMPLATE_CATEGORIES } from "../../utils/emailConstants.js";

const fieldClass = "h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const emptyForm = {
  name: "",
  slug: "",
  category: "Custom",
  subject: "",
  htmlBody: "<p>Hello {{candidateFirstName}},</p><p></p><p>Regards,<br />{{senderName}}</p>",
  textBody: "",
  isActive: true
};

const EmailTemplateEditorPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedTemplate, preview, saving } = useSelector((state) => state.emails);
  const [form, setForm] = useState(emptyForm);
  const [targetField, setTargetField] = useState("htmlBody");
  const refs = { subject: useRef(null), htmlBody: useRef(null), textBody: useRef(null) };

  useEffect(() => {
    if (isEdit) dispatch(fetchEmailTemplateById(id));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && selectedTemplate) {
      setForm({
        name: selectedTemplate.name,
        slug: selectedTemplate.slug,
        category: selectedTemplate.category,
        subject: selectedTemplate.subject,
        htmlBody: selectedTemplate.htmlBody,
        textBody: selectedTemplate.textBody,
        isActive: selectedTemplate.isActive
      });
    }
  }, [isEdit, selectedTemplate]);

  useEffect(() => {
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const insertVariable = (variable) => {
    const field = targetField;
    const element = refs[field]?.current;
    const start = element?.selectionStart ?? form[field].length;
    const end = element?.selectionEnd ?? form[field].length;
    const next = `${form[field].slice(0, start)}${variable}${form[field].slice(end)}`;
    setField(field, next);
  };

  const previewNow = async () => {
    try {
      await dispatch(previewEmailTemplate(form)).unwrap();
      toast.success("Preview generated");
    } catch (error) {
      toast.error(error || "Unable to preview template");
    }
  };

  const save = async (event) => {
    event.preventDefault();
    try {
      const template = isEdit
        ? await dispatch(updateEmailTemplate({ id, payload: form })).unwrap()
        : await dispatch(createEmailTemplate(form)).unwrap();
      toast.success(isEdit ? "Template updated" : "Template created");
      navigate(`/dashboard/email-templates/${template.id}/edit`);
    } catch (error) {
      toast.error(error || "Unable to save template");
    }
  };

  return (
    <div>
      <PageHeader title={isEdit ? "Edit Email Template" : "New Email Template"} description="Use approved variables only. Preview rendering is sanitized by the backend." action={<Link to="/dashboard/email-templates"><Button variant="outline" icon={ArrowLeft}>Back</Button></Link>} />
      <form onSubmit={save} className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <section className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Template name" value={form.name} onChange={(event) => setField("name", event.target.value)} required />
            <Input label="Slug" value={form.slug} onChange={(event) => setField("slug", event.target.value)} />
            <label className="space-y-2 text-sm font-semibold text-slate-700"><span>Category</span><select className={fieldClass} value={form.category} onChange={(event) => setField("category", event.target.value)}>{EMAIL_TEMPLATE_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="flex items-center gap-2 pt-8 text-sm font-semibold text-slate-700"><input type="checkbox" checked={form.isActive} onChange={(event) => setField("isActive", event.target.checked)} /> Active</label>
          </div>
          <label className="space-y-2 text-sm font-semibold text-slate-700"><span>Subject</span><input ref={refs.subject} className={fieldClass} value={form.subject} onFocus={() => setTargetField("subject")} onChange={(event) => setField("subject", event.target.value)} required /></label>
          <label className="space-y-2 text-sm font-semibold text-slate-700"><span>HTML body</span><textarea ref={refs.htmlBody} className="min-h-72 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm" value={form.htmlBody} onFocus={() => setTargetField("htmlBody")} onChange={(event) => setField("htmlBody", event.target.value)} /></label>
          <label className="space-y-2 text-sm font-semibold text-slate-700"><span>Plain text body</span><textarea ref={refs.textBody} className="min-h-40 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm" value={form.textBody} onFocus={() => setTargetField("textBody")} onChange={(event) => setField("textBody", event.target.value)} /></label>
          <div className="flex justify-end gap-3"><Button type="button" variant="outline" icon={Eye} onClick={previewNow}>Preview</Button><Button type="submit" icon={Save} loading={saving}>Save</Button></div>
        </section>
        <aside className="space-y-5">
          <EmailVariablePicker onInsert={insertVariable} />
          <EmailTemplatePreview preview={preview} />
        </aside>
      </form>
    </div>
  );
};

export default EmailTemplateEditorPage;
