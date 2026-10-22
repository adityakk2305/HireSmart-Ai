import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { closeMobileSidebar } from "../../app/store.js";
import useAuth from "../../hooks/useAuth.js";
import useCompany from "../../hooks/useCompany.js";
import Button from "../common/Button.jsx";

const MobileSidebar = ({ links, title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const open = useSelector((state) => state.ui.mobileSidebarOpen);
  const { user, logout, loading } = useAuth();
  const { company, hasCompany } = useCompany();

  const handleLogout = async () => {
    await logout();
    dispatch(closeMobileSidebar());
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 print:hidden lg:hidden">
      <button
        type="button"
        aria-label="Close sidebar backdrop"
        className="absolute inset-0 bg-slate-950/50"
        onClick={() => dispatch(closeMobileSidebar())}
      />
      <aside className="relative flex h-full w-80 max-w-[86vw] flex-col bg-white text-slate-950 shadow-xl dark:bg-slate-950 dark:text-white">
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          <div>
            <p className="text-sm font-bold">{title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Secure workspace</p>
          </div>
          <button
            type="button"
            onClick={() => dispatch(closeMobileSidebar())}
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-5">
          {user?.role === "hr" && !hasCompany ? (
            <NavLink
              to="/dashboard/company-onboarding"
              onClick={() => dispatch(closeMobileSidebar())}
              className={({ isActive }) =>
                `mb-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700 dark:bg-slate-900 dark:text-blue-100"
                }`
              }
            >
              Complete company setup
            </NavLink>
          ) : null}
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard" || item.path === "/admin"}
                onClick={() => dispatch(closeMobileSidebar())}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                  }`
                }
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="mb-3 rounded-lg bg-slate-100 p-3 dark:bg-slate-900">
            <p className="truncate text-sm font-bold text-slate-950 dark:text-white">{user?.name || "User"}</p>
            <p className="truncate text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              {company?.name || user?.role || "role"}
            </p>
          </div>
          <Button variant="secondary" loading={loading} onClick={handleLogout} className="w-full bg-slate-100 text-slate-950 hover:bg-slate-200 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">
            Logout
          </Button>
        </div>
      </aside>
    </div>
  );
};

export default MobileSidebar;
