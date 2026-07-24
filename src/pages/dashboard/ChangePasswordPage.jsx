import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { changePasswordRequest } from "../../api/userApi.js";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { clearAuthenticationAfterPasswordChange } from "../../features/auth/authSlice.js";

const passwordChecks = [
  { label: "8+ characters", test: (value) => value.length >= 8 },
  { label: "Uppercase letter", test: (value) => /[A-Z]/.test(value) },
  { label: "Lowercase letter", test: (value) => /[a-z]/.test(value) },
  { label: "Number", test: (value) => /[0-9]/.test(value) },
  { label: "Special character", test: (value) => /[^A-Za-z0-9]/.test(value) }
];

const ChangePasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors }, setError } = useForm();
  const newPassword = watch("newPassword") || "";
  const strength = useMemo(() => passwordChecks.map((item) => ({ ...item, valid: item.test(newPassword) })), [newPassword]);

  const onSubmit = async (values) => {
    if (!strength.every((item) => item.valid)) {
      setError("newPassword", { message: "Password must meet every requirement" });
      return;
    }

    if (values.newPassword !== values.confirmNewPassword) {
      setError("confirmNewPassword", { message: "Passwords must match" });
      return;
    }

    setLoading(true);
    try {
      await changePasswordRequest(values);
      dispatch(clearAuthenticationAfterPasswordChange());
      toast.success("Password changed. Please login again.");
      navigate("/login", { replace: true, state: { message: "Please login with your new password." } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Change password" description="Changing your password invalidates the current refresh session." />
      <form className="max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          You will be logged out after a successful password change.
        </div>
        <div className="space-y-5">
          <Input label="Current password" type={showPasswords ? "text" : "password"} error={errors.currentPassword?.message} {...register("currentPassword", { required: "Current password is required" })} />
          <Input label="New password" type={showPasswords ? "text" : "password"} error={errors.newPassword?.message} {...register("newPassword", { required: "New password is required" })} />
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-700">Password requirements</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {strength.map((item) => (
                <p key={item.label} className={`text-sm font-medium ${item.valid ? "text-green-700" : "text-slate-500"}`}>
                  {item.valid ? "✓" : "-"} {item.label}
                </p>
              ))}
            </div>
          </div>
          <Input label="Confirm new password" type={showPasswords ? "text" : "password"} error={errors.confirmNewPassword?.message} {...register("confirmNewPassword", { required: "Confirm your new password" })} />
          <button type="button" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700" onClick={() => setShowPasswords((value) => !value)}>
            {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {showPasswords ? "Hide passwords" : "Show passwords"}
          </button>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" icon={KeyRound} loading={loading}>
              Change password
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
