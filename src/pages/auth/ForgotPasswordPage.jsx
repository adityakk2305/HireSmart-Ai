import { Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "../../api/authApi.js";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [developmentResetUrl, setDevelopmentResetUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setDevelopmentResetUrl("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setLoading(true);

    try {
      const data = await forgotPassword({ email });
      setDevelopmentResetUrl(data?.developmentOnly?.resetUrl || "");
      toast.success("If an account exists, password reset instructions are available.");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to request password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-950">Forgot password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter your account email. The response stays generic to protect account privacy.
        </p>
        <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={error}
            required
          />
          <Button type="submit" icon={Mail} loading={loading} className="w-full">
            Send reset instructions
          </Button>
        </form>
        {developmentResetUrl ? (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-bold text-blue-900">Development-only reset link</p>
            <Link
              to={developmentResetUrl.replace(window.location.origin, "")}
              className="mt-2 block break-words text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              {developmentResetUrl}
            </Link>
          </div>
        ) : null}
        <p className="mt-6 text-center text-sm text-slate-600">
          Remembered it?{" "}
          <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800">
            Back to login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
