import { Archive, Copy, Edit, Eye, ExternalLink, Power, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../common/Button.jsx";

const JobActionsMenu = ({ job, onStatusChange, onDelete, onCopy }) => (
  <div className="flex flex-wrap gap-2">
    <Link to={`/dashboard/jobs/${job.id}`}>
      <Button size="sm" variant="outline" icon={Eye}>View</Button>
    </Link>
    <Link to={`/dashboard/jobs/${job.id}/edit`}>
      <Button size="sm" variant="outline" icon={Edit}>Edit</Button>
    </Link>
    <Button size="sm" variant="outline" icon={Copy} onClick={() => onCopy(job)}>Copy URL</Button>
    {job.status === "Active" ? (
      <a href={`/jobs/${job.publicApplicationSlug}`} target="_blank" rel="noreferrer">
        <Button size="sm" variant="outline" icon={ExternalLink}>Public</Button>
      </a>
    ) : null}
    {job.status === "Draft" || job.status === "Closed" ? (
      <Button size="sm" variant="outline" icon={Power} onClick={() => onStatusChange(job, "Active")}>Activate</Button>
    ) : null}
    {job.status === "Active" ? (
      <Button size="sm" variant="outline" onClick={() => onStatusChange(job, "Closed")}>Close</Button>
    ) : null}
    {job.status !== "Archived" ? (
      <Button size="sm" variant="outline" icon={Archive} onClick={() => onStatusChange(job, "Archived")}>Archive</Button>
    ) : null}
    <Button size="sm" variant="danger" icon={Trash2} onClick={() => onDelete(job)}>Delete</Button>
  </div>
);

export default JobActionsMenu;
