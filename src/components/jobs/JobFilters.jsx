import {
  EMPLOYMENT_TYPES,
  JOB_SORT_OPTIONS,
  JOB_STATUSES,
  WORK_MODES
} from "../../utils/constants.js";
import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";

const JobFilters = ({ filters, onChange, onReset }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
      <Input
        name="search"
        placeholder="Search jobs"
        value={filters.search || ""}
        onChange={(event) => onChange({ search: event.target.value, page: 1 })}
      />
      <select
        className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm"
        value={filters.status || ""}
        onChange={(event) => onChange({ status: event.target.value, page: 1 })}
      >
        <option value="">All statuses</option>
        {JOB_STATUSES.map((status) => <option key={status}>{status}</option>)}
      </select>
      <Input
        name="department"
        placeholder="Department"
        value={filters.department || ""}
        onChange={(event) => onChange({ department: event.target.value, page: 1 })}
      />
      <select
        className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm"
        value={filters.employmentType || ""}
        onChange={(event) => onChange({ employmentType: event.target.value, page: 1 })}
      >
        <option value="">Employment type</option>
        {EMPLOYMENT_TYPES.map((item) => <option key={item}>{item}</option>)}
      </select>
      <select
        className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm"
        value={filters.workMode || ""}
        onChange={(event) => onChange({ workMode: event.target.value, page: 1 })}
      >
        <option value="">Work mode</option>
        {WORK_MODES.map((item) => <option key={item}>{item}</option>)}
      </select>
      <select
        className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm"
        value={filters.sort || "newest"}
        onChange={(event) => onChange({ sort: event.target.value, page: 1 })}
      >
        {JOB_SORT_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
    </div>
    <div className="mt-3 flex justify-end">
      <Button variant="outline" size="sm" onClick={onReset}>
        Reset filters
      </Button>
    </div>
  </div>
);

export default JobFilters;
