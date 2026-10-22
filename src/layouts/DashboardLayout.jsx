import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/layout/DashboardSidebar.jsx";
import DashboardTopbar from "../components/layout/DashboardTopbar.jsx";
import MobileSidebar from "../components/layout/MobileSidebar.jsx";
import { DASHBOARD_LINKS } from "../utils/constants.js";

const DashboardLayout = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100">
    <div className="flex">
      <DashboardSidebar links={DASHBOARD_LINKS} label="Recruiter dashboard" />
      <MobileSidebar links={DASHBOARD_LINKS} title="Recruiter dashboard" />
      <div className="min-w-0 flex-1">
        <DashboardTopbar title="Recruiter workspace" />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  </div>
);

export default DashboardLayout;
