import { Link } from "react-router-dom";
import AiScreeningStatusBadge from "../AiScreeningStatusBadge.jsx";
import CandidateStatusBadge from "../CandidateStatusBadge.jsx";
import Button from "../../common/Button.jsx";

const CandidateRankingTable = ({ candidates, selectedIds, onToggle, onTogglePage }) => {
  const allSelected = candidates.length > 0 && candidates.every((candidate) => selectedIds.includes(candidate.id));

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <p className="text-sm font-bold text-slate-700">Ranking table</p>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <input type="checkbox" checked={allSelected} onChange={(event) => onTogglePage(event.target.checked)} />
          Select current page
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {["Select", "Rank", "Candidate", "Experience", "Required skills match", "Missing skills", "Overall score", "Category", "AI status", "Candidate status", "Actions"].map((heading) => (
                <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {candidates.map((candidate, index) => (
              <tr key={candidate.id}>
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(candidate.id)}
                    disabled={candidate.resumeParseStatus !== "Parsed" || candidate.aiScreeningStatus === "Processing"}
                    onChange={(event) => onToggle(candidate.id, event.target.checked)}
                  />
                </td>
                <td className="px-4 py-4 text-sm font-bold text-slate-900">{index + 1}</td>
                <td className="px-4 py-4">
                  <p className="text-sm font-bold text-slate-950">{candidate.fullName}</p>
                  <p className="text-xs text-slate-500">{candidate.applicationId}</p>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">{candidate.totalExperience} years</td>
                <td className="px-4 py-4 text-sm text-slate-600">{(candidate.requiredSkillsFound || []).length}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{(candidate.requiredSkillsMissing || []).map((item) => item.skill).join(", ") || "-"}</td>
                <td className="px-4 py-4 text-sm font-black text-slate-900">{candidate.overallScore ?? "-"}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{candidate.category || "-"}</td>
                <td className="px-4 py-4"><AiScreeningStatusBadge status={candidate.aiScreeningStatus} /></td>
                <td className="px-4 py-4"><CandidateStatusBadge status={candidate.status} /></td>
                <td className="px-4 py-4">
                  <Link to={`/dashboard/candidates/${candidate.id}`}>
                    <Button size="sm" variant="outline">Open</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateRankingTable;
