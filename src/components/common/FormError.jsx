const FormError = ({ children, className = "" }) => {
  if (!children) return null;

  return (
    <div
      role="alert"
      className={`rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200 ${className}`}
    >
      {children}
    </div>
  );
};

export default FormError;
