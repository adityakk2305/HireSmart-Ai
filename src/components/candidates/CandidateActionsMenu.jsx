import { BrainCircuit, Download, Edit, Eye, FileSearch, Mail, MessageSquarePlus, Scale, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../common/Button.jsx";

const CandidateActionsMenu = ({ candidate, onStatus, onDelete, onResume, onAddNote, onCompare }) => (
  <div className="flex flex-wrap gap-2">
    <Link to={`/dashboard/candidates/${candidate.id}`}>
      <Button size="sm" variant="outline" icon={Eye}>View</Button>
    </Link>
    <Link to={`/dashboard/candidates/${candidate.id}/edit`}>
      <Button size="sm" variant="outline" icon={Edit}>Edit</Button>
    </Link>
    <Button size="sm" variant="outline" onClick={() => onStatus(candidate)}>Status</Button>
    <Button size="sm" variant="outline" icon={Download} onClick={() => onResume(candidate)}>Resume</Button>
    <Button size="sm" variant="outline" icon={MessageSquarePlus} onClick={() => onAddNote?.(candidate)}>Note</Button>
    <Button size="sm" variant="outline" icon={Scale} onClick={() => onCompare?.(candidate)}>Compare</Button>
    <Button size="sm" variant="outline" icon={FileSearch} title="Open candidate profile to parse or re-parse">Parse</Button>
    <Button size="sm" variant="outline" icon={BrainCircuit} title="Open candidate profile to run AI screening">AI</Button>
    <Link to={`/dashboard/candidates/${candidate.id}`}>
      <Button size="sm" variant="outline" icon={Mail} title="Open candidate Emails tab">Email</Button>
    </Link>
    <Button size="sm" variant="danger" icon={Trash2} onClick={() => onDelete(candidate)}>Delete</Button>
  </div>
);

export default CandidateActionsMenu;
