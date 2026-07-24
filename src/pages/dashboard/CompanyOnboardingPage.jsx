import { Building2, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import useCompany from "../../hooks/useCompany.js";

const industries = [
  "Information Technology",
  "Software",
  "Recruitment",
  "Consulting",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "E-commerce",
  "Marketing",
  "Construction",
  "Other"
];

const sizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

const CompanyOnboardingPage = () => {
  const navigate = useNavigate();
  const { createCompany, saving, error } = useCompany();
  const [logoPreview, setLogoPreview] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      logo: "",
      website: "",
      industry: "",
      size: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      description: ""
    }
  });

  const watchedValues = watch();
  const completedSections = useMemo(() => {
    const basic = watchedValues.name && watchedValues.industry && watchedValues.size;
    const contact = watchedValues.contactEmail && watchedValues.city && watchedValues.state && watchedValues.country;
    const review = watchedValues.description;
    return [basic, contact, review].filter(Boolean).length;
  }, [watchedValues]);

  const onSubmit = async (values) => {
    const payload = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])
    );

    try {
      await createCompany(payload);
      toast.success("Company profile created successfully");
      navigate("/dashboard", { replace: true });
    } catch (apiError) {
      toast.error(apiError || "Unable to create company profile");
    }
  };

  return (
    <div>
      <PageHeader
        title="Company onboarding"
        description="Complete your company profile before accessing the recruiting workspace."
      />
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-600 p-2 text-white">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-950">Setup progress</p>
            <p className="text-sm text-blue-800">{completedSections} of 3 sections have core details.</p>
          </div>
        </div>
      </div>
      <form className="grid gap-6 xl:grid-cols-[1fr_320px]" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-6">
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          ) : null}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Basic company information</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Input
                label="Company name"
                required
                error={errors.name?.message}
                {...register("name", { required: "Company name is required", minLength: { value: 2, message: "Use at least 2 characters" } })}
              />
              <Input
                label="Logo URL"
                helperText="You can upload a logo later from company settings."
                error={errors.logo?.message}
                {...register("logo", {
                  onChange: (event) => setLogoPreview(event.target.value)
                })}
              />
              <Input label="Website" error={errors.website?.message} {...register("website")} />
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Industry <span className="text-red-600">*</span></label>
                <select className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm" {...register("industry", { required: "Industry is required" })}>
                  <option value="">Select industry</option>
                  {industries.map((industry) => <option key={industry}>{industry}</option>)}
                </select>
                {errors.industry ? <p className="text-sm text-red-600">{errors.industry.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Company size <span className="text-red-600">*</span></label>
                <select className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm" {...register("size", { required: "Company size is required" })}>
                  <option value="">Select size</option>
                  {sizes.map((size) => <option key={size}>{size}</option>)}
                </select>
                {errors.size ? <p className="text-sm text-red-600">{errors.size.message}</p> : null}
              </div>
            </div>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Contact and address</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Input label="Contact email" type="email" {...register("contactEmail")} />
              <Input label="Contact phone" {...register("contactPhone")} />
              <Input label="Address" className="sm:col-span-2" {...register("address")} />
              <Input label="City" required error={errors.city?.message} {...register("city", { required: "City is required" })} />
              <Input label="State" required error={errors.state?.message} {...register("state", { required: "State is required" })} />
              <Input label="Country" required error={errors.country?.message} {...register("country", { required: "Country is required" })} />
              <Input label="Postal code" {...register("postalCode")} />
            </div>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Company description</h2>
            <textarea
              className="mt-5 min-h-36 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              maxLength={2000}
              {...register("description")}
            />
          </section>
        </div>
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
            {logoPreview ? (
              <img src={logoPreview} alt="Company logo preview" className="max-h-28 max-w-48 object-contain" />
            ) : (
              <Building2 className="h-12 w-12 text-slate-400" aria-hidden="true" />
            )}
          </div>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600" /> HR dashboard unlocks after company creation.</p>
            <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600" /> You can edit settings anytime.</p>
          </div>
          <Button type="submit" loading={saving} className="mt-6 w-full">
            Save and continue
          </Button>
        </aside>
      </form>
    </div>
  );
};

export default CompanyOnboardingPage;
