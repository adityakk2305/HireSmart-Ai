import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/layout/DashboardSidebar.jsx";
import DashboardTopbar from "../components/layout/DashboardTopbar.jsx";
import MobileSidebar from "../components/layout/MobileSidebar.jsx";
import { ADMIN_LINKS } from "../utils/constants.js";

const AdminLayout = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="flex">
      <DashboardSidebar links={ADMIN_LINKS} label="Admin console" />
      <MobileSidebar links={ADMIN_LINKS} title="Admin console" />
      <div className="min-w-0 flex-1">
        <DashboardTopbar title="Admin console" />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  </div>
);

export default AdminLayout;
