import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import JobForm from "../../components/jobs/JobForm.jsx";
import { createJob } from "../../features/jobs/jobSlice.js";

const CreateJobPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { saving } = useSelector((state) => state.jobs);

  const handleSubmit = async (payload) => {
    try {
      const result = await dispatch(createJob(payload)).unwrap();
      toast.success("Job created successfully");
      navigate(`/dashboard/jobs/${result.job.id}`);
    } catch (error) {
      toast.error(error || "Unable to create job");
    }
  };

  return (
    <div>
      <PageHeader
        title="Create job"
        description="Publish a role with skills, compensation, responsibilities and screening questions."
        action={
          <Link to="/dashboard/jobs">
            <Button variant="outline" icon={ArrowLeft}>Back to jobs</Button>
          </Link>
        }
      />
      <JobForm saving={saving} onSubmit={handleSubmit} submitLabel="Create job" />
    </div>
  );
};

export default CreateJobPage;
