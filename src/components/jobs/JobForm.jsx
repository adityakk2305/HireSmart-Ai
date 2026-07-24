import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  EMPLOYMENT_TYPES,
  JOB_STATUSES,
  SALARY_CURRENCIES,
  SALARY_PERIODS,
  WORK_MODES
} from "../../utils/constants.js";
import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";
import ResponsibilitiesInput from "./ResponsibilitiesInput.jsx";
import ScreeningQuestionBuilder from "./ScreeningQuestionBuilder.jsx";
import SkillsInput from "./SkillsInput.jsx";

const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
};

export const defaultJobValues = {
  title: "",
  department: "",
  employmentType: "Full-time",
  workMode: "On-site",
  location: "",
  minimumExperience: 0,
  maximumExperience: 0,
  requiredSkills: [],
  preferredSkills: [],
  education: "",
  description: "",
  responsibilities: [""],
  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "INR",
  salaryPeriod: "Yearly",
  openings: 1,
  deadline: tomorrow(),
  status: "Draft",
  screeningQuestions: []
};

const normalizePayload = (values) => ({
  ...values,
  minimumExperience: Number(values.minimumExperience || 0),
  maximumExperience: Number(values.maximumExperience || 0),
  openings: Number(values.openings || 1),
  salaryMin: values.salaryMin === "" ? null : Number(values.salaryMin),
  salaryMax: values.salaryMax === "" ? null : Number(values.salaryMax),
  responsibilities: values.responsibilities.map((item) => item.trim()).filter(Boolean),
  requiredSkills: values.requiredSkills,
  preferredSkills: values.preferredSkills,
  screeningQuestions: values.screeningQuestions
    .filter((item) => item.question?.trim())
    .map((item, index) => ({ ...item, order: index, options: (item.options || []).filter(Boolean) }))
});

const JobForm = ({ initialValues, saving = false, onSubmit, submitLabel = "Save job" }) => {
  const navigate = useNavigate();
  const [requiredSkills, setRequiredSkills] = useState(initialValues?.requiredSkills || []);
  const [preferredSkills, setPreferredSkills] = useState(initialValues?.preferredSkills || []);
  const [responsibilities, setResponsibilities] = useState(initialValues?.responsibilities || [""]);
  const [screeningQuestions, setScreeningQuestions] = useState(initialValues?.screeningQuestions || []);
  const [localError, setLocalError] = useState("");
  const values = useMemo(() => ({ ...defaultJobValues, ...initialValues }), [initialValues]);
  const { register, handleSubmit, reset, watch, formState: { errors, isDirty } } = useForm({ defaultValues: values });

  useEffect(() => {
    reset(values);
    setRequiredSkills(values.requiredSkills || []);
    setPreferredSkills(values.preferredSkills || []);
    setResponsibilities(values.responsibilities?.length ? values.responsibilities : [""]);
    setScreeningQuestions(values.screeningQuestions || []);
  }, [reset, values]);

  const workMode = watch("workMode");

  const submit = async (formValues) => {
    setLocalError("");

    if (requiredSkills.length === 0) {
      setLocalError("Add at least one required skill.");
      return;
    }

    if (responsibilities.filter((item) => item.trim()).length === 0) {
      setLocalError("Add at least one responsibility.");
      return;
    }

    if (Number(formValues.maximumExperience) < Number(formValues.minimumExperience)) {
      setLocalError("Maximum experience must be greater than or equal to minimum experience.");
      return;
    }

    if (formValues.salaryMin && formValues.salaryMax && Number(formValues.salaryMax) < Number(formValues.salaryMin)) {
      setLocalError("Maximum salary must be greater than or equal to minimum salary.");
      return;
    }

    await onSubmit(
      normalizePayload({
        ...formValues,
        requiredSkills,
        preferredSkills,
        responsibilities,
        screeningQuestions
      })
    );
  };

  const handleCancel = () => {
    if (!isDirty || window.confirm("Discard unsaved job changes?")) {
      navigate(-1);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(submit)} noValidate>
      {localError ? <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{localError}</div> : null}
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Basic information</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Input label="Job title" required error={errors.title?.message} {...register("title", { required: "Job title is required", minLength: { value: 2, message: "Use at least 2 characters" } })} />
          <Input label="Department" required error={errors.department?.message} {...register("department", { required: "Department is required" })} />
          <select className="h-11 rounded-lg border border-slate-300 px-3 text-sm" {...register("employmentType")}>{EMPLOYMENT_TYPES.map((item) => <option key={item}>{item}</option>)}</select>
          <select className="h-11 rounded-lg border border-slate-300 px-3 text-sm" {...register("workMode")}>{WORK_MODES.map((item) => <option key={item}>{item}</option>)}</select>
          <Input label="Location" required={workMode !== "Remote"} error={errors.location?.message} {...register("location", { validate: (value) => workMode === "Remote" || Boolean(value?.trim()) || "Location is required unless remote" })} />
          <Input label="Education" required error={errors.education?.message} {...register("education", { required: "Education is required" })} />
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Experience, salary and deadline</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <Input label="Minimum experience" type="number" {...register("minimumExperience")} />
          <Input label="Maximum experience" type="number" {...register("maximumExperience")} />
          <Input label="Openings" type="number" {...register("openings", { required: "Openings are required", min: 1 })} />
          <Input label="Salary minimum" type="number" {...register("salaryMin")} />
          <Input label="Salary maximum" type="number" {...register("salaryMax")} />
          <select className="h-11 rounded-lg border border-slate-300 px-3 text-sm" {...register("salaryCurrency")}>{SALARY_CURRENCIES.map((item) => <option key={item}>{item}</option>)}</select>
          <select className="h-11 rounded-lg border border-slate-300 px-3 text-sm" {...register("salaryPeriod")}>{SALARY_PERIODS.map((item) => <option key={item}>{item}</option>)}</select>
          <Input label="Deadline" type="date" required {...register("deadline", { required: "Deadline is required" })} />
          <select className="h-11 rounded-lg border border-slate-300 px-3 text-sm" {...register("status")}>{JOB_STATUSES.map((item) => <option key={item}>{item}</option>)}</select>
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Skills</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <SkillsInput label="Required skills" value={requiredSkills} onChange={setRequiredSkills} required />
          <SkillsInput label="Preferred skills" value={preferredSkills} onChange={setPreferredSkills} />
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Description and responsibilities</h2>
        <textarea className="mt-5 min-h-48 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm" placeholder="Describe the role, impact, team and expectations." {...register("description", { required: "Description is required", minLength: { value: 50, message: "Use at least 50 characters" } })} />
        {errors.description ? <p className="mt-2 text-sm text-red-600">{errors.description.message}</p> : null}
        <div className="mt-5">
          <ResponsibilitiesInput value={responsibilities} onChange={setResponsibilities} />
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Screening questions</h2>
        <div className="mt-5">
          <ScreeningQuestionBuilder value={screeningQuestions} onChange={setScreeningQuestions} />
        </div>
      </section>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
        <Button type="submit" loading={saving}>{submitLabel}</Button>
      </div>
    </form>
  );
};

export default JobForm;
