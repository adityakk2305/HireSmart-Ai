const Loader = ({ size = "md", label = "Loading" }) => {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-4"
  };

  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
      <span
        className={`${sizes[size]} inline-block animate-spin rounded-full border-slate-200 border-t-blue-600`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
};

export default Loader;
