import { formatDate } from "../../utils/formatDate.js";
import CandidateActionsMenu from "./CandidateActionsMenu.jsx";
import CandidateStatusBadge from "./CandidateStatusBadge.jsx";
import ResumeParseStatusBadge from "./ResumeParseStatusBadge.jsx";
import AiScreeningStatusBadge from "./AiScreeningStatusBadge.jsx";

const CandidateMobileCard = ({ candidate, selected = false, onSelect, onStatus, onDelete, onResume, onAddNote, onCompare }) => (
  <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
    <div className="flex items-start justify-between gap-3">
      <div className="flex gap-3">
        <input type="checkbox" checked={selected} onChange={(event) => onSelect?.(candidate.id, event.target.checked)} aria-label={`Select ${candidate.fullName}`} />
        <div>
        <h3 className="font-bold text-slate-950">{candidate.fullName}</h3>
        <p className="mt-1 text-sm text-slate-500">{candidate.applicationId}</p>
        <p className="mt-1 text-sm text-slate-500">{candidate.job?.title || "Not provided"}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <CandidateStatusBadge status={candidate.status} />
        <ResumeParseStatusBadge status={candidate.resumeParseStatus} />
        <AiScreeningStatusBadge status={candidate.aiScreeningStatus} />
      </div>
    </div>
    <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600">
      <p>Experience: {candidate.totalExperience} years</p>
      <p>Applied: {formatDate(candidate.appliedAt)}</p>
      <p>AI score: {candidate.overallScore ?? "Not screened"}</p>
      <p>Category: {candidate.category || "-"}</p>
    </div>
    <div className="mt-4">
      <CandidateActionsMenu candidate={candidate} onStatus={onStatus} onDelete={onDelete} onResume={onResume} onAddNote={onAddNote} onCompare={onCompare} />
    </div>
  </article>
);

export default CandidateMobileCard;
