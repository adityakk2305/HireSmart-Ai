import { Copy, Eye, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Modal from "../../components/common/Modal.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import EmailTemplatePreview from "../../components/emails/EmailTemplatePreview.jsx";
import { deleteEmailTemplate, duplicateEmailTemplate, fetchEmailTemplates, previewEmailTemplate, resetEmailTemplate } from "../../features/emails/emailSlice.js";
import { EMAIL_TEMPLATE_CATEGORIES } from "../../utils/emailConstants.js";

const EmailTemplatesPage = () => {
  const dispatch = useDispatch();
  const { templates, templatesLoading, preview } = useSelector((state) => state.emails);
  const [filters, setFilters] = useState({ search: "", category: "", isActive: "" });
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEmailTemplates(filters));
  }, [dispatch, filters]);

  const action = async (promise, message) => {
    try {
      await promise.unwrap();
      toast.success(message);
      dispatch(fetchEmailTemplates(filters));
    } catch (error) {
      toast.error(error || "Template action failed");
    }
  };

  const previewTemplate = async (template) => {
    try {
      await dispatch(previewEmailTemplate({ templateId: template.id })).unwrap();
      setPreviewOpen(true);
    } catch (error) {
      toast.error(error || "Unable to preview template");
    }
  };

  return (
    <div>
      <PageHeader title="Email Templates" description="Create and manage approved reusable candidate communication templates." action={<Link to="/dashboard/email-templates/new"><Button icon={Plus}>New Template</Button></Link>} />
      <section className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Search" value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} />
          <label className="space-y-2 text-sm font-semibold text-slate-700"><span>Category</span><select className="h-11 w-full rounded-lg border border-slate-300 px-3" value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}><option value="">All</option>{EMAIL_TEMPLATE_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="space-y-2 text-sm font-semibold text-slate-700"><span>Status</span><select className="h-11 w-full rounded-lg border border-slate-300 px-3" value={filters.isActive} onChange={(event) => setFilters((current) => ({ ...current, isActive: event.target.value }))}><option value="">All</option><option value="true">Active</option><option value="false">Inactive</option></select></label>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <article key={template.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-slate-950">{template.name}</p>
                <p className="mt-1 text-sm text-slate-500">{template.category}</p>
              </div>
              <div className="flex gap-2">
                {template.isDefault ? <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">Default</span> : null}
                <span className={`rounded-full px-2 py-1 text-xs font-bold ${template.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{template.isActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-slate-600">{template.subject}</p>
            <p className="mt-3 text-xs font-semibold uppercase text-slate-400">Version {template.version}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" icon={Eye} onClick={() => previewTemplate(template)}>Preview</Button>
              <Link to={`/dashboard/email-templates/${template.id}/edit`}><Button size="sm" variant="outline" icon={Pencil}>Edit</Button></Link>
              <Button size="sm" variant="outline" icon={Copy} onClick={() => action(dispatch(duplicateEmailTemplate(template.id)), "Template duplicated")}>Duplicate</Button>
              <Button size="sm" variant="outline" icon={RotateCcw} onClick={() => action(dispatch(resetEmailTemplate(template.id)), "Template reset")}>Reset</Button>
              <Button size="sm" variant="outline" icon={Trash2} onClick={() => action(dispatch(deleteEmailTemplate(template.id)), template.isDefault ? "Default template disabled" : "Template deleted")}>{template.isDefault ? "Disable" : "Delete"}</Button>
            </div>
          </article>
        ))}
      </div>
      {!templates.length && !templatesLoading ? <p className="rounded-lg border border-dashed border-slate-300 p-6 text-sm font-semibold text-slate-500">No templates match these filters.</p> : null}
      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Template preview" footer={<div className="flex justify-end"><Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button></div>}>
        <EmailTemplatePreview preview={preview} />
      </Modal>
    </div>
  );
};

export default EmailTemplatesPage;
