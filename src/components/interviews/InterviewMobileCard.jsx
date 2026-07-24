import { Link } from "react-router-dom";
import Button from "../common/Button.jsx";
import InterviewStatusBadge from "./InterviewStatusBadge.jsx";
import { formatInterviewDateTime } from "../../utils/interviewConstants.js";

const InterviewMobileCard = ({ interview }) => (
  <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="font-bold text-slate-950">{interview.candidate?.fullName}</h3>
        <p className="mt-1 text-sm text-slate-500">{interview.job?.title}</p>
      </div>
      <InterviewStatusBadge status={interview.status} />
    </div>
    <div className="mt-3 grid gap-2 text-sm text-slate-600">
      <p><span className="font-semibold">Round:</span> {interview.roundLabel}</p>
      <p><span className="font-semibold">When:</span> {formatInterviewDateTime(interview.startTime, interview.timezone)}</p>
      <p><span className="font-semibold">Mode:</span> {interview.interviewMode}</p>
      <p><span className="font-semibold">Rating:</span> {interview.overallRating ? `${interview.overallRating}/5` : "-"}</p>
    </div>
    <Link to={`/dashboard/interviews/${interview.id}`} className="mt-4 block"><Button className="w-full" variant="outline">Open interview</Button></Link>
  </article>
);

export default InterviewMobileCard;
