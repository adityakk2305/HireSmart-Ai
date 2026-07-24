import { Building2, Save, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";
import useCompany from "../../hooks/useCompany.js";
import { formatDate } from "../../utils/formatDate.js";

const sizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

const CompanySettingsPage = () => {
  const { company, fetchCompany, updateCompany, uploadCompanyLogo, loading, saving, error } = useCompany();
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm();

  useEffect(() => {
    fetchCompany().catch(() => {});
  }, [fetchCompany]);

  useEffect(() => {
    if (company) {
      reset(company);
    }
  }, [company, reset]);

  const onSubmit = async (values) => {
    try {
      await updateCompany(values);
      toast.success("Company settings updated");
    } catch (apiError) {
      toast.error(apiError || "Unable to update company");
    }
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadCompanyLogo(file);
      toast.success("Company logo uploaded");
    } catch (apiError) {
      toast.error(apiError || "Unable to upload logo");
    } finally {
      setUploading(false);
    }
  };

  if (loading && !company) {
    return <PageLoader message="Loading company settings" />;
  }

  return (
    <div>
      <PageHeader title="Company settings" description="Manage your organization profile and contact information." />
      {error ? <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div> : null}
      <form className="grid gap-6 xl:grid-cols-[1fr_320px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Company name" error={errors.name?.message} {...register("name", { required: "Company name is required" })} />
            <Input label="Slug" disabled {...register("slug")} />
            <Input label="Website" {...register("website")} />
            <Input label="Industry" {...register("industry", { required: "Industry is required" })} />
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Company size</label>
              <select className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm" {...register("size", { required: "Company size is required" })}>
                {sizes.map((size) => <option key={size}>{size}</option>)}
              </select>
            </div>
            <Input label="Created" disabled value={company?.createdAt ? formatDate(company.createdAt) : ""} onChange={() => {}} />
            <Input label="Contact email" type="email" {...register("contactEmail")} />
            <Input label="Contact phone" {...register("contactPhone")} />
            <Input label="Address" {...register("address")} />
            <Input label="City" {...register("city", { required: "City is required" })} />
            <Input label="State" {...register("state", { required: "State is required" })} />
            <Input label="Country" {...register("country", { required: "Country is required" })} />
            <Input label="Postal code" {...register("postalCode")} />
          </div>
          <label className="mt-5 block text-sm font-semibold text-slate-700">Description</label>
          <textarea className="mt-2 min-h-36 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm" maxLength={2000} {...register("description")} />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" disabled={!isDirty} onClick={() => reset(company)}>
              Cancel
            </Button>
            <Button type="submit" icon={Save} loading={saving} disabled={!isDirty}>
              Save changes
            </Button>
          </div>
        </div>
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
            {company?.logo ? <img src={company.logo} alt={company.name} className="max-h-28 max-w-48 object-contain" /> : <Building2 className="h-12 w-12 text-slate-400" />}
          </div>
          <label className="mt-5 block">
            <span className="sr-only">Upload company logo</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleLogoUpload} />
            <span className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload logo"}
            </span>
          </label>
        </aside>
      </form>
    </div>
  );
};

export default CompanySettingsPage;
