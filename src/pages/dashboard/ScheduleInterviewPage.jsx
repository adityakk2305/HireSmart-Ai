import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { fetchCandidates } from "../../features/candidates/candidateSlice.js";
import { sendInterviewInvitation } from "../../features/emails/emailSlice.js";
import { createInterview, fetchInterviewById, updateInterview } from "../../features/interviews/interviewSlice.js";
import { fetchJobs } from "../../features/jobs/jobSlice.js";
import { INTERVIEW_DURATIONS, INTERVIEW_MODES, INTERVIEW_ROUNDS, INTERVIEW_TYPES, TIMEZONES } from "../../utils/interviewConstants.js";

const fieldClass = "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const Field = ({ label, children }) => <label className="space-y-2 text-sm font-semibold text-slate-700"><span>{label}</span>{children}</label>;

const ScheduleInterviewPage = () => {
  const { candidateId, id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { candidates } = useSelector((state) => state.candidates);
  const { jobs } = useSelector((state) => state.jobs);
  const { selectedInterview, creating, updating } = useSelector((state) => state.interviews);
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      candidateId: candidateId || "",
      jobId: "",
      interviewRound: "Technical Round 1",
      customRoundLabel: "",
      title: "",
      interviewType: "Technical",
      interviewMode: "Video",
      date: "",
      time: "",
      durationMinutes: 60,
      timezone: "Asia/Kolkata",
      interviewerName: "",
      interviewerEmail: "",
      meetingLink: "",
      location: "",
      instructions: "",
      agenda: "",
      notifyCandidate: false
    }
  });
  const mode = watch("interviewMode");
  const selectedCandidateId = watch("candidateId");

  useEffect(() => {
    dispatch(fetchCandidates({ status: "", limit: 100 }));
    dispatch(fetchJobs({ limit: 100 }));
    if (isEdit) dispatch(fetchInterviewById(id));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && selectedInterview) {
      const start = new Date(selectedInterview.startTime);
      reset({
        candidateId: selectedInterview.candidateId,
        jobId: selectedInterview.jobId,
        interviewRound: selectedInterview.interviewRound,
        customRoundLabel: selectedInterview.customRoundLabel || "",
        title: selectedInterview.title,
        interviewType: selectedInterview.interviewType,
        interviewMode: selectedInterview.interviewMode,
        date: start.toISOString().slice(0, 10),
        time: start.toTimeString().slice(0, 5),
        durationMinutes: selectedInterview.durationMinutes,
        timezone: selectedInterview.timezone,
        interviewerName: selectedInterview.interviewers?.[0]?.name || "",
        interviewerEmail: selectedInterview.interviewers?.[0]?.email || "",
        meetingLink: selectedInterview.meetingLink || "",
        location: selectedInterview.location || "",
        instructions: selectedInterview.instructions || "",
        agenda: selectedInterview.agenda || "",
        notifyCandidate: false
      });
    }
  }, [isEdit, selectedInterview, reset]);

  useEffect(() => {
    const candidate = candidates.find((item) => item.id === selectedCandidateId);
    if (candidate?.jobId) setValue("jobId", candidate.jobId);
  }, [candidates, selectedCandidateId, setValue]);

  const submit = async (values) => {
    const payload = {
      candidateId: values.candidateId,
      jobId: values.jobId,
      interviewRound: values.interviewRound,
      customRoundLabel: values.customRoundLabel,
      title: values.title,
      interviewType: values.interviewType,
      interviewMode: values.interviewMode,
      startTime: new Date(`${values.date}T${values.time}:00`).toISOString(),
      durationMinutes: Number(values.durationMinutes),
      timezone: values.timezone,
      interviewers: [{ name: values.interviewerName, email: values.interviewerEmail, role: "Interviewer" }],
      meetingLink: values.meetingLink,
      location: values.location,
      instructions: values.instructions,
      agenda: values.agenda
    };
    try {
      const interview = isEdit
        ? await dispatch(updateInterview({ id, payload })).unwrap()
        : await dispatch(createInterview(payload)).unwrap();
      toast.success(isEdit ? "Interview updated" : "Interview scheduled");
      if (!isEdit && values.notifyCandidate) {
        try {
          const emailResult = await dispatch(sendInterviewInvitation({ interviewId: interview.id })).unwrap();
          toast.success(emailResult.duplicate ? "Invitation already sent" : "Invitation email processed");
        } catch (emailError) {
          toast.error(emailError || "Interview saved, but invitation email failed");
        }
      }
      navigate(`/dashboard/interviews/${interview.id}`);
    } catch (apiError) {
      toast.error(apiError || "Unable to save interview");
    }
  };

  return (
    <div>
      <PageHeader title={isEdit ? "Edit interview" : "Schedule interview"} description="Add interview timing, mode, interviewer and recruiter instructions." action={<Link to="/dashboard/interviews"><Button variant="outline" icon={ArrowLeft}>Back</Button></Link>} />
      <form onSubmit={handleSubmit(submit)} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Candidate"><select className={fieldClass} {...register("candidateId", { required: true })}><option value="">Select candidate</option>{candidates.map((item) => <option key={item.id} value={item.id}>{item.fullName} - {item.status}</option>)}</select>{errors.candidateId ? <p className="text-red-600">Candidate is required</p> : null}</Field>
          <Field label="Job"><select className={fieldClass} {...register("jobId", { required: true })}><option value="">Select job</option>{jobs.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></Field>
          <Field label="Round"><select className={fieldClass} {...register("interviewRound")}>{INTERVIEW_ROUNDS.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
          <Field label="Custom round label"><input className={fieldClass} {...register("customRoundLabel")} /></Field>
          <Field label="Title"><input className={fieldClass} {...register("title", { required: true })} placeholder="Technical Round 1 - MERN Stack Developer" /></Field>
          <Field label="Type"><select className={fieldClass} {...register("interviewType")}>{INTERVIEW_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
          <Field label="Mode"><select className={fieldClass} {...register("interviewMode")}>{INTERVIEW_MODES.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
          <Field label="Duration"><select className={fieldClass} {...register("durationMinutes")}>{INTERVIEW_DURATIONS.map((item) => <option key={item} value={item}>{item} minutes</option>)}</select></Field>
          <Field label="Date"><input className={fieldClass} type="date" {...register("date", { required: true })} /></Field>
          <Field label="Start time"><input className={fieldClass} type="time" {...register("time", { required: true })} /></Field>
          <Field label="Timezone"><select className={fieldClass} {...register("timezone")}>{TIMEZONES.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
          <Field label="Interviewer name"><input className={fieldClass} {...register("interviewerName", { required: true })} /></Field>
          <Field label="Interviewer email"><input className={fieldClass} type="email" {...register("interviewerEmail", { required: true })} /></Field>
          {mode === "Video" ? <Field label="Meeting link"><input className={fieldClass} placeholder="https://meet.google.com/..." {...register("meetingLink", { required: mode === "Video" })} /></Field> : null}
          {mode === "Phone" ? <Field label="Phone instructions"><input className={fieldClass} {...register("instructions")} placeholder="Call details or bridge instructions" /></Field> : null}
          {mode === "In Person" ? <Field label="Physical location"><input className={fieldClass} {...register("location", { required: mode === "In Person" })} /></Field> : null}
          <Field label="Agenda"><textarea className={`${fieldClass} h-28 py-3`} {...register("agenda")} /></Field>
          <Field label="Instructions"><textarea className={`${fieldClass} h-28 py-3`} {...register("instructions")} /></Field>
        </div>
        {!isEdit ? (
          <section className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <label className="flex items-start gap-3 text-sm font-semibold text-blue-950">
              <input type="checkbox" className="mt-1" {...register("notifyCandidate")} />
              <span>Save and send interview invitation email. If email fails, the interview remains scheduled and the email log can be retried.</span>
            </label>
          </section>
        ) : null}
        <div className="mt-6 flex justify-end"><Button type="submit" loading={creating || updating}>{isEdit ? "Save interview" : "Schedule interview"}</Button></div>
      </form>
    </div>
  );
};

export default ScheduleInterviewPage;
