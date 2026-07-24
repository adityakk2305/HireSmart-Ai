import { Building2, CheckCircle2, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import FormError from "../../components/common/FormError.jsx";
import Input from "../../components/common/Input.jsx";
import PasswordInput from "../../components/common/PasswordInput.jsx";
import PasswordRequirements from "../../components/common/PasswordRequirements.jsx";
import PhoneInput from "../../components/common/PhoneInput.jsx";
import { defaultCountryCode } from "../../data/countries.js";
import useAuth from "../../hooks/useAuth.js";
import { isStrongPassword } from "../../utils/passwordValidation.js";
import { toInternationalPhone, validateInternationalPhone } from "../../utils/phoneValidation.js";

const initialForm = {
  name: "",
  email: "",
  phoneCountry: defaultCountryCode,
  phoneLocal: "",
  password: "",
  confirmPassword: "",
  terms: false
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = "Register | HireSmart AI";
  }, []);

  const canSubmit = useMemo(
    () =>
      Boolean(form.name.trim()) &&
      Boolean(form.email.trim()) &&
      !validateInternationalPhone(form.phoneCountry, form.phoneLocal) &&
      isStrongPassword(form.password, form.confirmPassword) &&
      form.terms &&
      !loading,
    [form, loading]
  );

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setErrors((current) => ({ ...current, [name]: "", form: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) {
      nextErrors.name = "Full name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Work email is required.";
    } else if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = "Enter a valid work email address.";
    }

    const phoneError = validateInternationalPhone(form.phoneCountry, form.phoneLocal);
    if (phoneError) {
      nextErrors.phone = phoneError;
    }

    if (!isStrongPassword(form.password, form.confirmPassword)) {
      nextErrors.password = "Password must meet every requirement.";
    }

    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords must match.";
    }

    if (!form.terms) {
      nextErrors.terms = "Accept the terms and data handling policy to continue.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || loading) {
      return;
    }

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: toInternationalPhone(form.phoneCountry, form.phoneLocal),
        password: form.password,
        confirmPassword: form.confirmPassword
      });
      toast.success("Registration successful");
      navigate("/dashboard/company-onboarding", { replace: true });
    } catch (apiError) {
      setErrors({ form: apiError || "Unable to register." });
    }
  };

  return (
    <section className="bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
              <Building2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-4xl font-bold">Create your HR workspace with confidence.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Start building a smarter recruitment workflow for resume screening, candidate review and team hiring decisions.
            </p>
          </div>
          <div className="grid gap-3">
            {["Secure account setup", "International phone format", "Strong password protection", "Guided company onboarding"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg bg-white/10 p-4">
                <CheckCircle2 className="h-5 w-5 text-green-300" aria-hidden="true" />
                <span className="text-sm font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600 dark:text-blue-300">Create account</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Create your HireSmart AI account</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Create your HireSmart AI account and start building a smarter recruitment workflow.
            </p>
          </div>

          <FormError className="mb-5">{errors.form || error}</FormError>

          <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
            <div className="sm:col-span-2">
              <Input
                label="Full name"
                name="name"
                placeholder="Avery Johnson"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
                autoComplete="name"
                required
              />
            </div>
            <Input
              label="Work email"
              name="email"
              type="email"
              placeholder="avery@company.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
              required
            />
            <PhoneInput
              countryCode={form.phoneCountry}
              localNumber={form.phoneLocal}
              onCountryChange={(phoneCountry) => {
                setForm((current) => ({ ...current, phoneCountry }));
                setErrors((current) => ({ ...current, phone: "", form: "" }));
              }}
              onNumberChange={(phoneLocal) => {
                setForm((current) => ({ ...current, phoneLocal }));
                setErrors((current) => ({ ...current, phone: "", form: "" }));
              }}
              error={errors.phone}
              required
            />
            <PasswordInput
              label="Password"
              name="password"
              placeholder="Password@123"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
              required
            />
            <PasswordInput
              label="Confirm password"
              name="confirmPassword"
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
              required
            />
            <div className="sm:col-span-2">
              <PasswordRequirements password={form.password} confirmPassword={form.confirmPassword} />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  name="terms"
                  checked={form.terms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600"
                />
                <span>I agree to HireSmart AI terms and recruiter data handling policies.</span>
              </label>
              {errors.terms ? <p className="mt-2 text-sm text-red-600 dark:text-red-300">{errors.terms}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" icon={UserPlus} loading={loading} disabled={!canSubmit} className="w-full">
                Register
              </Button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
