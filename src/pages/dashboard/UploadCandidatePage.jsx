import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getJobsRequest } from "../../api/jobApi.js";
import CandidateApplicationForm from "../../components/candidates/CandidateApplicationForm.jsx";
import Button from "../../components/common/Button.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { uploadCandidate } from "../../features/candidates/candidateSlice.js";
import { CANDIDATE_SOURCES } from "../../utils/constants.js";

const UploadCandidatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uploading } = useSelector((state) => state.candidates);
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [source, setSource] = useState("HR Upload");

  useEffect(() => {
    getJobsRequest({ page: 1, limit: 100, sort: "newest" })
      .then((data) => {
        setJobs(data.jobs);
        setJobId(data.jobs[0]?.id || "");
      })
      .catch(() => setJobs([]));
  }, []);

  const selectedJob = jobs.find((job) => job.id === jobId);

  const submit = async (formData) => {
    if (!jobId) {
      toast.error("Select a job");
      return;
    }

    formData.append("source", source);

    try {
      const result = await dispatch(uploadCandidate({ jobId, formData })).unwrap();
      toast.success("Candidate uploaded");
      navigate(`/dashboard/candidates/${result.candidate.id}`);
    } catch (apiError) {
      toast.error(apiError || "Unable to upload candidate");
    }
  };

  return (
    <div>
      <PageHeader
        title="Upload candidate"
        description="Add a candidate and resume to one of your company jobs."
        action={
          <Link to="/dashboard/candidates">
            <Button variant="outline" icon={ArrowLeft}>Back to candidates</Button>
          </Link>
        }
      />
      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Job</label>
            <select className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm" value={jobId} onChange={(event) => setJobId(event.target.value)}>
              <option value="">Select job</option>
              {jobs.map((job) => <option key={job.id} value={job.id}>{job.title} - {job.status}</option>)}
            </select>
            {selectedJob && selectedJob.status !== "Active" ? (
              <p className="mt-2 text-sm font-semibold text-amber-700">This job is {selectedJob.status}. Public applications may not be open.</p>
            ) : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Source</label>
            <select className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm" value={source} onChange={(event) => setSource(event.target.value)}>
              {CANDIDATE_SOURCES.filter((item) => item !== "Public Application").map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>
      </section>
      <CandidateApplicationForm job={selectedJob || { screeningQuestions: [] }} hrMode submitting={uploading} onSubmit={submit} submitLabel="Upload candidate" />
    </div>
  );
};

export default UploadCandidatePage;
