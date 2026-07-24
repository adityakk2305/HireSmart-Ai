import { BrainCircuit, CalendarClock, CheckCircle2, Edit, Eye, MessageSquareText, PlayCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../common/Button.jsx";
import InterviewStatusBadge from "./InterviewStatusBadge.jsx";
import { formatInterviewDateTime } from "../../utils/interviewConstants.js";

const InterviewTable = ({ interviews, onReschedule, onCancel, onProgress, onComplete, onGenerate }) => (
  <div className="hidden overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm lg:block">
    <table className="min-w-[1050px] w-full text-left text-sm">
      <thead className="bg-slate-50 text-xs uppercase text-slate-500">
        <tr>
          {["Candidate", "Job", "Round", "Type", "Mode", "Date and time", "Interviewers", "Status", "Rating", "Actions"].map((head) => (
            <th key={head} className="px-4 py-3 font-bold">{head}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {interviews.map((interview) => (
          <tr key={interview.id} className="align-top">
            <td className="px-4 py-4">
              <p className="font-bold text-slate-950">{interview.candidate?.fullName}</p>
              <p className="text-xs text-slate-500">{interview.applicationId}</p>
            </td>
            <td className="px-4 py-4">{interview.job?.title}</td>
            <td className="px-4 py-4">{interview.roundLabel}</td>
            <td className="px-4 py-4">{interview.interviewType}</td>
            <td className="px-4 py-4">{interview.interviewMode}</td>
            <td className="px-4 py-4">{formatInterviewDateTime(interview.startTime, interview.timezone)}</td>
            <td className="px-4 py-4">{interview.interviewers?.map((item) => item.name).join(", ") || "-"}</td>
            <td className="px-4 py-4"><InterviewStatusBadge status={interview.status} /></td>
            <td className="px-4 py-4">{interview.overallRating ? `${interview.overallRating}/5` : "-"}</td>
            <td className="px-4 py-4">
              <div className="flex flex-wrap gap-2">
                <Link to={`/dashboard/interviews/${interview.id}`}><Button size="sm" variant="outline" icon={Eye}>View</Button></Link>
                <Link to={`/dashboard/interviews/${interview.id}/edit`}><Button size="sm" variant="outline" icon={Edit}>Edit</Button></Link>
                <Button size="sm" variant="outline" icon={CalendarClock} onClick={() => onReschedule(interview)}>Reschedule</Button>
                <Button size="sm" variant="outline" icon={PlayCircle} onClick={() => onProgress(interview)}>Start</Button>
                <Button size="sm" variant="outline" icon={BrainCircuit} onClick={() => onGenerate(interview)}>Questions</Button>
                <Link to={`/dashboard/interviews/${interview.id}/feedback`}><Button size="sm" variant="outline" icon={MessageSquareText}>Feedback</Button></Link>
                <Button size="sm" variant="outline" icon={CheckCircle2} onClick={() => onComplete(interview)}>Complete</Button>
                <Button size="sm" variant="danger" icon={XCircle} onClick={() => onCancel(interview)}>Cancel</Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default InterviewTable;
