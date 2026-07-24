import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";
import {
  clearSelectedCandidate,
  fetchCandidateById,
  updateCandidate
} from "../../features/candidates/candidateSlice.js";
import { CANDIDATE_SOURCES, NOTICE_PERIOD_OPTIONS } from "../../utils/constants.js";

const editableFields = [
  "fullName",
  "email",
  "phone",
  "location",
  "totalExperience",
  "currentCompany",
  "currentDesignation",
  "expectedSalary",
  "noticePeriod",
  "linkedinUrl",
  "githubUrl",
  "portfolioUrl",
  "coverLetter",
  "source"
];

const EditCandidatePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedCandidate, detailsLoading, saving } = useSelector((state) => state.candidates);
  const candidate = selectedCandidate?.candidate;
  const [values, setValues] = useState(null);

  useEffect(() => {
    dispatch(fetchCandidateById(id));
    return () => dispatch(clearSelectedCandidate());
  }, [dispatch, id]);

  const initialValues = useMemo(() => {
    if (!candidate) return null;
    return editableFields.reduce((acc, field) => {
      acc[field] = candidate[field] ?? "";
      return acc;
    }, {});
  }, [candidate]);

  useEffect(() => {
    if (initialValues) setValues(initialValues);
  }, [initialValues]);

  const setField = (field, value) => setValues((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(updateCandidate({ id, payload: values })).unwrap();
      toast.success("Candidate updated");
      navigate(`/dashboard/candidates/${id}`);
    } catch (apiError) {
      toast.error(apiError || "Unable to update candidate");
    }
  };

  if (detailsLoading || !values) return <PageLoader message="Loading candidate" />;

  return (
    <div>
      <PageHeader
        title="Edit candidate"
        description="Update candidate details. Job, company, application ID and status are protected."
        action={<Link to={`/dashboard/candidates/${id}`}><Button variant="outline" icon={ArrowLeft}>Back to candidate</Button></Link>}
      />
      <form className="space-y-6" onSubmit={submit}>
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Full name" value={values.fullName} onChange={(event) => setField("fullName", event.target.value)} />
            <Input label="Email" type="email" value={values.email} onChange={(event) => setField("email", event.target.value)} />
            <Input label="Phone" value={values.phone} onChange={(event) => setField("phone", event.target.value)} />
            <Input label="Location" value={values.location} onChange={(event) => setField("location", event.target.value)} />
            <Input label="Total experience" type="number" value={values.totalExperience} onChange={(event) => setField("totalExperience", event.target.value)} />
            <Input label="Current company" value={values.currentCompany} onChange={(event) => setField("currentCompany", event.target.value)} />
            <Input label="Current designation" value={values.currentDesignation} onChange={(event) => setField("currentDesignation", event.target.value)} />
            <Input label="Expected salary" type="number" value={values.expectedSalary || ""} onChange={(event) => setField("expectedSalary", event.target.value)} />
            <select className="h-11 rounded-lg border border-slate-300 px-3 text-sm" value={values.noticePeriod || ""} onChange={(event) => setField("noticePeriod", event.target.value)}>
              <option value="">Notice period</option>
              {NOTICE_PERIOD_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select className="h-11 rounded-lg border border-slate-300 px-3 text-sm" value={values.source || ""} onChange={(event) => setField("source", event.target.value)}>
              {CANDIDATE_SOURCES.map((source) => <option key={source}>{source}</option>)}
            </select>
            <Input label="LinkedIn URL" value={values.linkedinUrl || ""} onChange={(event) => setField("linkedinUrl", event.target.value)} />
            <Input label="GitHub URL" value={values.githubUrl || ""} onChange={(event) => setField("githubUrl", event.target.value)} />
            <Input label="Portfolio URL" value={values.portfolioUrl || ""} onChange={(event) => setField("portfolioUrl", event.target.value)} />
          </div>
          <textarea
            className="mt-5 min-h-36 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm"
            value={values.coverLetter || ""}
            onChange={(event) => setField("coverLetter", event.target.value)}
          />
        </section>
        <div className="flex justify-end">
          <Button type="submit" loading={saving}>Save changes</Button>
        </div>
      </form>
    </div>
  );
};

export default EditCandidatePage;
