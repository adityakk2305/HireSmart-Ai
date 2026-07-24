import { ChevronLeft, ChevronRight, LogOut, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { toggleSidebar } from "../../app/store.js";
import useAuth from "../../hooks/useAuth.js";
import useCompany from "../../hooks/useCompany.js";
import { APP_NAME } from "../../utils/constants.js";
import Button from "../common/Button.jsx";

const DashboardSidebar = ({ links, label = "Dashboard" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const { user, logout, loading } = useAuth();
  const { company, hasCompany } = useCompany();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`hidden min-h-screen flex-col border-r border-slate-800 bg-slate-950 text-white transition-all print:hidden lg:flex ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="rounded-lg bg-blue-600 p-2">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          {sidebarOpen ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{APP_NAME}</p>
              <p className="truncate text-xs text-slate-400">
                {user?.role === "hr" ? company?.name || "Complete company setup" : label}
              </p>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {user?.role === "hr" && !hasCompany ? (
          <NavLink
            to="/dashboard/company-onboarding"
            title="Complete company setup"
            className={({ isActive }) =>
              `mb-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                isActive ? "bg-blue-600 text-white" : "bg-slate-900 text-blue-100 hover:bg-slate-800"
              } ${sidebarOpen ? "" : "justify-center"}`
            }
          >
            <Sparkles className="h-5 w-5 shrink-0" aria-hidden="true" />
            {sidebarOpen ? <span className="truncate">Complete company setup</span> : null}
          </NavLink>
        ) : null}
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard" || item.path === "/admin"}
              title={item.label}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                } ${sidebarOpen ? "" : "justify-center"}`
              }
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {sidebarOpen ? <span className="truncate">{item.label}</span> : null}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-3">
        {sidebarOpen ? (
          <div className="mb-3 rounded-lg bg-slate-900 p-3">
            <p className="truncate text-sm font-bold text-white">{user?.name || "User"}</p>
            <p className="truncate text-xs font-semibold uppercase text-slate-400">
              {company?.name || user?.role || "role"}
            </p>
          </div>
        ) : null}
        <Button
          variant="secondary"
          icon={LogOut}
          loading={loading}
          onClick={handleLogout}
          className="w-full justify-center bg-slate-900"
        >
          {sidebarOpen ? "Logout" : ""}
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
