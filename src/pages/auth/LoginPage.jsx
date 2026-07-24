import { BarChart3, CheckCircle2, LogIn, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCompanyOnboardingStatusRequest } from "../../api/companyApi.js";
import Button from "../../components/common/Button.jsx";
import FormError from "../../components/common/FormError.jsx";
import Input from "../../components/common/Input.jsx";
import PasswordInput from "../../components/common/PasswordInput.jsx";
import useAuth from "../../hooks/useAuth.js";

const demoCredentials = [
  { label: "Admin", email: "admin@hiresmart.com", password: "Admin@12345" },
  { label: "HR", email: "hr@hiresmart.com", password: "Hr@12345" }
];

const highlights = [
  { label: "AI resume screening", icon: Sparkles },
  { label: "Candidate ranking", icon: BarChart3 },
  { label: "Interview scheduling", icon: UsersRound },
  { label: "Secure HR workspace", icon: ShieldCheck }
];

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const showDemoCredentials =
    import.meta.env.VITE_SHOW_DEMO_CREDENTIALS === "true" && !import.meta.env.PROD;

  useEffect(() => {
    document.title = "Login | HireSmart AI";
  }, []);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setErrors((current) => ({ ...current, [name]: "", form: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    }

    return nextErrors;
  };

  const getRedirectPath = async (user) => {
    const attemptedPath = location.state?.from?.pathname;

    if (user.role === "hr") {
      const status = await getCompanyOnboardingStatusRequest().catch(() => ({
        hasCompany: Boolean(user.companyId)
      }));

      if (!status.hasCompany) {
        return "/dashboard/company-onboarding";
      }
    }

    if (attemptedPath && attemptedPath !== "/login" && attemptedPath !== "/register") {
      return attemptedPath;
    }

    return user.role === "admin" ? "/admin" : "/dashboard";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || loading) {
      return;
    }

    try {
      const data = await login({ email: form.email.trim(), password: form.password });
      toast.success("Login successful");
      navigate(await getRedirectPath(data.user), { replace: true });
    } catch (apiError) {
      setErrors({ form: apiError || "Unable to login." });
    }
  };

  const fillDemo = (credential) => {
    setForm((current) => ({
      ...current,
      email: credential.email,
      password: credential.password
    }));
  };

  return (
    <section className="bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[1fr_0.95fr]">
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600 dark:text-blue-300">Welcome back</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Login to HireSmart AI</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Access your secure HR workspace to screen resumes, rank candidates and manage hiring decisions.
            </p>
          </div>

          <FormError className="mb-5">{errors.form || error}</FormError>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="hr@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
              required
            />
            <PasswordInput
              label="Password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
              required
            />
            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" icon={LogIn} loading={loading} disabled={loading} className="w-full">
              Login
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
            New to HireSmart AI?{" "}
            <Link to="/register" className="font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
              Create an HR account
            </Link>
          </p>

          {showDemoCredentials ? (
            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
              <p className="text-sm font-bold text-blue-950 dark:text-blue-100">Local demo accounts</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {demoCredentials.map((credential) => (
                  <button
                    type="button"
                    key={credential.email}
                    onClick={() => fillDemo(credential)}
                    className="rounded-lg border border-blue-200 bg-white p-3 text-left text-sm shadow-sm transition hover:border-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-500/30 dark:bg-slate-900"
                  >
                    <p className="font-bold text-slate-950 dark:text-white">{credential.label}</p>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">{credential.email}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-blue-100">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Smarter hiring starts here
            </div>
            <h2 className="mt-6 text-4xl font-bold">Your recruiting command center, ready when you are.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Review parsed resumes, compare AI scores and keep candidate decisions moving in a secure team workspace.
            </p>
          </div>
          <div className="grid gap-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-lg bg-white/10 p-4">
                  <Icon className="h-5 w-5 text-blue-300" aria-hidden="true" />
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
              );
            })}
            <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-blue-100">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Built for focused HR productivity
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default LoginPage;
