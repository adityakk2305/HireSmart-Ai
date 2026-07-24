import {
  AI_CANDIDATE_CATEGORIES,
  AI_SCREENING_STATUSES,
  CANDIDATE_SORT_OPTIONS,
  CANDIDATE_SOURCES,
  CANDIDATE_STATUSES,
  NOTICE_PERIOD_OPTIONS,
  RESUME_PARSE_STATUSES
} from "../../utils/constants.js";
import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";

const booleanOptions = [
  { label: "Any", value: "" },
  { label: "Yes", value: "true" },
  { label: "No", value: "false" }
];

const filterLabels = {
  search: "Search",
  jobId: "Job",
  status: "Status",
  source: "Source",
  resumeParseStatus: "Resume",
  aiScreeningStatus: "AI",
  category: "Category",
  scoreMin: "Min score",
  scoreMax: "Max score",
  experienceMin: "Min exp",
  experienceMax: "Max exp",
  appliedFrom: "From",
  appliedTo: "To",
  requiredSkill: "Skill found",
  missingSkill: "Skill missing",
  noticePeriod: "Notice",
  hasResume: "Has resume",
  hasParsedResume: "Parsed",
  hasAiEvaluation: "Screened"
};

const selectClass = "h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm";

const CandidateAdvancedFilters = ({ filters, jobs = [], onChange, onReset }) => {
  const activeFilters = Object.entries(filters)
    .filter(([key, value]) => !["page", "limit", "sort"].includes(key) && value !== "" && value !== undefined && value !== null)
    .map(([key, value]) => ({ key, label: filterLabels[key] || key, value }));

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <Input name="search" placeholder="Search name, email, job or skill" value={filters.search || ""} onChange={(event) => onChange({ search: event.target.value, page: 1 })} />
        <select className={selectClass} value={filters.jobId || ""} onChange={(event) => onChange({ jobId: event.target.value, page: 1 })}>
          <option value="">All jobs</option>
          {jobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}
        </select>
        <select className={selectClass} value={filters.status || ""} onChange={(event) => onChange({ status: event.target.value, page: 1 })}>
          <option value="">All statuses</option>
          {CANDIDATE_STATUSES.map((status) => <option key={status}>{status}</option>)}
        </select>
        <select className={selectClass} value={filters.source || ""} onChange={(event) => onChange({ source: event.target.value, page: 1 })}>
          <option value="">All sources</option>
          {CANDIDATE_SOURCES.map((source) => <option key={source}>{source}</option>)}
        </select>
        <select className={selectClass} value={filters.resumeParseStatus || ""} onChange={(event) => onChange({ resumeParseStatus: event.target.value, page: 1 })}>
          <option value="">Resume status</option>
          {RESUME_PARSE_STATUSES.map((status) => <option key={status}>{status}</option>)}
        </select>
        <select className={selectClass} value={filters.aiScreeningStatus || ""} onChange={(event) => onChange({ aiScreeningStatus: event.target.value, page: 1 })}>
          <option value="">AI status</option>
          {AI_SCREENING_STATUSES.map((status) => <option key={status}>{status}</option>)}
        </select>
        <select className={selectClass} value={filters.category || ""} onChange={(event) => onChange({ category: event.target.value, page: 1 })}>
          <option value="">AI category</option>
          {AI_CANDIDATE_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
        </select>
        <Input name="scoreMin" type="number" placeholder="Min AI score" value={filters.scoreMin || ""} onChange={(event) => onChange({ scoreMin: event.target.value, page: 1 })} />
        <Input name="scoreMax" type="number" placeholder="Max AI score" value={filters.scoreMax || ""} onChange={(event) => onChange({ scoreMax: event.target.value, page: 1 })} />
        <Input name="experienceMin" type="number" placeholder="Min exp" value={filters.experienceMin || ""} onChange={(event) => onChange({ experienceMin: event.target.value, page: 1 })} />
        <Input name="experienceMax" type="number" placeholder="Max exp" value={filters.experienceMax || ""} onChange={(event) => onChange({ experienceMax: event.target.value, page: 1 })} />
        <Input name="appliedFrom" type="date" value={filters.appliedFrom || ""} onChange={(event) => onChange({ appliedFrom: event.target.value, page: 1 })} />
        <Input name="appliedTo" type="date" value={filters.appliedTo || ""} onChange={(event) => onChange({ appliedTo: event.target.value, page: 1 })} />
        <Input name="requiredSkill" placeholder="Required skill found" value={filters.requiredSkill || ""} onChange={(event) => onChange({ requiredSkill: event.target.value, page: 1 })} />
        <Input name="missingSkill" placeholder="Required skill missing" value={filters.missingSkill || ""} onChange={(event) => onChange({ missingSkill: event.target.value, page: 1 })} />
        <select className={selectClass} value={filters.noticePeriod || ""} onChange={(event) => onChange({ noticePeriod: event.target.value, page: 1 })}>
          <option value="">Notice period</option>
          {NOTICE_PERIOD_OPTIONS.map((notice) => <option key={notice}>{notice}</option>)}
        </select>
        <select className={selectClass} value={filters.hasResume ?? ""} onChange={(event) => onChange({ hasResume: event.target.value, page: 1 })}>
          {booleanOptions.map((item) => <option key={item.label} value={item.value}>Has resume: {item.label}</option>)}
        </select>
        <select className={selectClass} value={filters.hasParsedResume ?? ""} onChange={(event) => onChange({ hasParsedResume: event.target.value, page: 1 })}>
          {booleanOptions.map((item) => <option key={item.label} value={item.value}>Parsed: {item.label}</option>)}
        </select>
        <select className={selectClass} value={filters.hasAiEvaluation ?? ""} onChange={(event) => onChange({ hasAiEvaluation: event.target.value, page: 1 })}>
          {booleanOptions.map((item) => <option key={item.label} value={item.value}>AI evaluation: {item.label}</option>)}
        </select>
        <select className={selectClass} value={filters.sort || "newest"} onChange={(event) => onChange({ sort: event.target.value, page: 1 })}>
          {CANDIDATE_SORT_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => onChange({ [filter.key]: "", page: 1 })}
              className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"
            >
              {filter.label}: {String(filter.value)} x
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={onReset}>Clear all filters</Button>
      </div>
    </section>
  );
};

export default CandidateAdvancedFilters;
