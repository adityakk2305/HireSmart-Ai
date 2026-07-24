const EmailTemplatePreview = ({ preview }) => (
  <div className="space-y-4">
    {!preview ? <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-500">Generate a preview to see rendered content.</p> : null}
    {preview ? (
      <>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-bold uppercase text-slate-400">Subject preview</p>
          <p className="mt-2 font-bold text-slate-950">{preview.subject}</p>
        </div>
        {preview.missingVariables?.length ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
            Missing variables: {preview.missingVariables.join(", ")}
          </p>
        ) : null}
        {preview.invalidVariables?.length ? (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
            Invalid variables: {preview.invalidVariables.join(", ")}
          </p>
        ) : null}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="mb-3 text-xs font-bold uppercase text-slate-400">HTML preview</p>
          <iframe
            title="Email HTML preview"
            sandbox=""
            className="h-80 w-full rounded border border-slate-200 bg-white"
            srcDoc={preview.htmlBody}
          />
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="mb-3 text-xs font-bold uppercase text-slate-400">Plain text preview</p>
          <pre className="whitespace-pre-wrap rounded bg-slate-50 p-3 text-sm text-slate-700">{preview.textBody}</pre>
        </div>
      </>
    ) : null}
  </div>
);

export default EmailTemplatePreview;
