import { formatDate } from "../../utils/formatDate.js";
import JobActionsMenu from "./JobActionsMenu.jsx";
import JobStatusBadge from "./JobStatusBadge.jsx";

const JobTable = ({ jobs, onStatusChange, onDelete, onCopy }) => (
  <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:block">
    <table className="min-w-full divide-y divide-slate-200">
      <thead className="bg-slate-50">
        <tr>
          {["Job title", "Department", "Location", "Type", "Work", "Openings", "Candidates", "Deadline", "Status", "Created", "Actions"].map((heading) => (
            <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {jobs.map((job) => (
          <tr key={job.id}>
            <td className="px-4 py-4 text-sm font-bold text-slate-950">{job.title}</td>
            <td className="px-4 py-4 text-sm text-slate-600">{job.department}</td>
            <td className="px-4 py-4 text-sm text-slate-600">{job.location || "Remote"}</td>
            <td className="px-4 py-4 text-sm text-slate-600">{job.employmentType}</td>
            <td className="px-4 py-4 text-sm text-slate-600">{job.workMode}</td>
            <td className="px-4 py-4 text-sm text-slate-600">{job.openings}</td>
            <td className="px-4 py-4 text-sm text-slate-600">{job.candidateCount || 0}</td>
            <td className="px-4 py-4 text-sm text-slate-600">{formatDate(job.deadline)}</td>
            <td className="px-4 py-4"><JobStatusBadge status={job.status} deadline={job.deadline} /></td>
            <td className="px-4 py-4 text-sm text-slate-600">{formatDate(job.createdAt)}</td>
            <td className="px-4 py-4"><JobActionsMenu job={job} onStatusChange={onStatusChange} onDelete={onDelete} onCopy={onCopy} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default JobTable;
