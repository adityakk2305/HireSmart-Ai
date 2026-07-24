import { formatDate } from "../../utils/formatDate.js";
import CandidateActionsMenu from "./CandidateActionsMenu.jsx";
import CandidateStatusBadge from "./CandidateStatusBadge.jsx";
import ResumeParseStatusBadge from "./ResumeParseStatusBadge.jsx";
import AiScreeningStatusBadge from "./AiScreeningStatusBadge.jsx";

const initials = (name = "") => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "CA";

const CandidateTable = ({ candidates, selectedIds = [], onSelect, onSelectPage, onStatus, onDelete, onResume, onAddNote, onCompare }) => {
  const allSelected = candidates.length > 0 && candidates.every((candidate) => selectedIds.includes(candidate.id));

  return (
  <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:block">
    <table className="min-w-full divide-y divide-slate-200">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-4 py-3 text-left">
            <input type="checkbox" checked={allSelected} onChange={(event) => onSelectPage?.(event.target.checked)} aria-label="Select current page" />
          </th>
          {["Candidate", "Application ID", "Job", "Experience", "Resume", "AI status", "AI score", "Category", "Candidate status", "Applied", "Actions"].map((heading) => (
            <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {candidates.map((candidate) => (
          <tr key={candidate.id}>
            <td className="px-4 py-4">
              <input type="checkbox" checked={selectedIds.includes(candidate.id)} onChange={(event) => onSelect?.(candidate.id, event.target.checked)} aria-label={`Select ${candidate.fullName}`} />
            </td>
            <td className="px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-black text-blue-700">{initials(candidate.fullName)}</span>
                <div>
                  <p className="text-sm font-bold text-slate-950">{candidate.fullName}</p>
                  <p className="text-xs text-slate-500">{candidate.email}</p>
                  <p className="text-xs text-slate-500">{candidate.currentDesignation || "Not provided"} {candidate.location ? `- ${candidate.location}` : ""}</p>
                </div>
              </div>
            </td>
            <td className="px-4 py-4 text-sm font-semibold text-slate-700">{candidate.applicationId}</td>
            <td className="px-4 py-4 text-sm text-slate-600">{candidate.job?.title || "Not provided"}</td>
            <td className="px-4 py-4 text-sm text-slate-600">{candidate.totalExperience} years</td>
            <td className="px-4 py-4"><ResumeParseStatusBadge status={candidate.resumeParseStatus} /></td>
            <td className="px-4 py-4"><AiScreeningStatusBadge status={candidate.aiScreeningStatus} /></td>
            <td className="px-4 py-4 text-sm font-bold text-slate-800">
              {candidate.overallScore ?? "Not screened"}
              {candidate.isAiEvaluationOutdated ? <span className="ml-2 text-xs font-bold text-amber-700">Outdated</span> : null}
            </td>
            <td className="px-4 py-4 text-sm text-slate-600">{candidate.category || "-"}</td>
            <td className="px-4 py-4"><CandidateStatusBadge status={candidate.status} /></td>
            <td className="px-4 py-4 text-sm text-slate-600">{formatDate(candidate.appliedAt)}</td>
            <td className="px-4 py-4">
              <CandidateActionsMenu
                candidate={candidate}
                onStatus={onStatus}
                onDelete={onDelete}
                onResume={onResume}
                onAddNote={onAddNote}
                onCompare={onCompare}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default CandidateTable;
