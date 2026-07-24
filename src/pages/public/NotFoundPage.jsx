import { Home, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button.jsx";

const NotFoundPage = () => (
  <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16 dark:bg-slate-950">
    <div className="max-w-xl text-center">
      <p className="text-sm font-bold uppercase tracking-wide text-blue-600 dark:text-blue-300">404</p>
      <h1 className="mt-3 text-4xl font-bold text-slate-950 dark:text-white">Page not found</h1>
      <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
        The page you are looking for may have moved, expired or never existed.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/">
          <Button icon={Home}>Back home</Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="outline" icon={LayoutDashboard}>
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

export default NotFoundPage;
