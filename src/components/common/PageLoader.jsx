import Loader from "./Loader.jsx";

const PageLoader = ({ message = "Loading HireSmart AI" }) => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-4 text-slate-700 shadow-sm">
      <Loader />
      <span className="text-sm font-semibold">{message}</span>
    </div>
  </div>
);

export default PageLoader;
