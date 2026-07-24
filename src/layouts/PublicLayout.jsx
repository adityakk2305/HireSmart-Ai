import { Link, Outlet } from "react-router-dom";
import PublicNavbar from "../components/layout/PublicNavbar.jsx";
import { APP_NAME } from "../utils/constants.js";

const PublicLayout = () => (
  <div className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-100">
    <PublicNavbar />
    <main className="pt-0">
      <Outlet />
    </main>
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-slate-500 dark:text-slate-400 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{APP_NAME}</p>
          <p className="mt-1">AI resume screening, candidate ranking and hiring workflow automation.</p>
        </div>
        <div className="flex flex-wrap gap-4 font-semibold">
          <Link to="/" className="hover:text-blue-700 dark:hover:text-blue-300">Home</Link>
          <Link to="/features" className="hover:text-blue-700 dark:hover:text-blue-300">Features</Link>
          <Link to="/pricing" className="hover:text-blue-700 dark:hover:text-blue-300">Pricing</Link>
          <Link to="/application-status" className="hover:text-blue-700 dark:hover:text-blue-300">Application status</Link>
        </div>
        <p className="md:col-span-2">&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
      </div>
    </footer>
  </div>
);

export default PublicLayout;
