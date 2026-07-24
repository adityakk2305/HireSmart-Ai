import { ArrowLeft, Scale, X } from "lucide-react";
import { Fragment, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { fetchCandidateComparison } from "../../features/candidates/candidateSlice.js";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";

const List = ({ items }) => items?.length ? (
  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
    {items.slice(0, 5).map((item) => <li key={typeof item === "string" ? item : item.skill || item.name}>{typeof item === "string" ? item : item.skill || item.name}</li>)}
  </ul>
) : <p className="mt-2 text-sm text-slate-500">No data</p>;

const CandidateComparisonPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { comparisonCandidates, comparing, error } = useSelector((state) => state.candidates);
  const ids = useMemo(() => (searchParams.get("ids") || "").split(",").map((id) => id.trim()).filter(Boolean).slice(0, 4), [searchParams]);

  useEffect(() => {
    if (ids.length >= 2) dispatch(fetchCandidateComparison(ids));
  }, [dispatch, ids.join(",")]);

  const removeCandidate = (id) => {
    const next = ids.filter((item) => item !== id);
    setSearchParams(next.length ? { ids: next.join(",") } : {});
  };

  if (ids.length < 2) {
    return (
      <EmptyState
        title="Select 2 to 4 candidates"
        description="Use the candidates table bulk toolbar to compare candidates from the same job."
        icon={Scale}
        action={<Link to="/dashboard/candidates"><Button variant="outline" icon={ArrowLeft}>Back to candidates</Button></Link>}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Candidate comparison"
        description={comparisonCandidates?.job?.title || "Compare candidates from the same job"}
        action={<Link to="/dashboard/candidates"><Button variant="outline" icon={ArrowLeft}>Back</Button></Link>}
      />
      <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-800">
        {comparisonCandidates?.notice || "Comparison is for recruiter review and does not make a hiring decision."}
      </div>
      {error ? <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div> : null}
      {comparing ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-500">Loading comparison...</div>
      ) : comparisonCandidates?.candidates?.length ? (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="grid min-w-[960px]" style={{ gridTemplateColumns: `220px repeat(${comparisonCandidates.candidates.length}, minmax(240px, 1fr))` }}>
            <div className="border-b border-r border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-500">Field</div>
            {comparisonCandidates.candidates.map((candidate) => (
              <div key={candidate.id} className="border-b border-r border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-950">{candidate.fullName}</p>
                    <p className="mt-1 text-sm text-slate-500">{candidate.currentDesignation || "Not provided"}</p>
                  </div>
                  <button type="button" onClick={() => removeCandidate(candidate.id)} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Remove candidate">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {[
              ["Experience", (c) => `${c.totalExperience} years`],
              ["Overall score", (c) => c.overallScore ?? "Not screened"],
              ["Category", (c) => c.category || "-"],
              ["Required skills score", (c) => c.skillsScore ?? "-"],
              ["Experience score", (c) => c.experienceScore ?? "-"],
              ["Education score", (c) => c.educationScore ?? "-"],
              ["Project score", (c) => c.projectScore ?? "-"],
              ["Status", (c) => c.status],
              ["Resume status", (c) => c.resumeParseStatus],
              ["AI status", (c) => c.aiScreeningStatus]
            ].map(([label, getter]) => (
              <Fragment key={label}>
                <div key={`${label}-label`} className="border-b border-r border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-600">{label}</div>
                {comparisonCandidates.candidates.map((candidate) => (
                  <div key={`${candidate.id}-${label}`} className="border-b border-r border-slate-200 p-4 text-sm text-slate-700">{getter(candidate)}</div>
                ))}
              </Fragment>
            ))}
            {[
              ["Education", (c) => c.education],
              ["Required found", (c) => c.requiredSkillsFound],
              ["Required missing", (c) => c.requiredSkillsMissing],
              ["Preferred found", (c) => c.preferredSkillsFound],
              ["Strengths", (c) => c.strengths],
              ["Weaknesses", (c) => c.weaknesses],
              ["Relevant projects", (c) => c.relevantProjects]
            ].map(([label, getter]) => (
              <Fragment key={label}>
                <div key={`${label}-label`} className="border-b border-r border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-600">{label}</div>
                {comparisonCandidates.candidates.map((candidate) => (
                  <div key={`${candidate.id}-${label}`} className="border-b border-r border-slate-200 p-4"><List items={getter(candidate)} /></div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CandidateComparisonPage;
