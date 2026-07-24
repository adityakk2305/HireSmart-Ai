const CertificationsSection = ({ items = [] }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-bold text-slate-950">Certifications</h2>
    {items.length ? (
      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <article key={`${item.name}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-bold text-slate-950">{item.name || "Certification name not found"}</h3>
            <p className="mt-1 text-sm text-slate-600">{item.issuer || "Issuer not found"}</p>
            <p className="mt-1 text-xs font-semibold uppercase text-slate-500">{[item.issueDate, item.expiryDate].filter(Boolean).join(" - ") || "Dates not found"}</p>
            {item.credentialId ? <p className="mt-2 text-sm text-slate-500">Credential ID: {item.credentialId}</p> : null}
            {item.credentialUrl ? <p className="mt-2 break-all text-sm text-blue-700">{item.credentialUrl}</p> : null}
          </article>
        ))}
      </div>
    ) : <p className="mt-3 text-sm text-slate-500">No certifications found in resume.</p>}
  </section>
);

export default CertificationsSection;
