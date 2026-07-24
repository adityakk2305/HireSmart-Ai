import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { fetchInterviewById, submitInterviewFeedback } from "../../features/interviews/interviewSlice.js";
import { INTERVIEW_RECOMMENDATIONS } from "../../utils/interviewConstants.js";

const fieldClass = "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const Rating = ({ label, register, name, required = false }) => <label className="space-y-2 text-sm font-semibold text-slate-700"><span>{label}</span><input type="number" min="1" max="5" step="0.25" className={fieldClass} {...register(name, { required, min: 1, max: 5 })} /></label>;

const InterviewFeedbackPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedInterview, feedbackSubmitting } = useSelector((state) => state.interviews);
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      technicalRating: 4,
      communicationRating: 4,
      problemSolvingRating: 4,
      cultureFitRating: 4,
      overallRating: 4,
      strengths: [{ value: "" }],
      concerns: [{ value: "" }],
      notes: "",
      recommendation: "Hire"
    }
  });
  const strengths = useFieldArray({ control, name: "strengths" });
  const concerns = useFieldArray({ control, name: "concerns" });

  useEffect(() => { dispatch(fetchInterviewById(id)); }, [dispatch, id]);

  const submit = async (values) => {
    const payload = {
      ...values,
      strengths: values.strengths.map((item) => item.value).filter(Boolean),
      concerns: values.concerns.map((item) => item.value).filter(Boolean),
      technicalRating: Number(values.technicalRating),
      communicationRating: Number(values.communicationRating),
      problemSolvingRating: Number(values.problemSolvingRating),
      cultureFitRating: Number(values.cultureFitRating),
      overallRating: Number(values.overallRating)
    };
    try {
      await dispatch(submitInterviewFeedback({ id, payload })).unwrap();
      toast.success("Feedback submitted");
      navigate(`/dashboard/interviews/${id}`);
    } catch (apiError) {
      toast.error(apiError || "Unable to submit feedback");
    }
  };

  return (
    <div>
      <PageHeader title="Interview feedback" description={selectedInterview?.title || "Submit interviewer feedback and recommendation."} action={<Link to={`/dashboard/interviews/${id}`}><Button variant="outline" icon={ArrowLeft}>Back</Button></Link>} />
      <form onSubmit={handleSubmit(submit)} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <Rating label="Technical rating" register={register} name="technicalRating" />
          <Rating label="Communication rating" register={register} name="communicationRating" />
          <Rating label="Problem solving rating" register={register} name="problemSolvingRating" />
          <Rating label="Culture fit rating" register={register} name="cultureFitRating" />
          <Rating label="Overall rating" register={register} name="overallRating" required />
          <label className="space-y-2 text-sm font-semibold text-slate-700"><span>Recommendation</span><select className={fieldClass} {...register("recommendation")}>{INTERVIEW_RECOMMENDATIONS.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div><p className="mb-2 text-sm font-bold text-slate-700">Strengths</p>{strengths.fields.map((field, index) => <input key={field.id} className={`${fieldClass} mb-2`} {...register(`strengths.${index}.value`)} />)}<Button size="sm" variant="outline" onClick={() => strengths.append({ value: "" })}>Add strength</Button></div>
          <div><p className="mb-2 text-sm font-bold text-slate-700">Concerns</p>{concerns.fields.map((field, index) => <input key={field.id} className={`${fieldClass} mb-2`} {...register(`concerns.${index}.value`)} />)}<Button size="sm" variant="outline" onClick={() => concerns.append({ value: "" })}>Add concern</Button></div>
        </div>
        <label className="mt-5 block space-y-2 text-sm font-semibold text-slate-700"><span>Notes</span><textarea className={`${fieldClass} h-32 py-3`} {...register("notes")} /></label>
        <div className="mt-6 flex justify-end"><Button type="submit" loading={feedbackSubmitting}>Submit feedback</Button></div>
      </form>
    </div>
  );
};

export default InterviewFeedbackPage;
