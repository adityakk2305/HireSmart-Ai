import { AlertTriangle, RotateCcw, Sparkles } from "lucide-react";
import AiScreeningStatusBadge from "../AiScreeningStatusBadge.jsx";
import Button from "../../common/Button.jsx";
import { formatDate } from "../../../utils/formatDate.js";
import RequiredSkillsAnalysis from "./RequiredSkillsAnalysis.jsx";
import ScoreBreakdown from "./ScoreBreakdown.jsx";
import SkillGapAnalysis from "./SkillGapAnalysis.jsx";
import StrengthsWeaknesses from "./StrengthsWeaknesses.jsx";

const AnalysisBlock = ({ title, children }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="text-base font-bold text-slate-950">{title}</h3>
    <div className="mt-3 text-sm leading-6 text-slate-600">{children}</div>
  </section>
);

const AiEvaluationPanel = ({ candidate, loading, error, onScreen }) => {
  const evaluation = candidate?.aiEvaluation;
  const status = candidate?.aiScreeningStatus || "Not Screened";
  const parsed = candidate?.resumeParseStatus === "Parsed";
  const isScreened = status === "Screened" && evaluation;
  const actionLabel = status === "Failed" ? "Retry AI Screening" : isScreened ? "Re-run AI Screening" : "Run AI Screening";

  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">AI screening</h2>
          <p className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-800">
            AI screening is decision-support only. Final hiring decisions must be reviewed by a recruiter.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <AiScreeningStatusBadge status={status} />
            {candidate?.aiProvider ? <span className="text-sm text-slate-500">Provider: {candidate.aiProvider}</span> : null}
            {candidate?.aiModel ? <span className="text-sm text-slate-500">Model: {candidate.aiModel}</span> : null}
            {candidate?.aiScreenedAt ? <span className="text-sm text-slate-500">Screened {formatDate(candidate.aiScreenedAt, { hour: "2-digit", minute: "2-digit" })}</span> : null}
          </div>
          {candidate?.isAiEvaluationOutdated ? (
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
              This evaluation may be outdated because the job or parsed resume changed after screening.
            </p>
          ) : null}
          {candidate?.aiScreeningError || error ? <p className="mt-3 text-sm font-semibold text-red-600">{candidate.aiScreeningError || error}</p> : null}
          {!parsed ? <p className="mt-3 text-sm font-semibold text-amber-700">Parse the resume before running AI screening.</p> : null}
        </div>
        <Button
          icon={isScreened ? RotateCcw : Sparkles}
          loading={loading || status === "Processing"}
          disabled={!parsed || status === "Processing"}
          onClick={() => onScreen(isScreened)}
        >
          {actionLabel}
        </Button>
      </div>

      {isScreened ? (
        <div className="mt-6 space-y-5">
          <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-bold uppercase text-slate-500">Overall score</p>
              <p className="mt-3 text-5xl font-black text-slate-950">{evaluation.overallScore}</p>
              <p className="mt-2 text-lg font-bold text-blue-700">{evaluation.category}</p>
              <p className="mt-3 text-sm text-slate-600">Confidence: {evaluation.confidence}/100</p>
            </div>
            <AnalysisBlock title="Recommendation">
              <p className="font-semibold text-slate-900">{evaluation.recommendation}</p>
              <p className="mt-3">{evaluation.interviewRecommendation}</p>
              <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                This recommendation is generated from job-related resume data and requires human review.
              </p>
            </AnalysisBlock>
          </div>
          <ScoreBreakdown evaluation={evaluation} />
          <RequiredSkillsAnalysis evaluation={evaluation} />
          <AnalysisBlock title="Preferred and additional skills">
            <p><span className="font-bold text-slate-800">Preferred found:</span> {(evaluation.preferredSkillsFound || []).map((item) => item.skill).join(", ") || "None"}</p>
            <p className="mt-2"><span className="font-bold text-slate-800">Additional relevant:</span> {(evaluation.additionalRelevantSkills || []).join(", ") || "None"}</p>
          </AnalysisBlock>
          <StrengthsWeaknesses evaluation={evaluation} />
          <SkillGapAnalysis evaluation={evaluation} />
          <div className="grid gap-5 lg:grid-cols-3">
            <AnalysisBlock title="Experience analysis">
              <p>{evaluation.experienceAnalysis?.assessment || "No analysis generated."}</p>
              <p className="mt-2 font-semibold">Score: {evaluation.experienceScore}/100</p>
              <p className="mt-2">Candidate: {evaluation.experienceAnalysis?.candidateExperience ?? "Unclear"} years</p>
              <p>Required: {evaluation.experienceAnalysis?.requiredMinimum ?? 0}-{evaluation.experienceAnalysis?.requiredMaximum ?? 0} years</p>
            </AnalysisBlock>
            <AnalysisBlock title="Education analysis">
              <p>{evaluation.educationAnalysis?.assessment || "No analysis generated."}</p>
              <p className="mt-2 font-semibold">Score: {evaluation.educationScore}/100</p>
              <p className="mt-2">Required: {evaluation.educationAnalysis?.requiredEducation || "Not provided"}</p>
            </AnalysisBlock>
            <AnalysisBlock title="Project analysis">
              <p>{evaluation.projectAnalysis?.assessment || "No analysis generated."}</p>
              <p className="mt-2 font-semibold">Score: {evaluation.projectScore}/100</p>
              <p className="mt-2">Relevant projects: {(evaluation.projectAnalysis?.relevantProjects || []).length}</p>
            </AnalysisBlock>
          </div>
          <AnalysisBlock title="Summary and recruiter notes">
            <p>{evaluation.summary}</p>
            {(evaluation.redFlags || []).length ? (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="flex items-center gap-2 font-bold text-amber-800"><AlertTriangle className="h-4 w-4" /> Job-related red flags</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-amber-800">
                  {evaluation.redFlags.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ) : null}
            {(evaluation.screeningNotes || []).length ? <p className="mt-3 text-slate-500">{evaluation.screeningNotes.join(" ")}</p> : null}
          </AnalysisBlock>
        </div>
      ) : null}
    </section>
  );
};

export default AiEvaluationPanel;
