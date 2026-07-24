import { Eye, RefreshCw, StopCircle, UserRound, CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../common/Button.jsx";
import EmailStatusBadge from "./EmailStatusBadge.jsx";
import { formatDate } from "../../utils/formatDate.js";

const EmailLogTable = ({ logs = [], onRetry, onCancel }) => (
  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="hidden overflow-x-auto lg:block">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50 text-left text-xs font-bold uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Recipient</th>
            <th className="px-4 py-3">Candidate</th>
            <th className="px-4 py-3">Subject</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Provider</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Attempts</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="px-4 py-3 font-semibold text-slate-900">{log.to?.[0]?.email}</td>
              <td className="px-4 py-3">{log.candidate?.fullName || "-"}</td>
              <td className="max-w-xs px-4 py-3 text-slate-600">{log.subject}</td>
              <td className="px-4 py-3">{log.emailType}</td>
              <td className="px-4 py-3 uppercase">{log.provider}</td>
              <td className="px-4 py-3"><EmailStatusBadge status={log.status} /></td>
              <td className="px-4 py-3">{log.attempts}/{log.maxAttempts}</td>
              <td className="px-4 py-3 text-slate-500">{formatDate(log.sentAt || log.failedAt || log.scheduledFor || log.createdAt, { hour: "2-digit", minute: "2-digit" })}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {log.candidateId ? <Link to={`/dashboard/candidates/${log.candidateId}`}><Button size="sm" variant="ghost" icon={UserRound}>Candidate</Button></Link> : null}
                  {log.interviewId ? <Link to={`/dashboard/interviews/${log.interviewId}`}><Button size="sm" variant="ghost" icon={CalendarClock}>Interview</Button></Link> : null}
                  <Link to={`/dashboard/emails/logs/${log.id}`}><Button size="sm" variant="outline" icon={Eye}>View</Button></Link>
                  {log.status === "Failed" ? <Button size="sm" variant="outline" icon={RefreshCw} onClick={() => onRetry(log)}>Retry</Button> : null}
                  {["Pending", "Failed"].includes(log.status) ? <Button size="sm" variant="outline" icon={StopCircle} onClick={() => onCancel(log)}>Cancel</Button> : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="grid gap-3 p-3 lg:hidden">
      {logs.map((log) => (
        <article key={log.id} className="rounded-lg border border-slate-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-slate-950">{log.to?.[0]?.email}</p>
              <p className="mt-1 text-sm text-slate-600">{log.subject}</p>
            </div>
            <EmailStatusBadge status={log.status} />
          </div>
          <p className="mt-2 text-xs font-semibold uppercase text-slate-400">{log.emailType} - {log.provider}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to={`/dashboard/emails/logs/${log.id}`}><Button size="sm" variant="outline" icon={Eye}>View</Button></Link>
            {log.status === "Failed" ? <Button size="sm" variant="outline" icon={RefreshCw} onClick={() => onRetry(log)}>Retry</Button> : null}
          </div>
        </article>
      ))}
    </div>
  </div>
);

export default EmailLogTable;
