import { KeyRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../../api/authApi.js";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";

const passwordChecks = [
  { label: "8+ characters", test: (value) => value.length >= 8 },
  { label: "Uppercase letter", test: (value) => /[A-Z]/.test(value) },
  { label: "Lowercase letter", test: (value) => /[a-z]/.test(value) },
  { label: "Number", test: (value) => /[0-9]/.test(value) },
  { label: "Special character", test: (value) => /[^A-Za-z0-9]/.test(value) }
];

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = useMemo(
    () => passwordChecks.map((check) => ({ ...check, valid: check.test(form.password) })),
    [form.password]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!strength.every((item) => item.valid)) {
      nextErrors.password = "Password must meet every requirement.";
    }

    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords must match.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, form);
      setSuccess(true);
      toast.success("Password reset successful. Please login with your new password.");
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (apiError) {
      setErrors({
        form: apiError.response?.data?.message || "Reset link is invalid or expired."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-950">Reset password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Choose a strong new password for your HireSmart AI account.
        </p>
        {errors.form ? (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
            {errors.form}
          </div>
        ) : null}
        {success ? (
          <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-700">
            Password updated. Redirecting to login.
          </div>
        ) : null}
        <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
          <Input
            label="New password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-700">Password requirements</p>
            <div className="mt-3 grid gap-2">
              {strength.map((item) => (
                <p
                  key={item.label}
                  className={`text-sm font-medium ${item.valid ? "text-green-700" : "text-slate-500"}`}
                >
                  {item.valid ? "✓" : "-"} {item.label}
                </p>
              ))}
            </div>
          </div>
          <Input
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />
          <Button type="submit" icon={KeyRound} loading={loading} className="w-full">
            Reset password
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800">
            Back to login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
