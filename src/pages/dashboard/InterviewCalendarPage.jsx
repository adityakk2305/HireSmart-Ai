import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import InterviewStatusBadge from "../../components/interviews/InterviewStatusBadge.jsx";
import { fetchInterviews, setInterviewFilters } from "../../features/interviews/interviewSlice.js";
import { formatInterviewDateTime } from "../../utils/interviewConstants.js";

const InterviewCalendarPage = () => {
  const dispatch = useDispatch();
  const { interviews, filters } = useSelector((state) => state.interviews);
  const [cursor, setCursor] = useState(new Date());
  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);

  useEffect(() => {
    dispatch(fetchInterviews({ ...filters, limit: 100, dateFrom: monthStart.toISOString(), dateTo: monthEnd.toISOString() }));
  }, [dispatch, cursor]);

  const days = useMemo(() => {
    const start = new Date(monthStart);
    start.setDate(1 - start.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }, [cursor]);

  const byDay = (day) => interviews.filter((item) => new Date(item.startTime).toDateString() === day.toDateString());

  return (
    <div>
      <PageHeader title="Interview Calendar" description="Monthly view of company interviews with status indicators." action={<Link to="/dashboard/interviews"><Button variant="outline" icon={List}>List</Button></Link>} />
      <div className="mb-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <Button variant="outline" icon={ChevronLeft} onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>Previous</Button>
        <div className="text-center"><p className="text-lg font-bold text-slate-950">{cursor.toLocaleString("en-IN", { month: "long", year: "numeric" })}</p><Button size="sm" variant="ghost" onClick={() => setCursor(new Date())}>Today</Button></div>
        <Button variant="outline" icon={ChevronRight} onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>Next</Button>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
        {days.map((day) => (
          <div key={day.toISOString()} className={`min-h-36 rounded-lg border border-slate-200 bg-white p-3 shadow-sm ${day.getMonth() === cursor.getMonth() ? "" : "opacity-50"}`}>
            <p className="mb-2 text-sm font-bold text-slate-700">{day.getDate()}</p>
            <div className="space-y-2">
              {byDay(day).map((interview) => (
                <Link key={interview.id} to={`/dashboard/interviews/${interview.id}`} className="block rounded-md border border-blue-100 bg-blue-50 p-2 text-xs text-blue-900">
                  <p className="font-bold">{new Date(interview.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} {interview.candidate?.fullName}</p>
                  <p>{interview.roundLabel}</p>
                  <InterviewStatusBadge status={interview.status} />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewCalendarPage;
