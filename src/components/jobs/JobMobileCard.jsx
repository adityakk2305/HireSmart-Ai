import { formatDate } from "../../utils/formatDate.js";
import JobActionsMenu from "./JobActionsMenu.jsx";
import JobStatusBadge from "./JobStatusBadge.jsx";

const JobMobileCard = ({ job, onStatusChange, onDelete, onCopy }) => (
  <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="font-bold text-slate-950">{job.title}</h3>
        <p className="mt-1 text-sm text-slate-500">{job.department} - {job.location || "Remote"}</p>
      </div>
      <JobStatusBadge status={job.status} deadline={job.deadline} />
    </div>
    <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600">
      <p>Deadline: {formatDate(job.deadline)}</p>
      <p>Openings: {job.openings}</p>
    </div>
    <div className="mt-4">
      <JobActionsMenu job={job} onStatusChange={onStatusChange} onDelete={onDelete} onCopy={onCopy} />
    </div>
  </article>
);

export default JobMobileCard;
