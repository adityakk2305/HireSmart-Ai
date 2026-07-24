import { useState } from "react";
import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";
import { NOTICE_PERIOD_OPTIONS } from "../../utils/constants.js";
import ResumeUploadField from "./ResumeUploadField.jsx";
import ScreeningAnswersForm from "./ScreeningAnswersForm.jsx";

const defaultValues = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  totalExperience: 0,
  currentCompany: "",
  currentDesignation: "",
  expectedSalary: "",
  noticePeriod: "",
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  coverLetter: ""
};

const CandidateApplicationForm = ({ job, submitting = false, onSubmit, submitLabel = "Submit application", hrMode = false }) => {
  const [values, setValues] = useState(defaultValues);
  const [resume, setResume] = useState(null);
  const [answers, setAnswers] = useState({});
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});

  const setField = (field, value) => setValues((current) => ({ ...current, [field]: value }));

  const validate = () => {
    const nextErrors = {};
    if (!values.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!values.email.trim()) nextErrors.email = "Email is required";
    if (!values.phone.trim()) nextErrors.phone = "Phone is required";
    if (!resume) nextErrors.resume = "Resume is required";
    if (!hrMode && !consent) nextErrors.consent = "Consent is required";

    (job?.screeningQuestions || []).forEach((question) => {
      const answer = answers[question.key];
      if (question.required && (answer === undefined || answer === null || answer === "")) {
        nextErrors[question.key] = "This answer is required";
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) formData.append(key, value);
    });
    const screeningAnswers = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
    formData.append("screeningAnswers", JSON.stringify(screeningAnswers));
    formData.append("resume", resume);
    onSubmit(formData);
  };

  return (
    <form className="space-y-6" onSubmit={submit} noValidate>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Personal information</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Input label="Full name" required value={values.fullName} error={errors.fullName} onChange={(event) => setField("fullName", event.target.value)} />
          <Input label="Email" type="email" required value={values.email} error={errors.email} onChange={(event) => setField("email", event.target.value)} />
          <Input label="Phone" required value={values.phone} error={errors.phone} onChange={(event) => setField("phone", event.target.value)} />
          <Input label="Current location" value={values.location} onChange={(event) => setField("location", event.target.value)} />
          <Input label="Total experience" type="number" value={values.totalExperience} onChange={(event) => setField("totalExperience", event.target.value)} />
          <Input label="Current company" value={values.currentCompany} onChange={(event) => setField("currentCompany", event.target.value)} />
          <Input label="Current designation" value={values.currentDesignation} onChange={(event) => setField("currentDesignation", event.target.value)} />
          <Input label="Expected salary" type="number" value={values.expectedSalary} onChange={(event) => setField("expectedSalary", event.target.value)} />
          <select
            className="h-11 rounded-lg border border-slate-300 px-3 text-sm"
            value={values.noticePeriod}
            onChange={(event) => setField("noticePeriod", event.target.value)}
          >
            <option value="">Notice period</option>
            {NOTICE_PERIOD_OPTIONS.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Links and cover letter</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <Input label="LinkedIn URL" value={values.linkedinUrl} onChange={(event) => setField("linkedinUrl", event.target.value)} />
          <Input label="GitHub URL" value={values.githubUrl} onChange={(event) => setField("githubUrl", event.target.value)} />
          <Input label="Portfolio URL" value={values.portfolioUrl} onChange={(event) => setField("portfolioUrl", event.target.value)} />
        </div>
        <textarea
          className="mt-5 min-h-36 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm"
          placeholder="Cover letter"
          value={values.coverLetter}
          onChange={(event) => setField("coverLetter", event.target.value)}
        />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Resume</h2>
        <div className="mt-5">
          <ResumeUploadField value={resume} onChange={setResume} error={errors.resume} />
        </div>
      </section>

      {!hrMode ? (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Screening questions</h2>
          <div className="mt-5">
            <ScreeningAnswersForm questions={job?.screeningQuestions || []} answers={answers} onChange={setAnswers} errors={errors} />
          </div>
        </section>
      ) : null}

      {!hrMode ? (
        <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1" />
          <span>
            I confirm this information is accurate and understand it will be shared with the hiring company for recruitment. Resume information may be processed for recruiting workflows and AI-assisted evaluation where enabled.
            {errors.consent ? <span className="mt-2 block text-red-600">{errors.consent}</span> : null}
          </span>
        </label>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit" loading={submitting}>{submitLabel}</Button>
      </div>
    </form>
  );
};

export default CandidateApplicationForm;
