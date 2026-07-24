import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";
import JobForm from "../../components/jobs/JobForm.jsx";
import { clearSelectedJob, fetchJobById, updateJob } from "../../features/jobs/jobSlice.js";

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");

const EditJobPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedJob, detailsLoading, saving } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobById(id));
    return () => dispatch(clearSelectedJob());
  }, [dispatch, id]);

  const job = selectedJob?.job;
  const initialValues = useMemo(() => {
    if (!job) return null;
    return {
      ...job,
      deadline: toDateInput(job.deadline),
      salaryMin: job.salaryMin ?? "",
      salaryMax: job.salaryMax ?? ""
    };
  }, [job]);

  const handleSubmit = async (payload) => {
    try {
      await dispatch(updateJob({ id, payload })).unwrap();
      toast.success("Job updated successfully");
      navigate(`/dashboard/jobs/${id}`);
    } catch (error) {
      toast.error(error || "Unable to update job");
    }
  };

  if (detailsLoading || !initialValues) {
    return <PageLoader message="Loading job" />;
  }

  return (
    <div>
      <PageHeader
        title="Edit job"
        description="Update the role details, screening questions and publication status."
        action={
          <Link to={`/dashboard/jobs/${id}`}>
            <Button variant="outline" icon={ArrowLeft}>Back to job</Button>
          </Link>
        }
      />
      <JobForm initialValues={initialValues} saving={saving} onSubmit={handleSubmit} submitLabel="Save changes" />
    </div>
  );
};

export default EditJobPage;
