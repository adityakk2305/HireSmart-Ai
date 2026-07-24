import { ArrowLeft, LayoutDashboard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import useAuth from "../../hooks/useAuth.js";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const dashboardPath = user?.role === "admin" ? "/admin" : "/dashboard";

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-xl rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-red-600">Unauthorized</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">You do not have access</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Your current role does not allow this page. Continue to your correct workspace or logout.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button icon={LayoutDashboard} onClick={() => navigate(dashboardPath)}>
            My dashboard
          </Button>
          <Button variant="danger" icon={LogOut} loading={loading} onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UnauthorizedPage;
