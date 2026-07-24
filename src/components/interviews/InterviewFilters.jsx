import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";
import { INTERVIEW_MODES, INTERVIEW_STATUSES, INTERVIEW_TYPES } from "../../utils/interviewConstants.js";

const Select = ({ label, name, value, onChange, children }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-semibold text-slate-700">{label}</label>
    <select id={name} name={name} value={value || ""} onChange={onChange} className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
      {children}
    </select>
  </div>
);

const InterviewFilters = ({ filters, onChange, onReset }) => {
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    onChange({ [name]: type === "checkbox" ? checked : value, page: 1 });
  };

  return (
    <section className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Input label="Search" name="search" value={filters.search || ""} onChange={handleChange} placeholder="Candidate, job, interviewer" />
        <Select label="Status" name="status" value={filters.status} onChange={handleChange}>
          <option value="">All statuses</option>
          {INTERVIEW_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
        </Select>
        <Select label="Type" name="interviewType" value={filters.interviewType} onChange={handleChange}>
          <option value="">All types</option>
          {INTERVIEW_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
        </Select>
        <Select label="Mode" name="interviewMode" value={filters.interviewMode} onChange={handleChange}>
          <option value="">All modes</option>
          {INTERVIEW_MODES.map((item) => <option key={item} value={item}>{item}</option>)}
        </Select>
        <Input label="From" name="dateFrom" type="date" value={filters.dateFrom || ""} onChange={handleChange} />
        <Input label="To" name="dateTo" type="date" value={filters.dateTo || ""} onChange={handleChange} />
        <Select label="Sort" name="sort" value={filters.sort} onChange={handleChange}>
          <option value="soonest">Soonest</option>
          <option value="latest">Latest</option>
          <option value="newest-created">Newest created</option>
          <option value="recently-updated">Recently updated</option>
          <option value="status">Status</option>
        </Select>
        <div className="flex items-end gap-3">
          <label className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700">
            <input type="checkbox" name="todayOnly" checked={Boolean(filters.todayOnly)} onChange={handleChange} />
            Today
          </label>
          <label className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700">
            <input type="checkbox" name="upcomingOnly" checked={Boolean(filters.upcomingOnly)} onChange={handleChange} />
            Upcoming
          </label>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={onReset}>Clear filters</Button>
      </div>
    </section>
  );
};

export default InterviewFilters;
