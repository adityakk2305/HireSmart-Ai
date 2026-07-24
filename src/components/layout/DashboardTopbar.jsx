import { KeyRound, LogOut, Menu, Settings, UserCircle } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { openMobileSidebar } from "../../app/store.js";
import useAuth from "../../hooks/useAuth.js";
import useCompany from "../../hooks/useCompany.js";
import Button from "../common/Button.jsx";

const DashboardTopbar = ({ title = "Overview", subtitle = "Secure hiring workspace" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const { company } = useCompany();
  const [open, setOpen] = useState(false);
  const basePath = user?.role === "admin" ? "/admin" : "/dashboard";
  const initials = (user?.name || "User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 print:hidden sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => dispatch(openMobileSidebar())}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <div>
          <p className="text-sm font-semibold text-slate-950">{title}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-left"
        >
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </span>
          <span className="hidden text-right sm:block">
            <span className="block text-xs font-bold text-slate-900">{user?.name || "User"}</span>
            <span className="block text-[11px] font-semibold uppercase text-slate-500">
              {company?.name || user?.role || "role"}
            </span>
          </span>
        </button>
        {open ? (
          <div className="absolute right-0 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
            <Link
              to={`${basePath}/profile`}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              <UserCircle className="h-4 w-4" /> Profile
            </Link>
            {user?.role === "hr" ? (
              <Link
                to="/dashboard/company-settings"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                <Settings className="h-4 w-4" /> Company settings
              </Link>
            ) : null}
            <Link
              to={`${basePath}/change-password`}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              <KeyRound className="h-4 w-4" /> Change password
            </Link>
            <div className="mt-2 border-t border-slate-200 pt-2">
              <Button variant="danger" icon={LogOut} loading={loading} onClick={handleLogout} className="w-full">
                Logout
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default DashboardTopbar;
