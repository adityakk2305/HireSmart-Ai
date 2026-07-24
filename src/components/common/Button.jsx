import Loader from "./Loader.jsx";

const variantClasses = {
  primary: "bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400",
  secondary: "bg-slate-900 text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-600 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white",
  outline:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
  ghost:
    "text-slate-700 hover:bg-slate-100 focus-visible:ring-blue-500 dark:text-slate-200 dark:hover:bg-slate-800",
  danger: "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500 dark:bg-red-500 dark:hover:bg-red-400"
};

const sizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base"
};

const Button = ({
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  children,
  className = "",
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    {...props}
  >
    {loading ? <Loader size="sm" /> : Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
    <span>{children}</span>
  </button>
);

export default Button;
